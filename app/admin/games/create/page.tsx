'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GameForm from '@/components/game-form';
import { createGame, UpdateGameData, type CreateGameData } from '@/lib/games';



export default function CreateGamePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const handleCreate = async (data: CreateGameData) => {
    setLoading(true);
    setError(null);
    
    try {
      await createGame(data);
      router.push('/admin');
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin');
  };

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
        <h1 className="text-2xl font-bold">Create New Game</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Game Information</CardTitle>
        </CardHeader>
        <CardContent>
          <GameForm
            onSubmit={handleCreate as unknown as (data: CreateGameData | UpdateGameData) => Promise<void>}
            onCancel={handleCancel}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
} 