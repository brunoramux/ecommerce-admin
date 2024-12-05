export default function Authfunction({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center h-full">
      {children}
    </div>
  )
}