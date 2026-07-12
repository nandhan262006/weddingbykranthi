"use client";

import Image from "next/image";
import { useScrollReveal } from "./useScrollReveal";

const defaultStats = [
  { value: "25+", label: "Years of Experience" },
  { value: "1500+", label: "Weddings" },
  { value: "Award", label: "Winner" },
];

interface AboutData {
  title?: string;
  content?: string;
  image?: string | null;
  tags?: string | null;
}

export default function About({ data }: { data?: AboutData | null }) {
  const sectionRef = useScrollReveal();

  const displayContent = data?.content || "With over a decade of experience capturing love stories across Nellore and beyond, Wedding by Kranthi brings artistry and emotion to every frame. We specialize in candid, traditional, and cinematic wedding photography that tells your unique story.";
  const displayImage = data?.image || "/images/unnamed.webp";

  return (
    <section id="about" className="relative bg-dark-surface overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/images/unnamed%20(8).webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div ref={sectionRef} className="fade-in-up relative z-10 grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto px-4 pt-24 pb-16">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-dark-card order-1">
          <Image
            src={displayImage}
            alt={data?.title || "Wedding by Kranthi"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute bottom-0 right-0 bg-gradient-to-l from-black/70 to-transparent p-5 text-right">
            <p className="text-cream text-lg font-medium">Kranthi</p>
            <p className="text-gold text-xs">Founder, Wedding by Kranthi</p>
          </div>
        </div>

        <div className="order-2">
          <span className="text-gold font-semibold text-sm uppercase tracking-widest">About</span>
          <h2 className="text-4xl font-bold mt-3 mb-4 text-cream">Wedding by Kranthi</h2>
          <div className="space-y-4 text-cream/60 leading-relaxed mb-6">
            <p>
              Before Wedding by Kranthi, I earned recognition as one of the <strong className="text-cream">Best Wedding Photographers</strong> in Nellore.
            </p>
            <p><strong className="text-cream">11+ Years of Excellence</strong></p>
            <p>
              {displayContent}
            </p>
            <p>
              If you&apos;re searching for the Best Wedding Photographers in Nellore, Wedding Photography
              in Nellore, Candid Wedding Photographers in Nellore, Traditional Wedding Photography,
              Bridal Photography, Groom Portraits, Pre Wedding Photography, Engagement Photography,
              or Wedding Cinematography, Wedding by Kranthi brings award-winning experience to every celebration.
            </p>
            <p>
              For over a decade, families across Nellore and beyond have trusted Wedding by Kranthi to preserve
              their most important memories through authentic wedding storytelling and timeless imagery.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {defaultStats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-dark-card border border-gold/10">
                <div className="text-xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-cream/50 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
