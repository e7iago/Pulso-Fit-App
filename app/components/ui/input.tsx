import * as React from "react"

import { cn } from "~/lib/utils"

function Input({ className, type, inputMode, onChange, ...props }: React.ComponentProps<"input">) {
  const isNumeric = type === "number"

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isNumeric) {
      const value = e.target.value
      if (value !== "" && !/^-?\d*[.,]?\d*$/.test(value)) return
    }
    onChange?.(e)
  }

  return (
    <input
      type={isNumeric ? "text" : type}
      inputMode={inputMode || isNumeric ? "decimal" : undefined}
      data-slot="input"
      onChange={handleChange}
      className={cn(
        `h-8 w-full min-w-0 rounded-lg border border-border
         bg-transparent px-2.5 py-1 text-base transition-colors outline-none 
         file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm 
         file:font-medium file:text-foreground placeholder:text-muted-foreground
          focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
           disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent 
           disabled:bg-transparent disabled:opacity-100 aria-invalid:border-destructive 
           aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30
            dark:disabled:bg-transparent dark:aria-invalid:border-destructive/50 
            dark:aria-invalid:ring-destructive/40
            
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
            [&::-webkit-inner-spin-button]:appearance-none`,
        className
      )}
      {...props}
    />
  )
}

export { Input }
