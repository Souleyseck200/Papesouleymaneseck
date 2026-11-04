import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Plus } from '@phosphor-icons/react'
import { cn } from '../../lib/utils'

export const Accordion = AccordionPrimitive.Root
export function AccordionItem({ className, ...props }) { return <AccordionPrimitive.Item className={cn('border-b border-neutral-200', className)} {...props} /> }
export function AccordionTrigger({ className, children, ...props }) {
  return <AccordionPrimitive.Header><AccordionPrimitive.Trigger className={cn('group flex w-full items-center justify-between gap-5 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent', className)} {...props}>{children}<span className="grid size-9 shrink-0 place-items-center rounded-full border border-neutral-200 transition-colors group-hover:bg-neutral-100"><Plus size={17} className="transition-transform duration-300 group-data-[state=open]:rotate-45" /></span></AccordionPrimitive.Trigger></AccordionPrimitive.Header>
}
export function AccordionContent({ className, children, ...props }) {
  return <AccordionPrimitive.Content className="accordion-content overflow-hidden" {...props}><div className={cn('pb-7', className)}>{children}</div></AccordionPrimitive.Content>
}
