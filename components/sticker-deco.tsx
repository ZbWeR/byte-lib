import { cn } from "@/lib/utils"

export function CursorMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      overflow="visible"
      aria-hidden
    >
      <path
        fill="#2d9afd"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.6"
        paintOrder="stroke"
        d="M9.80282 4.62973L15.8364 6.99069C19.3164 8.35243 21.0564 9.03329 20.9987 10.1133C20.941 11.1934 19.1251 11.6886 15.4933 12.6791C14.412 12.974 13.8713 13.1215 13.4964 13.4963C13.1215 13.8712 12.9741 14.4119 12.6791 15.4933C11.6887 19.125 11.1934 20.9409 10.1134 20.9986C9.03335 21.0563 8.35249 19.3163 6.99075 15.8363L4.62979 9.80276C3.20411 6.15934 2.49127 4.33764 3.41448 3.41442C4.3377 2.49121 6.15941 3.20405 9.80282 4.62973Z"
      />
    </svg>
  )
}

export function SparkleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path
        fill="currentColor"
        stroke="#fff"
        strokeWidth="1.6"
        paintOrder="stroke"
        d="M8 0c.35 3.4 1.4 5.25 4.2 6C9.4 7.15 8.35 9 8 12.4 7.65 9 6.6 7.15 3.8 6 6.6 5.25 7.65 3.4 8 0Z"
      />
    </svg>
  )
}

function ChipMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect
        x="7"
        y="7"
        width="18"
        height="18"
        rx="4"
        fill="#ffd54a"
        stroke="#fff"
        strokeWidth="3"
        paintOrder="stroke"
      />
      <rect x="11" y="11" width="10" height="10" rx="2" fill="#ff5aa5" />
      <path
        d="M10 4v3M16 4v3M22 4v3M10 25v3M16 25v3M22 25v3M4 10h3M4 16h3M4 22h3M25 10h3M25 16h3M25 22h3"
        stroke="#6ec8ff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CodeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 28" className={className} aria-hidden>
      <rect
        x="2"
        y="2"
        width="32"
        height="24"
        rx="7"
        fill="#2d9afd"
        stroke="#fff"
        strokeWidth="3"
        paintOrder="stroke"
      />
      <path
        d="M13 9 8 14l5 5M23 9l5 5-5 5M19 8l-3 12"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PawMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <ellipse
        cx="12"
        cy="16.2"
        rx="6.2"
        ry="5"
        fill="#ff5aa5"
        stroke="#fff"
        strokeWidth="2.4"
        paintOrder="stroke"
      />
      <circle
        cx="6.2"
        cy="9.2"
        r="2.1"
        fill="#ff5aa5"
        stroke="#fff"
        strokeWidth="2"
        paintOrder="stroke"
      />
      <circle
        cx="11"
        cy="6.6"
        r="2.1"
        fill="#ff5aa5"
        stroke="#fff"
        strokeWidth="2"
        paintOrder="stroke"
      />
      <circle
        cx="16.4"
        cy="7.2"
        r="2.1"
        fill="#ff5aa5"
        stroke="#fff"
        strokeWidth="2"
        paintOrder="stroke"
      />
      <circle
        cx="19.2"
        cy="11.4"
        r="2"
        fill="#ff5aa5"
        stroke="#fff"
        strokeWidth="2"
        paintOrder="stroke"
      />
    </svg>
  )
}

function PlusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path
        d="M10 3v14M3 10h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SquiggleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 18" className={className} aria-hidden>
      <path
        d="M2 12c6-10 10 8 16 0s10 8 16 0 8-10 12-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TriangleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 20" className={className} aria-hidden>
      <path
        d="M11 3.2 20 17H2Z"
        fill="#ffd54a"
        stroke="#fff"
        strokeWidth="3"
        strokeLinejoin="round"
        paintOrder="stroke"
      />
    </svg>
  )
}

type MemphisLayerProps = {
  variant?: "home" | "page"
  className?: string
}

export function MemphisLayer({
  variant = "page",
  className,
}: MemphisLayerProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <span
        className="memphis-float absolute top-[12%] left-[6%] text-sticker-pink max-md:left-[3%]"
        style={{ animationDelay: "0.2s" }}
      >
        <SparkleMark className="size-6" />
      </span>
      <span
        className="memphis-wiggle absolute top-[18%] right-[8%] text-sticker-cyan max-md:right-[3%]"
        style={{ animationDelay: "0.8s" }}
      >
        <PlusMark className="size-5" />
      </span>
      <span
        className="memphis-float absolute top-[42%] left-[3%] max-md:hidden"
        style={{ animationDelay: "1.1s" }}
      >
        <ChipMark className="size-10 rotate-[-18deg]" />
      </span>
      <span
        className="memphis-float absolute right-[4%] bottom-[22%] max-md:bottom-[12%] max-md:size-8"
        style={{ animationDelay: "1.6s" }}
      >
        <CodeMark className="w-14 rotate-[12deg]" />
      </span>
      <span
        className="memphis-wiggle absolute bottom-[16%] left-[10%] text-sticker-blue"
        style={{ animationDelay: "0.4s" }}
      >
        <PawMark className="size-8 rotate-[-12deg]" />
      </span>
      <span
        className="memphis-float absolute top-[58%] right-[12%] max-md:hidden"
        style={{ animationDelay: "2s" }}
      >
        <TriangleMark className="size-7 rotate-[18deg]" />
      </span>
      <span
        className="memphis-float absolute top-[8%] left-[28%] text-sticker-yellow max-md:hidden"
        style={{ animationDelay: "1.3s" }}
      >
        <SquiggleMark className="w-16" />
      </span>
      {variant === "home" ? (
        <>
          <span
            className="memphis-float absolute top-[28%] right-[22%] max-md:hidden"
            style={{ animationDelay: "0.6s" }}
          >
            <CursorMark className="size-8 rotate-[18deg]" />
          </span>
          <span
            className="memphis-float absolute right-[18%] bottom-[36%] text-sticker-cyan max-md:hidden"
            style={{ animationDelay: "1.8s" }}
          >
            <SparkleMark className="size-4" />
          </span>
        </>
      ) : (
        <span
          className="memphis-float absolute top-[30%] right-[6%] max-md:hidden"
          style={{ animationDelay: "0.5s" }}
        >
          <CursorMark className="size-7 rotate-[12deg]" />
        </span>
      )}
    </div>
  )
}
