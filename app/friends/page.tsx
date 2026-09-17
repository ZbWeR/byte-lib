import type { Metadata } from "next"

import { FriendsView } from "@/components/friends/friends-view"

export const metadata: Metadata = {
  title: "友情链接",
  description:
    "UESTC Byte Lib 的友情链接。目前收录 Ac-Wiki，也欢迎互相挂链的高校知识站来交换。",
}

export default function FriendsPage() {
  return <FriendsView />
}
