"use client"

import { useEffect, useRef, useState } from "react"
import {
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { getGames, type Game } from "@/lib/games"
import Image from "next/image"

// Animated GameCard component
function GameCard({ game, location }: { game: Game; location: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    card.classList.add("opacity-0", "translate-y-8");
    const onScroll = () => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        card.classList.remove("opacity-0", "translate-y-8");
        card.classList.add("opacity-100", "translate-y-0");
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center transition-all duration-700 ease-out opacity-0 translate-y-8 group relative"
      tabIndex={0}
    >
      <div className="rounded-lg border-4 border-yellow-400 shadow-lg overflow-hidden mb-2 transition-transform group-hover:scale-105 group-hover:shadow-yellow-400/40">
        <Image src={game.image} alt={game.name} className="w-32 h-32 object-cover" width={128} height={128} />
      </div>
      <div className="mt-2 w-full">
        <div className="bg-[#b80000] text-white font-bold text-center py-2 rounded mb-2 tracking-wide text-lg uppercase relative">
          {game.name}
          {/* Featured badge */}
          {game.featured && (
            <span className="absolute -top-3 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow">Featured</span>
          )}
        </div>
        <Link 
          href={`/tokens/${game.name.toLowerCase().replace(/\s+/g, "-")}?location=${location.toLowerCase().replace(/\s+/g, "-")}&gameId=${game._id}`}
          className="bg-[#b80000] text-white font-bold text-center py-2 rounded tracking-wide text-lg w-full transition-transform transition-shadow duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 block"
          tabIndex={0}
        >
          TOKENS
        </Link>
      </div>
      {/* Tooltip on hover/focus */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-black/90 text-white text-xs rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
        <div className="font-semibold mb-1">{game.name} - {location}</div>
        {game.description}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getGames({ status: 'active', limit: 50 });
        setGames(response.data.games);
      } catch (err: unknown) {
        setError((err as Error).message || 'Failed to load games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Create game-location combinations
  const gameLocationCombinations = games.flatMap(game => 
    game.locations.map(location => ({
      game,
      location: location.name,
      available: location.available
    }))
  ).filter(combination => combination.available);

  // Group by location
  const gamesByLocation = gameLocationCombinations.reduce((acc, combination) => {
    const location = combination.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(combination);
    return acc;
  }, {} as Record<string, Array<{ game: Game; location: string; available: boolean }>>);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {Object.entries(gamesByLocation).map(([location, locationGames]) => (
        <section key={location} className="py-16 bg-black">
          <h2 className="text-5xl font-extrabold text-center mb-10 tracking-tight text-white font-sans flex items-center justify-center gap-3" style={{ letterSpacing: 2 }}>
            <MapPin className="w-8 h-8 text-yellow-400 inline-block" />
            {location.toUpperCase()}
          </h2>
          <div className="max-w-4xl mx-auto bg-[#222] rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {locationGames.map((combination) => (
              <GameCard 
                key={`${combination.game._id}-${combination.location}`} 
                game={combination.game} 
                location={combination.location} 
              />
            ))}
          </div>
        </section>
      ))}
      
      {Object.keys(gamesByLocation).length === 0 && (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 mb-4">No games available at the moment.</p>
            <p className="text-sm text-gray-500">Please check back later or contact an administrator.</p>
          </div>
        </div>
      )}
    </div>
  )
}
