export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in duration-300 fade-in-0 slide-in-from-bottom-2">
      {children}
    </div>
  )
}
