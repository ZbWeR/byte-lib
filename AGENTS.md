<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Preview, don't record

Do not proactively run end-to-end browser walkthroughs, computer-use sessions, or screen recordings to verify UI. These are too slow for this repo.

Only do that kind of manual GUI testing when the user explicitly asks.

After UI or routing changes, deploy a Vercel preview (`vercel deploy --temporary --yes --prod`) and give the user the preview URL plus the claim URL. Let them look at it themselves.

A local `pnpm build` / `pnpm typecheck` is enough automated verification unless they ask for more.
