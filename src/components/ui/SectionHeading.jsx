/** Judul section yang konsisten di seluruh halaman. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  id,
  as: Heading = 'h2',
}) {
  return (
    <div className={`section-heading ${align === 'center' ? 'section-heading--center' : ''}`}>
      {eyebrow && <p className="section-heading__eyebrow">{eyebrow}</p>}
      <Heading className="section-heading__title" id={id}>
        {title}
      </Heading>
      {description && <p className="section-heading__desc">{description}</p>}
    </div>
  );
}
