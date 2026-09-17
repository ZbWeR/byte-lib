import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 touch-manipulation items-center justify-center rounded-2xl border-2 border-transparent bg-clip-padding font-heading text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-white bg-primary text-primary-foreground shadow-[0_0_0_2.5px_var(--sticker-ink),4px_4px_0_var(--sticker-blue)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[0_0_0_2.5px_var(--sticker-ink),6px_6px_0_var(--sticker-blue)]",
        outline:
          "border-white bg-background text-foreground shadow-[0_0_0_2.5px_var(--sticker-ink)] hover:-translate-y-px",
        secondary:
          "border-white bg-secondary text-secondary-foreground shadow-[0_0_0_2.5px_var(--sticker-ink),3px_3px_0_var(--sticker-pink)] hover:-translate-y-px",
        ghost:
          "border-transparent shadow-none hover:border-white hover:bg-white hover:shadow-[0_0_0_2px_var(--sticker-ink)] dark:hover:bg-card",
        destructive:
          "border-white bg-destructive/10 text-destructive shadow-[0_0_0_2.5px_var(--sticker-ink),3px_3px_0_#ff8aa0] hover:bg-destructive/20",
        link: "border-transparent text-sticker-blue underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 rounded-xl px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
