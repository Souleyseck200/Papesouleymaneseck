import { useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, CircleNotch, EnvelopeSimple, Phone, MapPin } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Input, Textarea } from './ui/input'
import { contactEmail, emptyProjectRequest, projectMailto, projectRequestSchema, projectTypes } from '../lib/project-request'
import { cn } from '../lib/utils'
import { sendProjectRequest } from '../lib/send-project-request'

function Field({ label, id, optional = false, error, children }) {
  return <div className="min-w-0"><label htmlFor={id} className="mb-2 block text-xs font-medium text-slate-700">{label}{optional && <span className="ml-1 font-normal text-slate-400">(facultatif)</span>}</label>{children}{error && <p id={`${id}-error`} className="mt-1.5 text-xs leading-relaxed text-orange-700">{error.message}</p>}</div>
}

export function ProjectRequestForm() {
  const prefix = useId(), reduced = useReducedMotion(), requestId = useRef(null), sending = useRef(false)
  const [status, setStatus] = useState('idle'), [errorMessage, setErrorMessage] = useState(''), [confirmation, setConfirmation] = useState(null)
  const feedback = useRef(null)
  const { register, handleSubmit, watch, reset, setError, getValues, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(projectRequestSchema), defaultValues: emptyProjectRequest, mode: 'onTouched' })
  const kind = watch('kind'), message = watch('message'), recruitment = kind === 'recruitment'
  const field = (name) => ({ id: `${prefix}-${name}`, ...register(name), 'aria-invalid': !!errors[name], 'aria-describedby': errors[name] ? `${prefix}-${name}-error` : undefined })

  async function submit(values) {
    if (sending.current) return
    sending.current = true
    setStatus('sending')
    setErrorMessage('')
    const serialized = JSON.stringify(values)
    if (requestId.current?.payload !== serialized) requestId.current = { payload: serialized, id: crypto.randomUUID() }
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 35000)
    try {
      const { response, result } = await sendProjectRequest({ ...values, requestId: requestId.current.id }, controller.signal)
      if (!response.ok || result?.success !== true) {
        if (result?.fields) Object.entries(result.fields).forEach(([name, messages]) => setError(name, { message: messages[0] }))
        throw new Error(result?.message || 'L’envoi n’a pas abouti. Votre demande est conservée dans le formulaire.')
      }
      setConfirmation({ name: values.name, email: values.email, reference: result.reference })
      setStatus('success')
      reset(emptyProjectRequest)
      requestId.current = null
    } catch (error) {
      setStatus('error')
      setErrorMessage(error.name === 'AbortError' ? 'L’envoi prend trop de temps. Votre demande est conservée ; vous pouvez réessayer ou me l’envoyer directement par e-mail.' : error.message)
    } finally {
      clearTimeout(timeout)
      sending.current = false
      requestAnimationFrame(() => feedback.current?.focus({ preventScroll: true }))
    }
  }

  return <section id="contact" className="scroll-mt-20 border-t border-neutral-100">
    <div className="grid lg:grid-cols-[.85fr_1.15fr]">
      <div className="flex flex-col justify-between bg-navy px-6 py-12 text-white sm:px-10 lg:px-16 lg:py-16">
        <div><p className="mb-5 text-sm text-[#ff9a56]">Travaillons ensemble</p><h2 className="max-w-lg text-[clamp(2.4rem,4.5vw,4.7rem)] leading-[1.04] font-bold tracking-[-.05em]">Un projet en tête ?<br/>Un poste à proposer ?</h2><p className="mt-6 max-w-92 text-sm leading-[1.8] text-white/65">Présentez-moi votre besoin et le contexte. Je pourrai vous recontacter pour préciser le périmètre, les priorités et la manière de travailler ensemble.</p></div>
        <div className="mt-10 space-y-4 text-sm text-white/75 lg:mt-20"><a href={`mailto:${contactEmail}`} className="flex w-fit items-center gap-3 break-all transition-colors hover:text-white"><EnvelopeSimple size={18} className="shrink-0"/>{contactEmail}</a><a href="tel:+221772951688" className="flex w-fit items-center gap-3 transition-colors hover:text-white"><Phone size={18}/>+221 77 295 16 88</a><p className="flex items-center gap-3 text-xs text-white/45"><MapPin size={17}/>Dakar, Sénégal</p></div>
      </div>
      <div className="min-w-0 bg-white px-6 py-10 sm:px-10 lg:px-14 lg:py-14 xl:px-18">
        <AnimatePresence mode="wait" initial={false}>
          {status === 'success' ? <motion.div key="success" ref={feedback} tabIndex={-1} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.35 }} className="flex min-h-140 flex-col items-start justify-center outline-none" role="status">
            <span className="mb-7 grid size-14 place-items-center rounded-full bg-lime"><Check size={26}/></span><h3 className="text-3xl font-bold tracking-tight">Votre demande est enregistrée.</h3><p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500">Merci {confirmation.name}. Je vous recontacterai à <strong className="font-medium text-slate-800">{confirmation.email}</strong> pour échanger sur votre besoin.</p><p className="mt-4 text-xs text-slate-400">Référence : {confirmation.reference}</p><Button variant="outline" className="mt-8" onClick={() => { setStatus('idle'); setConfirmation(null) }}>Envoyer une autre demande</Button>
          </motion.div> : <motion.form key="form" onSubmit={handleSubmit(submit)} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.2 }} aria-label="Demande de projet ou proposition de recrutement">
            <fieldset disabled={isSubmitting} className="min-w-0 border-0 p-0">
              <legend className="mb-5 text-sm font-medium">Comment pouvons-nous travailler ensemble ?</legend>
              <div className="mb-8 flex gap-1 rounded-full bg-slate-100 p-1">{[['project', 'Un projet'], ['recruitment', 'Un recrutement']].map(([value, label]) => <label key={value} className="relative flex flex-1 cursor-pointer items-center justify-center rounded-full px-2 py-3 text-xs"><input type="radio" value={value} {...register('kind')} className="peer sr-only"/>{kind === value && <motion.span layoutId={`${prefix}-kind`} transition={{ duration: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 rounded-full bg-navy"/>}<span className={cn('relative rounded-sm transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent', kind === value ? 'text-white' : 'text-slate-500')}>{label}</span></label>)}</div>
              <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                <Field label="Nom complet" id={`${prefix}-name`} error={errors.name}><Input autoComplete="name" placeholder="Votre nom" maxLength={100} {...field('name')}/></Field>
                <Field label="E-mail" id={`${prefix}-email`} error={errors.email}><Input type="email" autoComplete="email" placeholder="vous@entreprise.com" maxLength={254} {...field('email')}/></Field>
                <Field label="Entreprise" id={`${prefix}-company`} optional error={errors.company}><Input autoComplete="organization" placeholder="Votre entreprise" maxLength={160} {...field('company')}/></Field>
                <Field label="Téléphone" id={`${prefix}-phone`} optional error={errors.phone}><Input type="tel" autoComplete="tel" placeholder="Avec l’indicatif du pays" maxLength={50} {...field('phone')}/></Field>
                <div className="sm:col-span-2"><Field label={recruitment ? 'Poste proposé' : 'Nom ou objectif du projet'} id={`${prefix}-subject`} error={errors.subject}><Input placeholder={recruitment ? 'Ex. Développeur full-stack dans votre équipe' : 'Ex. Une plateforme pour gérer nos locations'} maxLength={160} {...field('subject')}/></Field></div>
                {!recruitment && <div className="sm:col-span-2"><Field label="Type de projet" id={`${prefix}-projectType`} error={errors.projectType}><select {...field('projectType')} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-100">{projectTypes.map(type => <option key={type}>{type}</option>)}</select></Field></div>}
                <Field label={recruitment ? 'Rémunération envisagée' : 'Budget envisagé'} id={`${prefix}-budget`} optional error={errors.budget}><Input placeholder="Montant et devise, ou à discuter" maxLength={120} {...field('budget')}/></Field>
                <Field label={recruitment ? 'Prise de poste souhaitée' : 'Échéance souhaitée'} id={`${prefix}-deadline`} optional error={errors.deadline}><Input placeholder="Ex. Dans 2 à 3 mois" maxLength={120} {...field('deadline')}/></Field>
                <div className="sm:col-span-2"><Field label={recruitment ? 'Le poste et son contexte' : 'Votre besoin en quelques mots'} id={`${prefix}-message`} error={errors.message}><Textarea placeholder={recruitment ? 'Votre équipe, les missions, le mode de travail et les compétences recherchées…' : 'À qui s’adresse le projet ? Quel problème souhaitez-vous résoudre ? Quelles fonctionnalités sont prioritaires ?'} maxLength={6000} rows={5} {...field('message')}/></Field><p className="mt-2 text-right text-[10px] tabular-nums text-slate-400">{message?.length || 0} / 6 000</p></div>
                <div className="hidden" aria-hidden="true"><label htmlFor={`${prefix}-website`}>Laisser ce champ vide</label><input {...field('website')} tabIndex={-1} autoComplete="off"/></div>
              </div>
              {status === 'error' && <div ref={feedback} role="alert" tabIndex={-1} className="mt-5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs leading-relaxed text-orange-900 outline-none"><p>{errorMessage}</p><a href={projectMailto(getValues())} className="mt-2 inline-flex items-center gap-2 font-medium underline underline-offset-4">Envoyer le contenu par e-mail <ArrowUpRight size={13}/></a></div>}
              <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-67 text-[11px] leading-relaxed text-slate-400">Ces informations me permettent de vous recontacter au sujet de votre demande.</p><Button type="submit" className="w-full gap-4 text-xs sm:w-auto" disabled={isSubmitting}>{isSubmitting ? <><CircleNotch className={reduced ? '' : 'animate-spin'} size={17}/>Envoi en cours…</> : <>Envoyer ma demande <ArrowUpRight size={16}/></>}</Button></div>
            </fieldset>
          </motion.form>}
        </AnimatePresence>
      </div>
    </div>
  </section>
}
