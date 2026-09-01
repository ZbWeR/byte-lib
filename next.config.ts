import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 开发服务器绑定 0.0.0.0 时，Next 16 会把 127.0.0.1 / localhost 视为跨源
  // 并对 /_next 下的开发资源返回 403，导致客户端 JS 完全加载不出来。
  allowedDevOrigins: ["127.0.0.1", "localhost"],
}

export default nextConfig
