"use client"

import {
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react"

const THRESHOLD = 42
const LOCK_MS = 520
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
  const lockedUntilRef = useRef(0)
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
      const now = Date.now()
      if (now < lockedUntilRef.current) {
        return
      }
      const d =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY
      accRef.current += d
      window.clearTimeout(idleTimerRef.current)
      idleTimerRef.current = window.setTimeout(() => {
        accRef.current = 0
      }, IDLE_MS)
      if (Math.abs(accRef.current) >= THRESHOLD) {
        step(Math.sign(accRef.current))
        accRef.current = 0
        lockedUntilRef.current = now + LOCK_MS
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
    }
  }, [])

  return { stageRef, step }
}
