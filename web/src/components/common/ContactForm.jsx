import { useId, useState } from 'react'
import { LocaleLink as Link } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import { ArrowClockwise, CheckCircle, SpinnerGap, WarningCircle } from '@phosphor-icons/react'
import { submitMessage } from '../../api/index.js'

const genCaptcha = () => {
  const a = 2 + Math.floor(Math.random() * 7)
  const b = 1 + Math.floor(Math.random() * 8)
  return { a, b, answer: a + b }
}

const phoneReg = /^(1[3-9]\d{9}|0\d{2,3}-?\d{7,8})$/

function validate(values, captcha, t, requireCaptcha) {
  const errors = {}
  if (!values.name.trim() || values.name.trim().length < 2) errors.name = t('contact.error.name')
  if (!phoneReg.test(values.phone.trim())) errors.phone = t('contact.error.phone')
  if (!values.company.trim()) errors.company = t('contact.error.company')
  if (values.content.trim().length < 10) errors.content = t('contact.error.content')
  if (requireCaptcha && parseInt(values.captcha, 10) !== captcha.answer) errors.captcha = t('contact.error.captcha')
  return errors
}

function Field({ label, error, required = false, hideLabel = false, children }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'label'}>
        {label}
        {required && !hideLabel && <span className="ml-1 text-accent-600" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        {children(id)}
        {required && hideLabel && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-accent-600" aria-hidden="true">
            *
          </span>
        )}
      </div>
      {error && (
        <p className="error-text">
          <WarningCircle className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

export default function ContactForm({ compact = false }) {
  const t = useT()
  const [values, setValues] = useState({ name: '', phone: '', company: '', content: '', captcha: '' })
  const [errors, setErrors] = useState({})
  const [captcha, setCaptcha] = useState(genCaptcha)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [result, setResult] = useState(null)

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values, captcha, t, !compact)
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      if (!compact) {
        setCaptcha(genCaptcha())
        setValues((v) => ({ ...v, captcha: '' }))
      }
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await submitMessage({
        name: values.name.trim(),
        contact: values.phone.trim(),
        content: `${t('contact.field.company')}: ${values.company.trim()}\n${t('contact.field.content')}: ${values.content.trim()}`,
      })
      setResult(res)
    } catch (err) {
      setSubmitError(err?.message || t('contact.error.submit'))
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return compact ? (
      <div className="flex items-start gap-3 rounded-lg bg-brand-50 p-4" role="status">
        <CheckCircle className="mt-0.5 size-6 shrink-0 text-accent-600" weight="fill" />
        <div>
          <h3 className="text-base font-semibold text-brand-950">{t('contact.success.title')}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            {t('contact.success.body', { ticket: result.ticket })}
            <br />
            {t('contact.success.note')}
          </p>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center py-14 text-center" role="status">
        <CheckCircle className="size-14 text-accent-600" weight="fill" />
        <h3 className="mt-5 text-xl font-semibold text-brand-950">{t('contact.success.title')}</h3>
        <p className="mt-3 max-w-sm leading-7 text-slate-500">
          {t('contact.success.body', { ticket: result.ticket })}
          <br />
          {t('contact.success.note')}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/cases" className="btn-outline">
            {t('common.viewAllCases')}
          </Link>
          <Link to="/" className="btn-primary">
            {t('common.backHome')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className={`grid ${compact ? 'gap-2.5' : 'gap-5 sm:grid-cols-2'}`}>
        <Field label={t('contact.field.name')} error={errors.name} required hideLabel={compact}>
          {(id) => (
            <input
              id={id}
              className={`input ${compact ? 'pr-9' : ''}`}
              value={values.name}
              onChange={set('name')}
              placeholder={compact ? t('contact.field.name') : t('contact.placeholder.name')}
              maxLength={20}
              required
            />
          )}
        </Field>
        <Field label={t('contact.field.phone')} error={errors.phone} required hideLabel={compact}>
          {(id) => (
            <input
              id={id}
              className={`input ${compact ? 'pr-9' : ''}`}
              type="tel"
              value={values.phone}
              onChange={set('phone')}
              placeholder={compact ? t('contact.field.phone') : t('contact.placeholder.phone')}
              maxLength={20}
              required
            />
          )}
        </Field>
      </div>
      <div className={compact ? 'mt-2.5' : 'mt-5'}>
        <Field label={t('contact.field.company')} error={errors.company} hideLabel={compact}>
          {(id) => (
            <input
              id={id}
              className="input"
              value={values.company}
              onChange={set('company')}
              placeholder={compact ? t('contact.field.company') : t('contact.placeholder.company')}
              maxLength={40}
            />
          )}
        </Field>
      </div>
      <div className={compact ? 'mt-2.5' : 'mt-5'}>
        <Field label={t('contact.field.content')} error={errors.content} hideLabel={compact}>
          {(id) => (
            <textarea
              id={id}
              className={`textarea ${compact ? 'min-h-24' : ''}`}
              value={values.content}
              onChange={set('content')}
              placeholder={compact ? t('contact.field.content') : t('contact.placeholder.content')}
              maxLength={500}
            />
          )}
        </Field>
      </div>
      {!compact && <div className="mt-5">
        <Field label={t('contact.field.captcha')} error={errors.captcha}>
          {(id) => (
            <div className="flex items-center gap-3">
              <input
                id={id}
                className={`input ${compact ? 'min-w-0 flex-1' : 'max-w-40'}`}
                inputMode="numeric"
                value={values.captcha}
                onChange={set('captcha')}
                placeholder={t('contact.placeholder.captcha')}
                maxLength={3}
              />
              <span className="grid h-11 min-w-28 select-none place-items-center rounded-lg bg-brand-950 font-display text-lg font-semibold tracking-widest text-white">
                {captcha.a} + {captcha.b} = ?
              </span>
              <button
                type="button"
                onClick={() => setCaptcha(genCaptcha())}
                aria-label={t('contact.captcha.refresh')}
                className="grid size-11 shrink-0 place-items-center rounded-lg border border-slate-300 text-slate-500 transition hover:border-accent-600 hover:text-accent-600 active:translate-y-px"
              >
                <ArrowClockwise className="size-5" />
              </button>
            </div>
          )}
        </Field>
      </div>}

      {submitError && (
        <p className="error-text mt-5">
          <WarningCircle className="size-4 shrink-0" />
          {submitError}
        </p>
      )}

      {compact ? (
        <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full shrink-0 disabled:cursor-not-allowed disabled:opacity-70">
          {submitting && <SpinnerGap className="size-4 animate-spin" />}
          {submitting ? t('contact.submitting') : t('contact.submit')}
        </button>
      ) : (
        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            {t('contact.privacy.agree')}
            <Link to="/privacy" className="text-brand-700 underline underline-offset-2 hover:text-accent-600">
              {t('contact.privacy.link')}
            </Link>
            {t('contact.privacy.suffix')}
          </p>
          <button type="submit" disabled={submitting} className="btn-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-70">
            {submitting && <SpinnerGap className="size-4 animate-spin" />}
            {submitting ? t('contact.submitting') : t('contact.submit')}
          </button>
        </div>
      )}
    </form>
  )
}
