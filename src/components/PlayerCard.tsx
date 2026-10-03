"use client";

import Image from "next/image";

type PlayerStats = {
  pac: number;
  sho: number;
  pas: number;
  dri: number;
  def: number;
  phy: number;
};

export type PlayerCardProps = {
  name: string;
  position: string;
  rating: number;
  number: number;
  image: string;
  stats: PlayerStats;
  /** Stagger the entrance animation when several cards mount together, in ms. */
  delay?: number;
};

const STAT_LABELS: { key: keyof PlayerStats; label: string }[] = [
  { key: "pac", label: "PAC" },
  { key: "sho", label: "SHO" },
  { key: "pas", label: "PAS" },
  { key: "dri", label: "DRI" },
  { key: "def", label: "DEF" },
  { key: "phy", label: "PHY" },
];

export default function PlayerCard({
  name,
  position,
  rating,
  number,
  image,
  stats,
  delay = 0,
}: PlayerCardProps) {
  const bestStat = STAT_LABELS.reduce((best, current) =>
    stats[current.key] > stats[best.key] ? current : best
  ).key;

  return (
    <div
      className="card-enter group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0f] transition-colors duration-300 hover:border-[#006ec3]/60"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* photo fills the entire card as a background layer */}
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover object-top "
        sizes="(min-width: 1024px) 30vw, 60vw"
      />

      {/* top fade keeps the rating/number legible over hair, sky, etc. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-[#0d0d0f] to-transparent" />

      {/* jersey number */}
      <span className="absolute right-4 top-4 z-20 font-mono text-xs tracking-wider text-white/40">
        N.{String(number).padStart(2, "0")}
      </span>

      {/* overall rating + position */}
      <div className="absolute left-4 top-4 z-20 flex flex-col items-start leading-none">
        <span className="font-mono text-3xl font-bold text-white">
          {rating}
        </span>
        <span className="mt-1 font-mono text-[11px] tracking-wider text-[#006ec3]">
          {position}
        </span>
      </div>

      {/* name + stat grid — pinned to the bottom edge, independent of photo height */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#0d0d0f]/95 px-4 pb-4 pt-3 backdrop-blur-sm">
        <h3 className="truncate text-base font-semibold uppercase tracking-tight text-white">
          {name}
        </h3>

        <div className="mt-3 grid grid-cols-3 gap-y-3">
          {STAT_LABELS.map(({ key, label }) => (
            <div key={key} className="flex flex-col">
              <span
                className={
                  key === bestStat
                    ? "font-mono text-sm font-bold text-[#fc6028]"
                    : "font-mono text-sm font-bold text-white"
                }
              >
                {stats[key]}
              </span>
              <span className="font-mono text-[10px] tracking-wider text-white/40">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .card-enter {
          opacity: 0;
          animation: cardEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .card-enter {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}