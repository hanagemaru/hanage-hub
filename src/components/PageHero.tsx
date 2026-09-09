export function PageHero({ title, description }: { title: string; description?: string }) {
  return (
    <section className="pageHero pageWidth">
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </section>
  );
}
