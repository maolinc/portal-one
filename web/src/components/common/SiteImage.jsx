export default function SiteImage({
  src,
  alt = '',
  className,
  eager = false,
  ...rest
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      {...rest}
    />
  )
}
