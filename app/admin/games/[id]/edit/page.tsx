'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GameForm from '@/components/game-form';
import { getGame, updateGame, type CreateGameData, type UpdateGameData } from '@/lib/games';

export default function EditGamePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<UpdateGameData | null>(null);
  const router = useRouter();
  const params = useParams();
  const gameId = params.id as string;

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await getGame(gameId);
        setGame(response.data.game);
      } catch (err: unknown) {
        setError((err as Error).message || 'Failed to fetch game');
      }
    };

    if (gameId) {
      fetchGame();
    }
  }, [gameId]);

  const handleUpdate = async (data: UpdateGameData) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateGame(data);
      router.push('/admin');
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to update game');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  if (!game && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Button>
        <h1 className="text-2xl font-bold">Edit Game: {game?.name}</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {game && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Game Information</CardTitle>
          </CardHeader>
          <CardContent>
            <GameForm
              game={game}
              onSubmit={handleUpdate as unknown as (data: CreateGameData | UpdateGameData) => Promise<void>}
              onCancel={handleCancel}
              loading={loading}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
} 