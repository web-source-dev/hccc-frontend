"use client"

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ShoppingCart, Loader2, Clock } from "lucide-react";
import Link from "next/link";
import { getGame, type Game } from "@/lib/games";
import { getTimeDisclaimer, formatLocationName } from "@/lib/utils";
import Image from "next/image";

function TokenPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const location = searchParams.get("location") || "";
  const gameId = searchParams.get("gameId") || "";
  
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // Get time disclaimer for current location
  const timeDisclaimer = getTimeDisclaimer(location);

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) {
        setError("Game ID is required");
        setLoading(false);
        return;
      }

      try {
        const response = await getGame(gameId);
        setGame(response.data.game);
      } catch (err: unknown) {
        setError((err as Error).message || "Failed to load game");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  const handlePurchase = () => {
    if (selectedPackage === null || !game) return;
    
    const selectedTokenPackage = game.tokenPackages[selectedPackage];
    router.push(`/checkout?gameId=${game._id}&packageIndex=${selectedPackage}&tokens=${selectedTokenPackage.tokens}&price=${selectedTokenPackage.price}&location=${location}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gold-400" />
          <p className="text-white">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error || "Game not found"}</p>
          <Link href="/" className="bg-gold-400 text-black px-4 py-2 rounded hover:bg-white">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const displayName = game.name;
  const image = game.image || "/placeholder.svg";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-black">
      <div className="w-full max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center text-gold-400 hover:text-white mb-6 text-sm font-semibold rounded-full px-4 py-1 bg-black border border-gold-400 shadow-gold-400/30 shadow-sm transition-all">
          <ArrowLeft className="w-4 h-4 mr-1" /> Home
        </Link>
        
        {/* Time Disclaimer Alert */}
        {timeDisclaimer.show && (
          <Alert className="mb-4 border-orange-500 bg-orange-950/20 text-orange-200">
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-sm font-medium">
              {timeDisclaimer.message}
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="bg-black border-2 border-gold-400 rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden" style={{ boxShadow: '0 0 32px 0 #FFD70033, 0 2px 8px #0008' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 30%, #ffd70022 0%, transparent 70%)' }} />
          <Image src={image} alt={displayName} className="w-28 h-28 object-cover rounded-full mx-auto mb-4 border-4 border-gold-400 shadow-gold-400/40" width={112} height={112} />
          <h1 className="text-3xl font-extrabold mb-2 text-gold-400 uppercase tracking-widest" style={{ fontFamily: 'serif, system-ui' }}>{displayName}</h1>
          {location && <div className="mb-4 text-gold-200 font-semibold text-xs tracking-wide uppercase">Location: {formatLocationName(location)}</div>}
          
          {/* Additional time disclaimer inside card if applicable */}
          {timeDisclaimer.show && (
            <div className="mb-4 p-3 bg-orange-950/30 border border-orange-500/50 rounded-lg">
              <p className="text-orange-200 text-xs font-medium flex items-center justify-center">
                <Clock className="w-3 h-3 mr-1" />
                {timeDisclaimer.message}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-3 mb-6">
            {game.tokenPackages.map((pkg, idx) => (
              <button
                key={pkg.tokens}
                onClick={() => setSelectedPackage(idx)}
                className={`w-full py-2 rounded-full border-2 font-bold text-base transition-all duration-200 flex items-center justify-center gap-2
                  ${selectedPackage === idx ? "bg-gold-400 text-black border-gold-400 scale-105 shadow-gold-400/40 shadow" : "bg-black text-gold-200 border-gold-700 hover:bg-gold-400 hover:text-black hover:border-gold-400"}`}
                style={{ letterSpacing: 1 }}
              >
                <span className="inline-block w-6 h-6 rounded-full bg-gold-400 text-black flex items-center justify-center font-extrabold mr-2" style={{ fontSize: '1rem' }}>●</span>
                {pkg.tokens} TOKENS <span className="mx-2">•</span> ${pkg.price}
              </button>
            ))}
          </div>
          <Button
            className="w-full mt-2 bg-gold-400 text-black font-bold rounded-full py-2 px-6 text-base shadow-gold-400/40 shadow transition-all hover:bg-white hover:text-gold-400 disabled:opacity-60 disabled:cursor-not-allowed border-2 border-gold-400"
            style={{ letterSpacing: 1 }}
            disabled={selectedPackage === null}
            onClick={handlePurchase}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {selectedPackage !== null ? `Buy ${game.tokenPackages[selectedPackage].tokens} Tokens for $${game.tokenPackages[selectedPackage].price}` : "Select a Package"}
          </Button>
        </Card>
      </div>
      <style jsx global>{`
        .text-gold-400 { color: #FFD700; }
        .bg-gold-400 { background-color: #FFD700; }
        .border-gold-400 { border-color: #FFD700; }
        .shadow-gold-400\/40 { box-shadow: 0 0 12px #FFD70066; }
        .text-gold-200 { color: #ffe066; }
        .bg-gold-300 { background-color: #ffe066; }
        .border-gold-700 { border-color: #bfa100; }
      `}</style>
    </div>
  );
}

// Loading component for suspense fallback
function LoadingTokenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gold-400" />
        <p className="text-white">Loading game...</p>
      </div>
    </div>
  );
}

export default function TokenPage() {
  return (
    <Suspense fallback={<LoadingTokenPage />}>
      <TokenPageContent />
    </Suspense>
  );
} 