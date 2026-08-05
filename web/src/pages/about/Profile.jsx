import { useT } from '../../i18n/LangProvider.jsx'
import { SealCheck } from '@phosphor-icons/react'
import { useApi } from '../../hooks/useApi.js'
import { useSeo } from '../../hooks/useSeo.js'
import { getAbout, getHome } from '../../api/index.js'
import StatBand from '../../components/common/StatBand.jsx'
import Reveal from '../../components/common/Reveal.jsx'
import MediaImage from '../../components/common/MediaImage.jsx'
import { PageLoading, PageError } from '../../components/common/States.jsx'

export default function Profile() {
  const t = useT()
  const { data, loading, error, reload } = useApi(() => getAbout('profile'))
  const home = useApi(getHome)

  useSeo(data?.seo || {})

  if (loading) return <PageLoading />
  if (error) return <PageError error={error} onRetry={reload} />

  return (
    <>
      <section className="section">
        <div className="container-x grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="text-2xl font-semibold text-brand-950 md:text-3xl">
              {t('about.profileHeading')}
            </h2>
            {data.paragraphs.map((p, i) => (
              <p key={i} className="mt-5 leading-8 text-slate-600">
                {p}
              </p>
            ))}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {data.certs.map((c) => (
                <li key={c} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <SealCheck className="size-5 shrink-0 text-accent-600" />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6">
            {data.images.map((img, i) => (
              <div key={img.src} className="relative">
                <MediaImage
                  src={img.src}
                  alt={i === 0 ? t('about.imageOffice') : t('about.imageWarehouse')}
                  video={img.video}
                  videoAutoplay={img.videoAutoplay}
                  variant="inline"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="aspect-[3/2] w-full rounded-lg object-cover"
                />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {home.data && <StatBand stats={home.data.stats} />}

      <section className="section">
        <div className="container-x max-w-4xl">
          <h2 className="text-center text-2xl font-semibold text-brand-950 md:text-3xl">
            {t('about.videoTitle')}
          </h2>
          <div className="mt-8">
            <div className="relative">
              <MediaImage
                src={data.video.poster}
                alt={t('about.videoAlt')}
                video={data.video.url}
                videoAutoplay={data.video.autoplay}
                variant="inline"
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="aspect-video w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
