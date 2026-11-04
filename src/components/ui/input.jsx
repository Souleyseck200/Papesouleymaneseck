import { cn } from '../../lib/utils'

export function Input({ className, type = 'text', ...props }) {
  return <input type={type} className={cn('flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-orange-500 aria-invalid:focus-visible:ring-orange-100', className)} {...props}/>
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn('flex min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-orange-500 aria-invalid:focus-visible:ring-orange-100', className)} {...props}/>
}
