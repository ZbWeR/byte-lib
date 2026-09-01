"use client"

import {
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react"

const THRESHOLD = 22
/**
 * 触发翻页后先锁一小段，把同一记触控板手势的惯性尾巴丢掉。
 * 冷却还没结束时，只有鼠标滚轮的离散格、或明显更大的新一记轻扫，才能再翻一页。
 */
const BURST_LOCK_MS = 70
const STEP_COOLDOWN_MS = 200
const FLICK_DELTA = 28
const NOTCH_DELTA = 80
const NOTCH_GAP_MS = 90
const IDLE_MS = 120
const CLICK_SLOP_PX = 16
const DRAG_STEP_PX = 60
const RUBBER_PX = 10
const RUBBER_MS = 300

export function wrapIndex(value: number, count: number) {
  if (count <= 0) {
    return 0
  }
  return ((value % count) + count) % count
}

/** Shortest signed distance on a ring, so the last card sits left of the first. */
export function wrapOffset(i: number, active: number, count: number) {
  if (count <= 0) {
    return 0
  }
  let offset = i - active
  const half = count / 2
  if (offset > half) {
    offset -= count
  } else if (offset < -half) {
    offset += count
  }
  return offset
}

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
  const lastStepAtRef = useRef(0)
  const idleTimerRef = useRef(0)
  const rubberTimerRef = useRef(0)
  const dragStartXRef = useRef<number | null>(null)
  const dragTargetRef = useRef<EventTarget | null>(null)
  const draggingRef = useRef(false)
  const suppressClickRef = useRef(false)
  const capturedIdRef = useRef<number | null>(null)
  const indexRef = useRef(index)
  const onEnterRef = useRef(onEnter)

  useEffect(() => {
    indexRef.current = index
    onEnterRef.current = onEnter
  }, [index, onEnter])

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
      if (dir === 0 || count <= 0) {
        return false
      }
      if (count === 1) {
        rubber(dir)
        return false
      }
      setIndex(wrapIndex(indexRef.current + dir, count))
      return true
    },
    [count, rubber, setIndex]
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

      let d =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY
      if (event.deltaMode === 1) {
        d *= 16
      } else if (event.deltaMode === 2) {
        d *= 800
      }

      const now = Date.now()
      const sinceStep = now - lastStepAtRef.current
      const isNotch = Math.abs(d) >= NOTCH_DELTA
      const isFlick = Math.abs(d) >= FLICK_DELTA

      if (sinceStep < BURST_LOCK_MS) {
        return
      }
      if (sinceStep < STEP_COOLDOWN_MS && !isNotch && !isFlick) {
        return
      }
      if (isNotch && sinceStep < NOTCH_GAP_MS) {
        return
      }

      accRef.current += d
      window.clearTimeout(idleTimerRef.current)
      idleTimerRef.current = window.setTimeout(() => {
        accRef.current = 0
      }, IDLE_MS)

      if (Math.abs(accRef.current) >= THRESHOLD || isNotch) {
        const moved = step(Math.sign(accRef.current || d))
        accRef.current = 0
        if (moved) {
          lastStepAtRef.current = now
        }
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
        onEnterRef.current?.()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [count, enabled, setIndex, step])

  useEffect(() => {
    const el = stageRef.current
    if (!el) {
      return
    }

    const isChrome = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest("[data-stage-chrome]"))

    const releaseCapture = (pointerId: number) => {
      if (capturedIdRef.current !== pointerId) {
        return
      }
      if (el.hasPointerCapture(pointerId)) {
        el.releasePointerCapture(pointerId)
      }
      capturedIdRef.current = null
    }

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
      dragTargetRef.current = event.target
      draggingRef.current = false
      suppressClickRef.current = false
    }

    const onPointerMove = (event: PointerEvent) => {
      if (dragStartXRef.current === null) {
        return
      }
      const dx = event.clientX - dragStartXRef.current
      if (!draggingRef.current) {
        if (Math.abs(dx) <= CLICK_SLOP_PX) {
          return
        }
        draggingRef.current = true
        suppressClickRef.current = true
        if (!el.hasPointerCapture(event.pointerId)) {
          el.setPointerCapture(event.pointerId)
          capturedIdRef.current = event.pointerId
        }
      }
      setShiftX(dx * 0.35, false)
    }

    const endPointer = (event: PointerEvent) => {
      if (dragStartXRef.current === null) {
        return
      }
      const dx = event.clientX - dragStartXRef.current
      const target = dragTargetRef.current
      const wasDragging = draggingRef.current
      dragStartXRef.current = null
      dragTargetRef.current = null
      draggingRef.current = false
      releaseCapture(event.pointerId)

      if (wasDragging) {
        if (Math.abs(dx) > DRAG_STEP_PX) {
          step(dx < 0 ? 1 : -1)
        }
        setShiftX(0, true)
        return
      }

      setShiftX(0, false)
      if (!(target instanceof Element)) {
        return
      }
      const card = target.closest("[data-stage-card]")
      if (!card) {
        return
      }
      const offset = Number(card.getAttribute("data-offset"))
      // Let the center card's <Link> receive the real click so it can navigate.
      if (offset === 0) {
        return
      }
      if (Number.isInteger(offset)) {
        suppressClickRef.current = true
        setIndex(wrapIndex(indexRef.current + offset, count))
      }
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
  }, [count, enabled, setIndex, setShiftX, step])

  useEffect(() => {
    return () => {
      window.clearTimeout(idleTimerRef.current)
      window.clearTimeout(rubberTimerRef.current)
    }
  }, [])

  return { stageRef, step }
}
