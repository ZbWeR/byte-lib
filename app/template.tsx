export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 animate-in flex-col duration-300 fade-in-0 slide-in-from-bottom-2">
      {children}
    </div>
  )
}
