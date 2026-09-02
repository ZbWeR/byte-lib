"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

/** Same hover-falloff lattice as React Bits DotGrid, without paid GSAP plugins. */

const GAP = 26
const DOT_RADIUS = 0.9
const FIELD_RADIUS = 150
const REPEL = 2400
const SPRING = 42
const DAMPING = 6.4
const MAX_SPEED = 420
const SETTLE = 0.018

type DotFieldProps = {
  className?: string
}

function parseRgb(color: string) {
  const match = color.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/)
  if (!match) {
    return { r: 24, g: 24, b: 22 }
  }
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  }
}

export function DotField({ className }: DotFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const probeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const probe = probeRef.current
    if (!wrap || !canvas || !probe) {
      return
    }

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) {
      return
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const pointer = { x: 0, y: 0, inside: false }
    let restX = new Float32Array(0)
    let restY = new Float32Array(0)
    let x = new Float32Array(0)
    let y = new Float32Array(0)
    let vx = new Float32Array(0)
    let vy = new Float32Array(0)
    let count = 0
    let cssWidth = 0
    let cssHeight = 0
    let raf = 0
    let last = performance.now()
    let settled = false
    let rgb = parseRgb(getComputedStyle(probe).color)

    const readColor = () => {
      rgb = parseRgb(getComputedStyle(probe).color)
      settled = false
      if (reduced.matches) {
        drawStatic()
      }
    }

    const build = () => {
      const rect = wrap.getBoundingClientRect()
      cssWidth = rect.width
      cssHeight = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(cssWidth * dpr))
      canvas.height = Math.max(1, Math.floor(cssHeight * dpr))
      canvas.style.width = `${cssWidth}px`
      canvas.style.height = `${cssHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.max(1, Math.floor((cssWidth + GAP) / GAP))
      const rows = Math.max(1, Math.floor((cssHeight + GAP) / GAP))
      const gridW = (cols - 1) * GAP
      const gridH = (rows - 1) * GAP
      const startX = (cssWidth - gridW) / 2
      const startY = (cssHeight - gridH) / 2
      count = cols * rows
      restX = new Float32Array(count)
      restY = new Float32Array(count)
      x = new Float32Array(count)
      y = new Float32Array(count)
      vx = new Float32Array(count)
      vy = new Float32Array(count)

      let i = 0
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cx = startX + col * GAP
          const cy = startY + row * GAP
          restX[i] = cx
          restY[i] = cy
          x[i] = cx
          y[i] = cy
          vx[i] = 0
          vy[i] = 0
          i += 1
        }
      }
      settled = false
      if (reduced.matches) {
        drawStatic()
      }
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, cssWidth, cssHeight)
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16)`
      for (let i = 0; i < count; i++) {
        ctx.beginPath()
        ctx.arc(restX[i], restY[i], DOT_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const draw = (dt: number) => {
      const radiusSq = FIELD_RADIUS * FIELD_RADIUS
      let energy = 0

      for (let i = 0; i < count; i++) {
        const rx = restX[i]
        const ry = restY[i]
        let fx = (rx - x[i]) * SPRING
        let fy = (ry - y[i]) * SPRING

        if (pointer.inside) {
          const dx = rx - pointer.x
          const dy = ry - pointer.y
          const dsq = dx * dx + dy * dy
          if (dsq < radiusSq && dsq > 0.25) {
            const dist = Math.sqrt(dsq)
            const falloff = 1 - dist / FIELD_RADIUS
            const force = REPEL * falloff * falloff
            fx += (dx / dist) * force
            fy += (dy / dist) * force
          }
        }

        vx[i] += fx * dt
        vy[i] += fy * dt
        const damp = Math.exp(-DAMPING * dt)
        vx[i] *= damp
        vy[i] *= damp

        const speed = Math.hypot(vx[i], vy[i])
        if (speed > MAX_SPEED) {
          const scale = MAX_SPEED / speed
          vx[i] *= scale
          vy[i] *= scale
        }

        x[i] += vx[i] * dt
        y[i] += vy[i] * dt
        energy +=
          Math.abs(x[i] - rx) +
          Math.abs(y[i] - ry) +
          Math.abs(vx[i]) +
          Math.abs(vy[i])
      }

      ctx.clearRect(0, 0, cssWidth, cssHeight)
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.14)`
      ctx.beginPath()
      for (let i = 0; i < count; i++) {
        const dx = restX[i] - pointer.x
        const dy = restY[i] - pointer.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const near = pointer.inside ? Math.max(0, 1 - dist / FIELD_RADIUS) : 0
        if (near > 0.04) {
          continue
        }
        ctx.moveTo(x[i] + DOT_RADIUS, y[i])
        ctx.arc(x[i], y[i], DOT_RADIUS, 0, Math.PI * 2)
      }
      ctx.fill()

      for (let i = 0; i < count; i++) {
        const dx = restX[i] - pointer.x
        const dy = restY[i] - pointer.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const near = pointer.inside ? Math.max(0, 1 - dist / FIELD_RADIUS) : 0
        if (near <= 0.04) {
          continue
        }
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.14 + near * 0.22})`
        ctx.beginPath()
        ctx.arc(x[i], y[i], DOT_RADIUS + near * 0.35, 0, Math.PI * 2)
        ctx.fill()
      }

      settled = energy < count * SETTLE && !pointer.inside
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) {
        last = now
        return
      }
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      if (settled) {
        return
      }
      draw(dt)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.inside =
        pointer.x >= -FIELD_RADIUS &&
        pointer.y >= -FIELD_RADIUS &&
        pointer.x <= cssWidth + FIELD_RADIUS &&
        pointer.y <= cssHeight + FIELD_RADIUS
      settled = false
    }

    const onPointerLeave = () => {
      pointer.inside = false
      settled = false
    }

    const onVisibility = () => {
      last = performance.now()
    }

    build()
    readColor()
    if (reduced.matches) {
      drawStatic()
    } else {
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    const resize = new ResizeObserver(build)
    resize.observe(wrap)

    const theme = new MutationObserver(readColor)
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })

    const onReduce = () => {
      cancelAnimationFrame(raf)
      build()
      readColor()
      if (reduced.matches) {
        drawStatic()
        return
      }
      settled = false
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerleave", onPointerLeave)
    document.addEventListener("visibilitychange", onVisibility)
    reduced.addEventListener("change", onReduce)

    return () => {
      cancelAnimationFrame(raf)
      resize.disconnect()
      theme.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerleave", onPointerLeave)
      document.removeEventListener("visibilitychange", onVisibility)
      reduced.removeEventListener("change", onReduce)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={cn("absolute inset-0", className)}
    >
      <span
        ref={probeRef}
        className="pointer-events-none absolute size-0 overflow-hidden text-foreground"
      />
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
