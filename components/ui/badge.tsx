import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border-2 border-white px-2.5 py-0.5 font-heading text-xs font-semibold whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_0_2px_var(--sticker-ink),2px_2px_0_var(--sticker-blue)] [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_0_0_2px_var(--sticker-ink),2px_2px_0_var(--sticker-pink)] [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive shadow-[0_0_0_2px_var(--sticker-ink)] [a]:hover:bg-destructive/20",
        outline:
          "bg-card text-foreground shadow-[0_0_0_2px_var(--sticker-ink),2px_2px_0_var(--sticker-yellow)] [a]:hover:bg-muted",
        ghost:
          "border-transparent shadow-none hover:bg-muted hover:text-muted-foreground",
        link: "border-transparent text-sticker-blue underline-offset-4 shadow-none hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
