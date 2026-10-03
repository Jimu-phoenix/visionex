"use client";

type AddPlayerCardProps = {
  onAdd?: () => void;
  /** Stagger the entrance animation when it mounts alongside other cards, in ms. */
  delay?: number;
};

export default function AddPlayerCard({ onAdd, delay = 0 }: AddPlayerCardProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="card-enter group flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-transparent transition-colors duration-300 hover:border-[#006ec3]/60 hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006ec3]/60"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-2xl leading-none text-white/50 transition-colors duration-300 group-hover:border-[#006ec3]/60 group-hover:text-[#006ec3]">
        +
      </span>
      <span className="font-mono text-xs tracking-wider text-white/40 transition-colors duration-300 group-hover:text-white/70">
        ADD PLAYER
      </span>

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
    </button>
  );
}