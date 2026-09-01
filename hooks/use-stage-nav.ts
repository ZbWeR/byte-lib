"use client"

import {
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react"

const THRESHOLD = 42
/**
 * 触控板一次滑动会连发几十个 wheel 事件，惯性尾巴可以持续一秒以上。
 * 单纯用固定冷却时间挡不住：冷却一过，还在滑行的同一个手势就会再走一格。
 * 所以触发后直接「卸掉扳机」，只有当滚轮真正静默 REARM_IDLE_MS 之后才重新武装，
 * 这样无论手势多长，一次滑动都只走一格。
 */
const REARM_IDLE_MS = 160
/**
 * 鼠标滚轮和触控板必须区别对待：滚轮是离散的，一格通常 100px 以上、间隔上百毫秒，
 * 用「等静默」那套会把连续拨轮吃掉，手感发木；触控板是高频小增量。
 * 所以大增量按「一格一步」处理，只用一个短冷却防止动画被打断。
 */
const NOTCH_DELTA = 100
const NOTCH_GAP_MS = 220
const IDLE_MS = 180
const DRAG_STEP_PX = 60
const RUBBER_PX = 10
const RUBBER_MS = 300

export function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

type UseStageNavOptions = {
  count: number
  index: number
  setIndex: Dispatch<SetStateAction<number>>
  enabled: boolean
  onEnter?: () => void
}

export function useStageNav({
  count,
  index,
  setIndex,
  enabled,
  onEnter,
}: UseStageNavOptions) {
  const stageRef = useRef<HTMLElement | null>(null)
  const accRef = useRef(0)
  const armedRef = useRef(true)
  const lastStepAtRef = useRef(0)
  const rearmTimerRef = useRef(0)
  const idleTimerRef = useRef(0)
  const rubberTimerRef = useRef(0)
  const dragStartXRef = useRef<number | null>(null)
  const suppressClickRef = useRef(false)

  const setShiftX = useCallback((value: number, withTransition: boolean) => {
    const el = stageRef.current
    if (!el) {
      return
    }
    el.style.transition = withTransition
      ? "transform 300ms var(--ease-soft)"
      : "none"
    el.style.transform = `translateX(${value}px)`
  }, [])

  const rubber = useCallback(
    (dir: number) => {
      window.clearTimeout(rubberTimerRef.current)
      setShiftX(dir * RUBBER_PX, true)
      rubberTimerRef.current = window.setTimeout(() => {
        setShiftX(0, true)
      }, RUBBER_MS)
    },
    [setShiftX]
  )

  const step = useCallback(
    (dir: number) => {
      if (dir === 0) {
        return false
      }
      const next = index + dir
      if (next < 0 || next >= count) {
        rubber(dir)
        return false
      }
      setIndex(next)
      return true
    },
    [count, index, rubber, setIndex]
  )

  useEffect(() => {
    const el = stageRef.current
    if (!el) {
      return
    }

    const onWheel = (event: WheelEvent) => {
      if (!enabled) {
        return
      }
      event.preventDefault()

      // 只要事件流还没断，就把「重新武装」不断往后推迟。
      window.clearTimeout(rearmTimerRef.current)
      rearmTimerRef.current = window.setTimeout(() => {
        armedRef.current = true
        accRef.current = 0
      }, REARM_IDLE_MS)

      const d =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY
      const now = Date.now()
      const isNotch = Math.abs(d) >= NOTCH_DELTA

      if (!armedRef.current) {
        // 惯性尾巴一律吞掉；但离散的滚轮大格应当继续响应
        if (!isNotch || now - lastStepAtRef.current < NOTCH_GAP_MS) {
          accRef.current = 0
          return
        }
        armedRef.current = true
        accRef.current = 0
      }

      accRef.current += d
      window.clearTimeout(idleTimerRef.current)
      idleTimerRef.current = window.setTimeout(() => {
        accRef.current = 0
      }, IDLE_MS)
      if (Math.abs(accRef.current) >= THRESHOLD) {
        step(Math.sign(accRef.current))
        accRef.current = 0
        armedRef.current = false
        lastStepAtRef.current = now
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel)
    }
  }, [enabled, step])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!enabled) {
        return
      }
      if (event.defaultPrevented || event.repeat) {
        return
      }
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }
      if (isTypingTarget(event.target)) {
        return
      }

      const key = event.key
      if (
        key === "ArrowRight" ||
        key === "ArrowDown" ||
        key === "ArrowLeft" ||
        key === "ArrowUp" ||
        key === "Home" ||
        key === "End" ||
        key === "Enter" ||
        key === " " ||
        (key >= "1" && key <= "9")
      ) {
        event.preventDefault()
      }

      if (key === "ArrowRight" || key === "ArrowDown") {
        step(1)
        return
      }
      if (key === "ArrowLeft" || key === "ArrowUp") {
        step(-1)
        return
      }
      if (key === "Home") {
        setIndex(0)
        return
      }
      if (key === "End") {
        setIndex(count - 1)
        return
      }
      if (key >= "1" && key <= "9") {
        const next = Number(key) - 1
        if (next >= 0 && next < count) {
          setIndex(next)
        }
        return
      }
      if (key === "Enter" || key === " ") {
        onEnter?.()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [count, enabled, onEnter, setIndex, step])

  useEffect(() => {
    const el = stageRef.current
    if (!el) {
      return
    }

    const isChrome = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest("[data-stage-chrome]"))

    const onPointerDown = (event: PointerEvent) => {
      if (!enabled) {
        return
      }
      if (event.button !== 0) {
        return
      }
      if (isChrome(event.target)) {
        return
      }
      dragStartXRef.current = event.clientX
      suppressClickRef.current = false
      el.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (dragStartXRef.current === null) {
        return
      }
      const dx = event.clientX - dragStartXRef.current
      if (Math.abs(dx) > 8) {
        suppressClickRef.current = true
      }
      setShiftX(dx * 0.35, false)
    }

    const endPointer = (event: PointerEvent) => {
      if (dragStartXRef.current === null) {
        return
      }
      const dx = event.clientX - dragStartXRef.current
      dragStartXRef.current = null
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId)
      }
      if (Math.abs(dx) > DRAG_STEP_PX) {
        step(dx < 0 ? 1 : -1)
      }
      setShiftX(0, true)
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClickRef.current) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      suppressClickRef.current = false
    }

    el.addEventListener("pointerdown", onPointerDown)
    el.addEventListener("pointermove", onPointerMove)
    el.addEventListener("pointerup", endPointer)
    el.addEventListener("pointercancel", endPointer)
    el.addEventListener("click", onClickCapture, true)
    return () => {
      el.removeEventListener("pointerdown", onPointerDown)
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerup", endPointer)
      el.removeEventListener("pointercancel", endPointer)
      el.removeEventListener("click", onClickCapture, true)
    }
  }, [enabled, setShiftX, step])

  useEffect(() => {
    return () => {
      window.clearTimeout(idleTimerRef.current)
      window.clearTimeout(rubberTimerRef.current)
      window.clearTimeout(rearmTimerRef.current)
    }
  }, [])

  return { stageRef, step }
}
