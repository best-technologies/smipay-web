import Image from "next/image";

const brands = [
  {
    src: "/svgs/brands/accessible.svg",
    alt: "Accessible Publishers",
  },
  { src: "/svgs/brands/oxygen.svg", alt: "Oxygen FM" },
  { src: "/svgs/brands/best-in-print.svg", alt: "Best in Print" },
  { src: "/svgs/brands/smart-edu-hub.svg", alt: "Smart Edu Hub" },
  { src: "/svgs/brands/buy-books.svg", alt: "Buy Books" },
  { src: "/svgs/brands/besttech.svg", alt: "Best Tech" },
];

export default function TrustMarquee() {
  const track = [...brands, ...brands];
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
        <h2 className="lg:text-xl font-semibold text-brand-primary">
          Supporting Brands Behind Smipay
        </h2>
        <div className="marquee relative">
          <div className="marquee-track">
            {track.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-brand-secondary"
              >
                <Image src={b.src} alt={b.alt} width={28} height={28} />
                <span className="text-sm">{b.alt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
