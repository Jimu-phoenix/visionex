import PlayerCard from "@/components/PlayerCard";
import AddPlayerCard from "@/components/AddPlayerCard";

const players = [
  {
    name: "Phoenix",
    position: "CAM",
    rating: 87,
    number: 7,
    image: "/images/phoenix.png",
    stats: { pas: 91, sho: 84, pac: 78, dri: 78, def: 42, phy: 70 },
  },
];

export default function GameProfilesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs tracking-wider text-[#006ec3]">
          SQUAD
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          Game Profiles
        </h1>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {players.map((player, index) => (
            <PlayerCard key={player.name} {...player} delay={index * 80} />
          ))}
          <AddPlayerCard delay={players.length * 80} />
        </div>
      </div>
    </main>
  );
}