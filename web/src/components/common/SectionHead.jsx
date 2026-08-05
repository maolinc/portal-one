export default function SectionHead({ eyebrow, title, desc, center = false }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-semibold leading-snug text-brand-950 md:text-4xl">
        {title}
      </h2>
      {desc && <p className="mt-4 leading-7 text-slate-600">{desc}</p>}
    </div>
  )
}
