"use client"

import { useEffect, useRef, useState } from "react"
import {
  MapPin,
  Trophy,
  Star,
  Clock,
  Phone
} from "lucide-react"
import Link from "next/link"
import { getGames, type Game } from "@/lib/games"
import { getPublicWinners, type Winner } from "@/lib/winners"
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

// Recent Winner Card component
function WinnerCard({ winner }: { winner: Winner }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-[#222] rounded-xl p-6 border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h4 className="font-bold text-yellow-400">{winner.name}</h4>
        </div>
        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
          WINNER!
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <p><span className="text-gray-400">Game:</span> <span className="font-semibold">{winner.game.name}</span></p>
        <p><span className="text-gray-400">Location:</span> <span className="font-semibold">{winner.location}</span></p>
        <p><span className="text-gray-400">Amount:</span> <span className="font-semibold text-green-400">{formatAmount(winner.amount)}</span></p>
        <p><span className="text-gray-400">Date:</span> <span className="font-semibold">{formatDate(winner.date)}</span></p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [winnersLoading, setWinnersLoading] = useState(true);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [winnersError, setWinnersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getGames({ status: 'active', limit: 50 });
        setGames(response.data.games);
      } catch (err: unknown) {
        setGamesError((err as Error).message || 'Failed to load games');
      } finally {
        setGamesLoading(false);
      }
    };

    const fetchWinners = async () => {
      try {
        const response = await getPublicWinners();
        setWinners(response);
      } catch (err: unknown) {
        setWinnersError((err as Error).message || 'Failed to load winners');
      } finally {
        setWinnersLoading(false);
      }
    };

    fetchGames();
    fetchWinners();
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

  // Get recent winners (limit to 6)
  const recentWinners = winners.slice(0, 6);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section with GIF (solid black, no border, smaller image) */}
      <section className="w-full bg-black flex flex-col items-center justify-center py-16">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight text-white text-center">
          HCCC GAMEROOM
        </h1>
        <div className="mb-8 flex justify-center">
          <div className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] pl-[13px]">
            <Image 
              src="/image.gif" 
              alt="HCCC Gameroom Animation" 
              width={320}
              height={320}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
        <p className="text-xl md:text-2xl text-yellow-400 mb-8 max-w-3xl mx-auto text-center flex justify-center">
          Central Texas&apos;s Premier Gaming Destination
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-yellow-400" />
            <span>Two Locations</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span>Big Winners</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-400" />
            <span>Premium Games</span>
          </div>
        </div>
      </section>

      {/* Game Sections */}
      {gamesLoading ? (
        <section className="py-16 bg-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-extrabold mb-10 tracking-tight text-white">GAMES</h2>
            <div className="bg-[#222] rounded-2xl p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading games...</p>
            </div>
          </div>
        </section>
      ) : gamesError ? (
        <section className="py-16 bg-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-extrabold mb-10 tracking-tight text-white">GAMES</h2>
            <div className="bg-[#222] rounded-2xl p-8">
              <p className="text-red-400 mb-4">Error loading games. Please try again later.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          {Object.entries(gamesByLocation).map(([location, locationGames]) => (
            <section key={location} className="py-16 bg-black">
              <h2 className="text-5xl font-extrabold text-center mb-10 tracking-tight text-white font-sans flex items-center justify-center gap-3" style={{ letterSpacing: 2 }}>
                <MapPin className="w-8 h-8 text-yellow-400 inline-block" />
                {location.toUpperCase()}
              </h2>
              <div className="max-w-6xl mx-auto bg-[#222] rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
            <section className="py-16 bg-black">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-5xl font-extrabold mb-10 tracking-tight text-white">GAMES</h2>
                <div className="bg-[#222] rounded-2xl p-8">
                <p className="text-gray-400 mb-4">No games available at the moment.</p>
                <p className="text-sm text-gray-500">Please check back later or contact an administrator.</p>
              </div>
            </div>
            </section>
          )}
        </>
      )}

      {/* Recent Winners Section */}
      <section className="py-20 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center mb-4 text-yellow-400">RECENT IN HOUSE WINNERS</h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Congratulations to our latest winners! Join the excitement and see if you can be next.
          </p>
          
          {winnersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading winners...</p>
            </div>
          ) : winnersError ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">Error loading winners. Please try again later.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
              >
                Try Again
              </button>
            </div>
          ) : recentWinners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentWinners.map((winner) => (
                <WinnerCard key={winner._id} winner={winner} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No recent winners</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              href="/promotions" 
              className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              View All Promotions
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-20 bg-[#111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">VISIT US TODAY</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cedar Park */}
            <div className="bg-[#222] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">CEDAR PARK</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">601 E Whitestone Blvd, Suite 304</p>
                    <p className="text-gray-300">Cedar Park, TX 78613</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  <a href="tel:5129867878" className="hover:text-yellow-400 transition-colors">
                    (512) 986-7878
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Hours:</p>
                    <p className="text-gray-300">Monday - Sunday: 11 am - 3 am</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Liberty Hill */}
            <div className="bg-[#222] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">LIBERTY HILL</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">15399 TX-29 Unit B</p>
                    <p className="text-gray-300">Liberty Hill, TX 78642</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  <a href="tel:5125486505" className="hover:text-yellow-400 transition-colors">
                    (512) 548-6505
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Hours:</p>
                    <p className="text-gray-300">Monday - Thursday: 10 am - 11 pm</p>
                    <p className="text-gray-300">Friday - Saturday: 10 am - midnight</p>
                    <p className="text-gray-300">Sunday: 10 am - 11 pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Reloads & Redemption Disclaimer Section with Waves (full width, before newsletter) */}
      <section className="relative w-full bg-black py-16 overflow-x-hidden">
        {/* Top Wave - full screen width, outside content container */}
        <div className="absolute top-0 left-0 w-screen min-w-full" aria-hidden="true" style={{minWidth: '100vw'}}>
          <svg viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-screen h-16 min-w-full">
            <path d="M0 40 Q300 80 600 40 T1200 40 V80 H0 V40Z" fill="white" fillOpacity="0.15" />
            <path d="M0 60 Q300 20 600 60 T1200 60 V80 H0 V60Z" fill="white" fillOpacity="0.10" />
          </svg>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-white tracking-wide">DIGITAL RELOADS & REDEMPTION DISCLAIMER</h2>
          <ul className="text-left text-white text-base md:text-lg mb-6 list-disc list-inside space-y-2">
            <li>All sales are final. There are no refunds on any digital reload purchases.</li>
            <li>Redemptions must be made in person at either of our two physical HCCC Gameroom locations: Cedar Park or Liberty Hill.</li>
            <li>A valid government-issued photo ID is required at the time of redemption. No exceptions.</li>
            <li>Daily redemption limit is $500 per person, per day.</li>
            <li>HCCC Gameroom is not liable for any malfunctions, interruptions, or errors related to third-party online games. While we strive to ensure a smooth experience, technical issues beyond our control may occur.</li>
            <li>Players are responsible for maintaining the security and access to their own accounts. Please play responsibly.</li>
            <li>By proceeding with a digital reload, you confirm that you are at least 18 years of age and agree to these terms in full.</li>
          </ul>
          <p className="text-white text-base md:text-lg">For any questions or concerns, feel free to reach out directly. Thank you for choosing HCCC Gameroom — Spin. Win. Repeat.</p>
        </div>
        {/* Bottom Wave - full screen width, outside content container */}
        <div className="absolute bottom-0 left-0 w-screen min-w-full" aria-hidden="true" style={{minWidth: '100vw'}}>
          <svg viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-screen h-16 min-w-full">
            <path d="M0 40 Q300 80 600 40 T1200 40 V80 H0 V40Z" fill="white" fillOpacity="0.15" />
            <path d="M0 60 Q300 20 600 60 T1200 60 V80 H0 V60Z" fill="white" fillOpacity="0.10" />
          </svg>
        </div>
      </section>

      {/* Newsletter Signup Section (full, matches screenshot) */}
      <section className="w-full flex justify-center items-center py-16 bg-[#8b0000]">
        <form className="w-full max-w-xl bg-[#8b0000] p-8 rounded-lg shadow-lg text-white space-y-6">
          <h2 className="text-2xl md:text-2xl font-bold mb-4 text-white">Subscribe to our newsletter • Don&apos;t miss out!</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">First name</label>
              <input type="text" className="w-full px-4 py-2 rounded bg-white text-black" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Last name</label>
              <input type="text" className="w-full px-4 py-2 rounded bg-white text-black" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Month & year you were born mmyyyy *</label>
              <input type="text" className="w-full px-4 py-2 rounded bg-white text-black" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email *</label>
              <div className="flex">
                <input type="email" className="flex-1 px-4 py-2 rounded-l bg-white text-black" placeholder="e.g., email@example.com" />
                <button type="submit" className="px-6 py-2 bg-black text-white font-bold rounded-r">Join</button>
              </div>
            </div>
            <div>
              <p className="italic text-white text-sm mt-1 mb-2">Provide number if you would like to be one of the first to occasionally be texted about the latest promotions and events!</p>
              <label className="block mb-1 font-medium">Phone</label>
              <input type="tel" className="w-full px-4 py-2 rounded bg-white text-black" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Address *</label>
              <input type="text" className="w-full px-4 py-2 rounded bg-white text-black" />
            </div>
            <div className="flex items-center mt-2">
              <input type="checkbox" className="w-4 h-4 mr-2 accent-[#8b0000] border border-white" />
              <span className="text-white text-sm">I want to subscribe to your mailing list.</span>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}
