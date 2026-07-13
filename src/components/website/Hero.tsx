"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (imgRef.current) {
        const y = window.scrollY * 0.3;
        imgRef.current.style.transform = `translateY(${y}px) scale(${1 + window.scrollY * 0.0001})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background Images */}
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/homepage1.png"
          alt="Wedding photography"
          fill
          className="object-cover object-center hidden md:block"
          priority
          sizes="100vw"
        />
        <Image
          src="/images/homepage1mobile.png"
          alt="Wedding photography"
          fill
          className="object-contain object-center md:hidden"
          priority
          sizes="(max-width: 768px) 100vw, 0px"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      }} />

      {/* Content */}
      <div className="relative w-full pb-32 md:pb-40">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8960E] text-[#0A0A0A] font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 text-sm"
            >
              Book a Consultation
            </Link>
            <Link
              href="/gallery"
              className="border border-white/[0.12] text-white/70 px-8 py-3.5 rounded-xl hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all duration-300 text-sm backdrop-blur-sm"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-white/20">
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
