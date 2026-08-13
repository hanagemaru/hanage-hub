export function PageHero({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <section className="pageHero pageWidth">
      <p className="eyebrow">{kicker}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
