"use client"

import { UserGroupIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

export function AboutDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>关于我们</DialogTitle>
          <DialogDescription>
            UESTC Byte Lib
            编辑组是一群来自各个学院的开源爱好者。我们秉持开源合作的精神，致力于打破「闭门造车」的传统复习方式。通过飞书云文档的协同编辑功能，我们希望为信息社会下的期末复习提供全新解决方案，让复习变得更加高效、便捷。同时，我们鼓励更多的同学加入我们的行列，一起打造完美的复习文档，共同进步。
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm leading-relaxed text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground">
          😍 如果你愿意花费时间一起编辑学习文档，可以联系{" "}
          <a href={ZBWER_INVITE} target="_blank" rel="noreferrer">
            zbwer
          </a>{" "}
          加入我们哦~
        </p>
      </DialogContent>
    </Dialog>
  )
}
