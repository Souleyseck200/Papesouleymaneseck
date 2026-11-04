import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const styles = cva('inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 disabled:pointer-events-none disabled:opacity-40', {
  variants: {
    variant: { default: 'bg-foreground text-white hover:bg-foreground/80', outline: 'border border-neutral-200 bg-white hover:bg-neutral-100', ghost: 'hover:bg-neutral-100', orange: 'bg-accent text-white hover:bg-orange-600', light: 'bg-white text-foreground hover:bg-white/90' },
    size: { default: 'h-11 px-5', sm: 'h-9 px-4 text-xs', icon: 'size-10 p-0' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})
export function Button({ asChild = false, className, variant, size, ...props }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(styles({ variant, size }), className)} {...props} />
}
