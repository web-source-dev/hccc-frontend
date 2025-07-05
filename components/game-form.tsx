'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  GAME_CATEGORIES, 
  GAME_STATUSES, 
  DEFAULT_TOKEN_PACKAGES, 
  DEFAULT_LOCATIONS,
  type CreateGameData,
  type UpdateGameData 
} from '@/lib/games';

const gameSchema = z.object({
  name: z.string().min(2, 'Game name must be at least 2 characters').max(100, 'Game name cannot exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description cannot exceed 500 characters'),
  image: z.string().min(1, 'Game image is required'),
  category: z.enum(['RPG', 'Action', 'Sci-Fi', 'Adventure', 'Strategy', 'Puzzle', 'Racing', 'Sports', 'Other']),
  status: z.enum(['active', 'inactive', 'maintenance']),
  featured: z.boolean(),
  locations: z.array(z.object({
    name: z.string().min(1, 'Location name is required'),
    available: z.boolean()
  })).min(1, 'At least one location is required'),
  tokenPackages: z.array(z.object({
    tokens: z.number().min(1, 'Tokens must be at least 1').int('Tokens must be an integer'),
    price: z.number().min(0, 'Price must be positive')
  })).min(1, 'At least one token package is required')
});

type GameFormData = z.infer<typeof gameSchema>;

interface GameFormProps {
  game?: UpdateGameData;
  onSubmit: (data: CreateGameData | UpdateGameData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export type { GameFormData };
export default function GameForm({ game, onSubmit, onCancel, loading = false }: GameFormProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema),
    defaultValues: game ? {
      name: game.name,
      description: game.description,
      image: game.image,
      category: game.category,
      status: game.status || 'active',
      featured: game.featured || false,
      locations: game.locations || DEFAULT_LOCATIONS,
      tokenPackages: game.tokenPackages || DEFAULT_TOKEN_PACKAGES,
    } : {
      name: '',
      description: '',
      image: '',
      category: 'Other',
      status: 'active',
      featured: false,
      locations: DEFAULT_LOCATIONS,
      tokenPackages: DEFAULT_TOKEN_PACKAGES,
    }
  });

  const watchedLocations = watch('locations');
  const watchedTokenPackages = watch('tokenPackages');

  const addLocation = () => {
    const newLocations = [...watchedLocations, { name: '', available: true }];
    setValue('locations', newLocations);
  };

  const removeLocation = (index: number) => {
    if (watchedLocations.length > 1) {
      const newLocations = watchedLocations.filter((_, i) => i !== index);
      setValue('locations', newLocations);
    }
  };

  const updateLocation = (index: number, field: string, value: string | boolean) => {
    const newLocations = [...watchedLocations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setValue('locations', newLocations);
  };

  const addTokenPackage = () => {
    const newPackages = [...watchedTokenPackages, { tokens: 0, price: 0 }];
    setValue('tokenPackages', newPackages);
  };

  const removeTokenPackage = (index: number) => {
    if (watchedTokenPackages.length > 1) {
      const newPackages = watchedTokenPackages.filter((_, i) => i !== index);
      setValue('tokenPackages', newPackages);
    }
  };

  const updateTokenPackage = (index: number, field: string, value: number | string) => {
    const newPackages = [...watchedTokenPackages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setValue('tokenPackages', newPackages);
  };

  const handleFormSubmit = async (data: GameFormData) => {
    setError(null);
    try {
      if (game) {
        await onSubmit({ ...data, _id: game._id });
      } else {
        await onSubmit(data);
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to save game');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Game Name *</Label>
              <Input
                id="name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
                placeholder="Enter game name"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={watch('category')} onValueChange={(value) => setValue('category', value as 'RPG' | 'Action' | 'Sci-Fi' | 'Adventure' | 'Strategy' | 'Puzzle' | 'Racing' | 'Sports' | 'Other')}>
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {GAME_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
              placeholder="Enter game description"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="image">Game Image *</Label>
            <div className="flex items-center space-x-4">
              <Button type="button" variant="outline" onClick={() => document.getElementById('imageInput')?.click()}>
                Upload Image
              </Button>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {watch('image') && (
                <img src={watch('image')} alt="Preview" className="w-16 h-16 rounded object-cover border" />
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={watch('status')} onValueChange={(value) => setValue('status', value as 'active' | 'inactive' | 'maintenance')}>
                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {GAME_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={watch('featured')}
                onCheckedChange={(checked) => setValue('featured', checked)}
              />
              <Label htmlFor="featured">Featured Game</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Locations & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {watchedLocations.map((location, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Location {index + 1}</h4>
                {watchedLocations.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLocation(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Location Name *</Label>
                  <Input
                    value={location.name}
                    onChange={(e) => updateLocation(index, 'name', e.target.value)}
                    placeholder="e.g., Cedar Park"
                  />
                </div>
                
                <div>
                  <Label>Available</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={location.available}
                      onCheckedChange={(checked) => updateLocation(index, 'available', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addLocation}>
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Token Packages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {watchedTokenPackages.map((pkg, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Package {index + 1}</h4>
                {watchedTokenPackages.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTokenPackage(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tokens *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={pkg.tokens}
                    onChange={(e) => updateTokenPackage(index, 'tokens', parseInt(e.target.value) || 0)}
                    placeholder="10"
                  />
                </div>
                
                <div>
                  <Label>Price ($) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={pkg.price}
                    onChange={(e) => updateTokenPackage(index, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addTokenPackage}>
            <Plus className="w-4 h-4 mr-2" />
            Add Token Package
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            game ? 'Update Game' : 'Create Game'
          )}
        </Button>
      </div>
    </form>
  );
} 