"use client"

import { UserGroupIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ZBWER_INVITE =
  "https://www.feishu.cn/invitation/page/add_contact/?token=23bm5ca7-2bb6-4c0b-be1e-2dd880f67acd"

type AboutDialogContextValue = {
  setOpen: (open: boolean) => void
}

const AboutDialogContext = createContext<AboutDialogContextValue | null>(null)

export function useAboutDialog() {
  const ctx = useContext(AboutDialogContext)
  if (!ctx) {
    throw new Error("useAboutDialog must be used within AboutDialogProvider")
  }
  return ctx
}

export function AboutDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const value = useMemo(() => ({ setOpen }), [])

  return (
    <AboutDialogContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="[--sticker-shadow:var(--sticker-cyan)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>关于我们</DialogTitle>
          </DialogHeader>
          <p className="text-base leading-[1.95] text-foreground/80">
            “UESTC Byte Lib
            编辑组是一群来自各个学院的开源爱好者。我们秉持开源合作的精神，致力于打破「闭门造车」的传统复习方式。通过飞书云文档的协同编辑功能，我们希望为信息社会下的期末复习提供全新解决方案，让复习变得更加高效、便捷。同时，我们鼓励更多的同学加入我们的行列，一起打造完美的复习文档，共同进步。”
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            😍 如果你愿意花费时间一起编辑学习文档，可以联系{" "}
            <a
              href={ZBWER_INVITE}
              target="_blank"
              rel="noreferrer"
              className="font-heading font-semibold text-sticker-blue underline-offset-3 hover:underline"
            >
              zbwer
            </a>{" "}
            加入我们哦~
          </p>
        </DialogContent>
      </Dialog>
    </AboutDialogContext.Provider>
  )
}

export function AboutTrigger() {
  const { setOpen } = useAboutDialog()

  return (
    <Tooltip>
      <TooltipTrigger
        delay={200}
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="关于我们"
            onClick={() => setOpen(true)}
          />
        }
      >
        <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />
      </TooltipTrigger>
      <TooltipContent>关于我们</TooltipContent>
    </Tooltip>
  )
}
