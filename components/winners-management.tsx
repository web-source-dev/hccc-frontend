'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Trophy,
  DollarSign,
  Calendar,
  MapPin,
  Upload,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { getWinners, createWinner, updateWinner, deleteWinner, toggleWinnerVisibility, type Winner, type CreateWinnerData } from '@/lib/winners';
import { getGames, type Game } from '@/lib/games';

interface WinnerFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  game: string;
  amount: number;
  date: string;
  showWinner: boolean;
}

export default function WinnersManagement() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWinner, setEditingWinner] = useState<Winner | null>(null);
  const [formData, setFormData] = useState<WinnerFormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    game: '',
    amount: 0,
    date: '',
    showWinner: false
  });

  // Fetch winners
  const fetchWinners = async () => {
    try {
      const data = await getWinners();
      setWinners(data);
    } catch (error) {
      toast.error('Failed to fetch winners');
    } finally {
      setLoading(false);
    }
  };

  // Fetch games for dropdown
  const fetchGames = async () => {
    try {
      const response = await getGames({ limit: 100, page: 1 });
      setGames(response.data.games);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchWinners();
    fetchGames();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      game: '',
      amount: 0,
      date: '',
      showWinner: false
    });
    setEditingWinner(null);
  };

  // Open dialog for create/edit
  const openDialog = (winner?: Winner) => {
    if (winner) {
      setEditingWinner(winner);
      setFormData({
        name: winner.name,
        email: winner.email,
        phone: winner.phone,
        location: winner.location,
        game: winner.game._id,
        amount: winner.amount,
        date: new Date(winner.date).toISOString().split('T')[0],
        showWinner: winner.showWinner
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData: CreateWinnerData = formData;

      if (editingWinner) {
        await updateWinner(editingWinner._id, submitData);
        toast.success('Winner updated successfully');
      } else {
        await createWinner(submitData);
        toast.success('Winner created successfully');
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchWinners();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Delete winner
  const handleDeleteWinner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this winner?')) return;

    try {
      await deleteWinner(id);
      toast.success('Winner deleted successfully');
      fetchWinners();
    } catch (error) {
      toast.error('Error deleting winner');
    }
  };

  // Toggle winner visibility
  const handleToggleWinnerVisibility = async (winner: Winner) => {
    try {
      await toggleWinnerVisibility(winner._id, !winner.showWinner);
      toast.success(`Winner ${winner.showWinner ? 'hidden' : 'shown'} successfully`);
      fetchWinners();
    } catch (error) {
      toast.error('Error updating winner visibility');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading winners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Winners Management</h2>
          <p className="text-gray-400">Manage winners and their visibility</p>
        </div>
        <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Winner
        </Button>
      </div>

      {/* Winners Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Winners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Phone</TableHead>
                  <TableHead className="text-gray-300">Location</TableHead>
                  <TableHead className="text-gray-300">Game</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {winners.map((winner) => (
                  <TableRow key={winner._id} className="border-gray-700">
                    <TableCell className="text-white">{winner.name}</TableCell>
                    <TableCell className="text-gray-300">{winner.email}</TableCell>
                    <TableCell className="text-gray-300">{winner.phone}</TableCell>
                    <TableCell className="text-gray-300">{winner.location}</TableCell>
                    <TableCell className="text-gray-300">{winner.game.name}</TableCell>
                    <TableCell className="text-gray-300">
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                        {winner.amount}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(winner.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={winner.showWinner ? "default" : "secondary"}>
                        {winner.showWinner ? "Visible" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleWinnerVisibility(winner)}
                          className="bg-gray-700 border-gray-600 text-white"
                        >
                          {winner.showWinner ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(winner)}
                          className="bg-gray-700 border-gray-600 text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteWinner(winner._id)}
                          className="bg-red-600 border-red-600 text-white hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingWinner ? 'Edit Winner' : 'Add New Winner'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-gray-300">Location</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="Cedar Park" className="text-white">Cedar Park</SelectItem>
                    <SelectItem value="Liberty Hill" className="text-white">Liberty Hill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="game" className="text-gray-300">Game</Label>
                <Select
                  value={formData.game}
                  onValueChange={(value) => setFormData({ ...formData, game: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {games.map((game) => (
                      <SelectItem key={game._id} value={game._id} className="text-white">
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount" className="text-gray-300">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date" className="text-gray-300">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="showWinner"
                checked={formData.showWinner}
                onCheckedChange={(checked) => setFormData({ ...formData, showWinner: checked })}
              />
              <Label htmlFor="showWinner" className="text-gray-300">Show Winner</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-700 border-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editingWinner ? 'Update Winner' : 'Add Winner'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
