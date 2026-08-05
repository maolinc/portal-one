import { useEffect, useRef, useState } from 'react'
import { LocaleLink as Link } from '../../i18n/LocaleLink.jsx'
import { useT } from '../../i18n/LangProvider.jsx'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { ArrowUp, ChatCenteredText, Phone, WechatLogo, X } from '@phosphor-icons/react'
import ContactForm from '../common/ContactForm.jsx'

const contactRevealVariants = {
  collapsed: { transition: { when: 'afterChildren' } },
  expanded: { transition: { when: 'beforeChildren' } },
}

const contactCardVariants = {
  collapsed: {
    y: '100%',
    transition: { duration: 0.5, ease: 'linear' },
  },
  expanded: {
    y: '0%',
    transition: { duration: 0.5, ease: 'linear' },
  },
}

// PC：右侧悬浮联系入口 + 回顶部按钮（滚动超过 560px 显示）
function DesktopToolbar({ site }) {
  const t = useT()
  const [contactOpen, setContactOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const closeTimer = useRef(null)
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setShowTop(v > 560))

  const vis = site?.visibility ?? {}
  const company = site?.company ?? {}
  const showPhone = vis['channel.phone'] !== false && company.phone
  const showMessage = vis['channel.message'] !== false
  const showContact = site && (showPhone || showMessage)

  const itemCls =
    'grid size-12 cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-brand-800 shadow-md shadow-brand-950/5 transition hover:border-accent-600 hover:text-accent-600 active:translate-y-px'

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const openContact = () => {
    clearTimeout(closeTimer.current)
    setContactOpen(true)
  }

  const closeContact = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setContactOpen(false), 140)
  }

  const closeContactNow = () => {
    clearTimeout(closeTimer.current)
    setContactOpen(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 hidden flex-col gap-2 md:flex">
      {showContact && (
        <div
          className="relative"
          onMouseEnter={openContact}
          onMouseLeave={closeContact}
          onFocus={openContact}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) closeContactNow()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeContactNow()
          }}
        >
          <AnimatePresence>
            {contactOpen && (
              <motion.div
                variants={reduce ? undefined : contactRevealVariants}
                initial={reduce ? false : 'collapsed'}
                animate={reduce ? undefined : 'expanded'}
                exit={reduce ? { opacity: 0 } : 'collapsed'}
                className="absolute bottom-full right-0 w-[320px] max-w-[calc(100vw-2.5rem)] overflow-hidden"
              >
                <motion.div
                  variants={reduce ? undefined : contactCardVariants}
                  className="pb-2"
                  style={{ willChange: reduce ? undefined : 'transform' }}
                >
                  <div className="max-h-[calc(100dvh-6.5rem)] overflow-y-auto overscroll-contain rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-brand-950/10">
                    {showPhone && (
                      <div>
                        <p className="text-xs font-medium text-slate-500">{t('toolbar.hotline')}</p>
                        <a
                          href={`tel:${company.phoneRaw || company.phone}`}
                          className="mt-1 inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-wide text-brand-950 transition hover:text-accent-600"
                        >
                          <Phone className="size-5 text-accent-600" weight="fill" />
                          {company.phone}
                        </a>
                        <p className="mt-1 text-xs text-slate-500">{company.hours || t('toolbar.workingHours')}</p>
                      </div>
                    )}

                    {showMessage && (
                      <div className={showPhone ? 'mt-4 border-t border-slate-100 pt-4' : ''}>
                        <p className="mb-4 text-sm font-medium text-brand-800">{t('toolbar.messageBoardHint')}</p>
                        <ContactForm compact />
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => {
              clearTimeout(closeTimer.current)
              setContactOpen((open) => !open)
            }}
            className={itemCls}
            aria-label={t('toolbar.businessConsult')}
            aria-expanded={contactOpen}
          >
            <ChatCenteredText className="size-5" weight="fill" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            className={itemCls}
            aria-label={t('common.backToTop')}
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

// 移动端：底部悬浮条 + 客服弹层 + 回顶部小圆钮；各渠道由后台显隐开关控制
function MobileBar({ site }) {
  const t = useT()
  const vis = site?.visibility ?? {}
  const [csOpen, setCsOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setShowTop(v > 560))

  const company = site?.company ?? {}
  const wechatId = company.wechat?.id
  const qqId = company.qq?.id
  const showWechat = vis['channel.wechat'] !== false && company.wechat?.qr
  const showQq = vis['channel.qq'] !== false && company.qq?.qr
  const showKf = vis['channel.kf'] !== false && (showWechat || showQq)

  return (
    <>
      <AnimatePresence>
        {showTop && !csOpen && (
          <motion.button
            type="button"
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            className="fixed bottom-24 right-4 z-40 grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-brand-800 shadow-lg md:hidden"
            aria-label={t('common.backToTop')}
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {vis['channel.phone'] !== false && (
        <a
          href={`tel:${site?.company?.phoneRaw || ''}`}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs text-brand-800"
        >
          <Phone className="size-5 text-accent-600" weight="fill" />
          {t('common.phoneConsult')}
        </a>
        )}
        {showKf && (
        <button
          type="button"
          onClick={() => setCsOpen(true)}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs text-brand-800"
        >
          <WechatLogo className="size-5 text-accent-600" />
          {t('common.onlineService')}
        </button>
        )}
        {vis['channel.message'] !== false && (
        <Link to="/contact#form" className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs text-brand-800">
          <ChatCenteredText className="size-5 text-accent-600" />
          {t('common.leaveMessage')}
        </Link>
        )}
      </div>

      <AnimatePresence>
        {csOpen && (
          <div className="fixed inset-0 z-[70] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-950/60"
              onClick={() => setCsOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-6 pb-[max(2rem,env(safe-area-inset-bottom))]"
              role="dialog"
              aria-label={t('common.onlineService')}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-brand-950">{t('common.scanToContact')}</h3>
                <button
                  type="button"
                  onClick={() => setCsOpen(false)}
                  aria-label={t('common.close')}
                  className="grid size-9 place-items-center text-slate-500"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="mt-5 flex justify-center gap-6">
                {showWechat && (
                <div className="text-center">
                  <img src={company.wechat.qr} alt={t('toolbar.wechat')} className="block size-28 rounded-lg bg-white p-1 object-contain" />
                  <p className="mt-2 text-xs text-slate-500">{t('toolbar.wechatLabel', { value: wechatId })}</p>
                </div>
                )}
                {showQq && (
                <div className="text-center">
                  <img src={company.qq.qr} alt={t('toolbar.qqService')} className="block size-28 rounded-lg bg-white p-1 object-contain" />
                  <p className="mt-2 text-xs text-slate-500">{t('toolbar.qqLabel', { value: qqId })}</p>
                </div>
                )}
              </div>
              {site && vis['channel.phone'] !== false && (
                <a href={`tel:${site.company.phoneRaw}`} className="btn-primary mt-6 w-full">
                  <Phone className="size-4" weight="fill" />
                  {t('toolbar.callNow', { phone: site.company.phone })}
                </a>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function FloatingToolbar({ site }) {
  if (!site) return null

  return (
    <>
      <DesktopToolbar site={site} />
      <MobileBar site={site} />
    </>
  )
}
