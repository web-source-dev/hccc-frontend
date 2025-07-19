"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Minus,
  SortAsc,
  SortDesc,
  Search,
  CreditCard,
  Users,
  Package,
  RefreshCw,
} from "lucide-react"
import Image from "next/image"
import CashierProtected from "@/components/cashier-protected"
import { getGames, type Game } from '@/lib/games'
import { getCashierUsers, getCashierTokenBalances, adjustCashierTokenBalance, getCashierLocation, type User } from '@/lib/auth'
import { useAuth } from '@/lib/auth'

interface TokenBalance {
  _id: string;
  user: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  game: {
    _id: string;
    name: string;
  };
  location: string;
  tokens: number;
  pendingTokens: number;
  tokensScheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PendingToken {
  user: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  game: {
    _id: string;
    name: string;
  };
  location: string;
  tokens: number;
  scheduledFor: string;
}

interface TokenFilters {
  search: string;
  location: string;
  game: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function CashierPage() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [pendingTokens, setPendingTokens] = useState<PendingToken[]>([])
  const [allowedLocations, setAllowedLocations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [tokenFilters, setTokenFilters] = useState<TokenFilters>({
    search: '',
    location: 'all',
    game: 'all',
    sortBy: 'user',
    sortOrder: 'asc'
  })
  const [pendingTokenChanges, setPendingTokenChanges] = useState<{ [key: string]: number }>({})
  const [activeTab, setActiveTab] = useState("tokens")

  // Get cashier's allowed location
  const cashierLocation = user ? getCashierLocation(user) : null;
  const isAdminUser = user?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        console.log('Starting to fetch cashier data...');
        
        // Fetch games
        console.log('Fetching games...');
        const gamesRes = await getGames({ limit: 100 })
        const gamesData = gamesRes.data.games
        setGames(gamesData)
        console.log('Games fetched:', gamesData.length);

        // Fetch users
        console.log('Fetching users...');
        const usersRes = await getCashierUsers({ limit: 100 })
        const usersData = usersRes.data.users
        setUsers(usersData)
        console.log('Users fetched:', usersData.length);

        // Fetch token balances
        console.log('Fetching token balances...');
        const tokenRes = await getCashierTokenBalances()
        setTokenBalances(tokenRes.data.balances)
        setPendingTokens(tokenRes.data.pendingTokens)
        setAllowedLocations(tokenRes.data.allowedLocations)
        console.log('Token balances fetched:', tokenRes.data.balances.length);

      } catch (error) {
        console.error('Error fetching cashier data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleTokenAdjustment = async (userId: string, gameId: string, location: string, delta: number) => {
    try {
      const response = await adjustCashierTokenBalance(userId, gameId, location, delta)
      
      if (response.success) {
        // Update the token balances state
        setTokenBalances(prev => 
          prev.map(balance => 
            balance._id === response.data.balance._id 
              ? { ...balance, tokens: response.data.balance.tokens }
              : balance
          )
        )
        
        console.log(`Token adjustment successful: ${delta > 0 ? '+' : ''}${delta} tokens`)
      }
    } catch (error) {
      console.error('Token adjustment error:', error)
      // Revert the pending change on error
      const key = `${userId}-${gameId}-${location}`;
      setPendingTokenChanges(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredBalances = tokenBalances
    .filter(balance => {
      const user = users.find(u => u._id === balance.user._id || u.id === balance.user._id)
      
      const matchesSearch = !tokenFilters.search || 
        (user && `${user.firstname} ${user.lastname}`.toLowerCase().includes(tokenFilters.search.toLowerCase())) ||
        balance.user.firstname.toLowerCase().includes(tokenFilters.search.toLowerCase()) ||
        balance.user.lastname.toLowerCase().includes(tokenFilters.search.toLowerCase()) ||
        balance.user.email.toLowerCase().includes(tokenFilters.search.toLowerCase())
      
      const matchesLocation = tokenFilters.location === 'all' || balance.location === tokenFilters.location
      const matchesGame = tokenFilters.game === 'all' || balance.game._id === tokenFilters.game
      
      return matchesSearch && matchesLocation && matchesGame
    })
    .sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date
      
      switch (tokenFilters.sortBy) {
        case 'user':
          aValue = `${a.user.firstname} ${a.user.lastname}`
          bValue = `${b.user.firstname} ${b.user.lastname}`
          break
        case 'game':
          aValue = a.game.name
          bValue = b.game.name
          break
        case 'location':
          aValue = a.location
          bValue = b.location
          break
        case 'tokens':
          aValue = a.tokens
          bValue = b.tokens
          break
        case 'updatedAt':
          aValue = new Date(a.updatedAt)
          bValue = new Date(b.updatedAt)
          break
        default:
          aValue = ''
          bValue = ''
      }
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return tokenFilters.sortOrder === 'asc' ? comparison : -comparison
    })

  if (loading) {
    return (
      <CashierProtected>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
            <p className="text-gray-300">Loading cashier data...</p>
          </div>
        </div>
      </CashierProtected>
    )
  }

  return (
    <CashierProtected>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Token Management</h2>
            <p className="text-gray-400">
              {isAdminUser 
                ? 'Manage tokens for all locations' 
                : `Managing tokens for ${cashierLocation}`
              }
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-white mt-2">{users.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">Token Balances</span>
              </div>
              <p className="text-2xl font-bold text-white mt-2">{tokenBalances.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400">Pending Tokens</span>
              </div>
              <p className="text-2xl font-bold text-white mt-2">{pendingTokens.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="tokens" className="data-[state=active]:bg-green-600">Token Balances</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-green-600">Pending Tokens</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-6">
            {/* Token Filters */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label className="text-gray-400">Search User</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name..."
                        value={tokenFilters.search}
                        onChange={(e) => setTokenFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-400">Location</Label>
                    <Select value={tokenFilters.location} onValueChange={(value) => setTokenFilters(prev => ({ ...prev, location: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All locations</SelectItem>
                        {allowedLocations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-400">Game</Label>
                    <Select value={tokenFilters.game} onValueChange={(value) => setTokenFilters(prev => ({ ...prev, game: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="All games" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All games</SelectItem>
                        {games.map(game => (
                          <SelectItem key={game._id} value={game._id}>{game.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-400">Sort By</Label>
                    <Select value={tokenFilters.sortBy} onValueChange={(value) => setTokenFilters(prev => ({ ...prev, sortBy: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="game">Game</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="tokens">Tokens</SelectItem>
                        <SelectItem value="updatedAt">Last Updated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-400">Order</Label>
                    <Button
                      variant="outline"
                      onClick={() => setTokenFilters(prev => ({ 
                        ...prev, 
                        sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                      }))}
                      className="w-full bg-gray-700 border-gray-600 text-white"
                    >
                      {tokenFilters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Token Balances Table */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Game</TableHead>
                      <TableHead className="text-gray-300">Location</TableHead>
                      <TableHead className="text-gray-300">Tokens</TableHead>
                      <TableHead className="text-gray-300">Last Updated</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBalances.map((balance) => {
                      const game = games.find(g => g._id === balance.game._id)
                      const key = `${balance.user._id}-${balance.game._id}-${balance.location}`
                      
                      return (
                        <TableRow key={key} className="border-gray-700">
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">
                                {balance.user.firstname} {balance.user.lastname}
                              </p>
                              <p className="text-gray-400 text-sm">{balance.user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Image
                                src={game?.image || "/placeholder.svg"}
                                alt={balance.game.name}
                                width={40}
                                height={40}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <span className="text-white font-medium">{balance.game.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-blue-600 text-blue-400">
                              {balance.location}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-purple-400 font-bold text-lg">
                              {pendingTokenChanges[key] ?? balance.tokens}
                            </div>
                            {balance.pendingTokens > 0 && (
                              <div className="text-yellow-400 text-sm">
                                +{balance.pendingTokens} pending
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-300">{formatDate(balance.updatedAt)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const currentValue = pendingTokenChanges[key] ?? balance.tokens;
                                  const newValue = Math.max(0, currentValue - 5);
                                  setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                  handleTokenAdjustment(balance.user._id, balance.game._id, balance.location, newValue - balance.tokens);
                                }}
                                disabled={(pendingTokenChanges[key] ?? balance.tokens) < 5}
                                className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Input
                                type="number"
                                min="0"
                                value={pendingTokenChanges[key] ?? balance.tokens}
                                onChange={e => {
                                  const newValue = Math.max(0, parseInt(e.target.value) || 0);
                                  setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                  handleTokenAdjustment(balance.user._id, balance.game._id, balance.location, newValue - balance.tokens);
                                }}
                                className="w-20 text-center bg-gray-700 border-gray-600 text-white"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const currentValue = pendingTokenChanges[key] ?? balance.tokens;
                                  const newValue = currentValue + 5;
                                  setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                  handleTokenAdjustment(balance.user._id, balance.game._id, balance.location, 5);
                                }}
                                className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {/* Pending Tokens */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Pending Token Additions</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingTokens.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No pending token additions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingTokens.map((pending, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-white font-medium">
                            {pending.user.firstname} {pending.user.lastname}
                          </p>
                          <p className="text-gray-400 text-sm">{pending.user.email}</p>
                          <p className="text-gray-300 text-sm">
                            {pending.game.name} at {pending.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 font-bold text-lg">+{pending.tokens} tokens</p>
                          <p className="text-gray-400 text-sm">
                            Scheduled for {formatDate(pending.scheduledFor)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CashierProtected>
  )
}
