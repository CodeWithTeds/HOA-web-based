import * as React from "react"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`relative overflow-auto scrollbar-hide ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
