"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Gamepad2, 
  BarChart3,
  CreditCard,
  Activity,
  Package,
  Minus,
  Ban,
  SortAsc,
  SortDesc,
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { getGames, deleteGame, type Game } from '@/lib/games'
import { getAllUsers, getUserStats, getAdminUserTokenBalances, adjustUserTokenBalance, updateUser, deleteUser, blockUser, type User } from '@/lib/auth'
import { getAllPayments, getPaymentStats, type Payment } from '@/lib/payments'
import Image from "next/image"

interface DashboardStats {
  totalGames: number;
  totalUsers: number;
  totalRevenue: number;
  totalPayments: number;
  activeGames: number;
  featuredGames: number;
}

interface TokenBalance {
  _id: string;
  user: string;
  game: {
    _id: string;
    name: string;
  };
  location: string;
  tokens: number;
  createdAt: string;
  updatedAt: string;
}

interface TokenManagementModal {
  user: User;
  balances: TokenBalance[];
  selectedGame?: Game;
  selectedLocation?: string;
}

interface UserFilters {
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface TokenFilters {
  search: string;
  location: string;
  game: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [userTokenBalances, setUserTokenBalances] = useState<{ [userId: string]: TokenBalance[] }>({})
  const [stats, setStats] = useState<DashboardStats>({
    totalGames: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalPayments: 0,
    activeGames: 0,
    featuredGames: 0
  })
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [tokenAdjustmentModal, setTokenAdjustmentModal] = useState<TokenManagementModal | null>(null)
  const [userFilters, setUserFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [tokenFilters, setTokenFilters] = useState<TokenFilters>({
    search: '',
    location: 'all',
    game: 'all',
    sortBy: 'user',
    sortOrder: 'asc'
  })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [pendingTokenChanges, setPendingTokenChanges] = useState<{ [key: string]: number }>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setAuthError('No authentication token found');
          return;
        }
        console.log('Admin page - Token found:', token.substring(0, 20) + '...', authError);
        setAuthError(null);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthError('Authentication check failed');
      }
    };
    checkAuth();
    // Only run on mount, ignore authError in dependency to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        console.log('Starting to fetch admin dashboard data...');
        
        // Fetch games
        console.log('Fetching games...');
        const gamesRes = await getGames({ limit: 100 })
        const gamesData = gamesRes.data.games
        setGames(gamesData)
        console.log('Games fetched:', gamesData.length);

        // Fetch users
        console.log('Fetching users...');
        const usersRes = await getAllUsers({ limit: 100 })
        const usersData = usersRes.data.users
        setUsers(usersData)
        console.log('Users fetched:', usersData.length);

        // Fetch payments
        console.log('Fetching payments...');
        const paymentsRes = await getAllPayments({ limit: 100 })
        const paymentsData = paymentsRes.data.payments
        setPayments(paymentsData)
        console.log('Payments fetched:', paymentsData.length);

        // Fetch statistics
        console.log('Fetching statistics...');
        const userStatsRes = await getUserStats()
        const paymentStatsRes = await getPaymentStats()

        // Calculate stats
        const activeGames = gamesData.filter(game => game.status === 'active').length
        const featuredGames = gamesData.filter(game => game.featured).length

        const statsData = {
          totalGames: gamesData.length,
          totalUsers: userStatsRes.data.totalUsers,
          totalRevenue: paymentStatsRes.data.totalRevenue,
          totalPayments: paymentStatsRes.data.totalPayments,
          activeGames,
          featuredGames
        }
        
        setStats(statsData)
        console.log('Stats calculated:', statsData);

        // Fetch token balances for all users
        console.log('Fetching token balances...');
        const tokenBalancesData: { [userId: string]: TokenBalance[] } = {}
        for (const user of usersData) {
          try {
            const balancesRes = await getAdminUserTokenBalances(user._id || user.id)
            tokenBalancesData[user._id || user.id] = balancesRes.data.balances
          } catch (error) {
            console.error(`Failed to fetch token balances for user ${user._id}:`, error)
            tokenBalancesData[user._id || user.id] = []
          }
        }
        setUserTokenBalances(tokenBalancesData)
        console.log('Token balances fetched for', Object.keys(tokenBalancesData).length, 'users');

        console.log('Admin dashboard data fetch completed successfully');

      } catch (e) {
        console.error('Failed to fetch admin dashboard data:', e)
        setAuthError(`Failed to load dashboard data: ${(e as Error).message}`);
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      setLoading(true)
      try {
        await deleteGame(id)
        setGames(games.filter(game => game._id !== id))
        setStats(prev => ({ ...prev, totalGames: prev.totalGames - 1 }))
      } catch (e) {
        console.error('Failed to delete game:', e)
      } finally {
        setLoading(false)
      }
    }
  }

  const filteredGames = games.filter(
    (game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleTokenAdjustment = async (userId: string, gameId: string, location: string, delta: number) => {
    try {
      await adjustUserTokenBalance(userId, gameId, location, delta)
      
      // Update local state
      setUserTokenBalances(prev => {
        const userBalances = prev[userId] || []
        const existingBalance = userBalances.find(b => b.game._id === gameId && b.location === location)
        
        if (existingBalance) {
          existingBalance.tokens = Math.max(0, existingBalance.tokens + delta)
        } else if (delta > 0) {
          // Create new balance if adding tokens
          const newBalance: TokenBalance = {
            _id: `temp-${Date.now()}`,
            user: userId,
            game: { _id: gameId, name: 'Unknown Game' },
            location,
            tokens: delta,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          userBalances.push(newBalance)
        }
        
        return { ...prev, [userId]: userBalances }
      })
    } catch (error) {
      console.error('Failed to adjust token balance:', error)
      alert('Failed to adjust token balance')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId)
        setUsers(users.filter(user => user._id !== userId))
        alert('User deleted successfully')
      } catch (error) {
        console.error('Failed to delete user:', error)
        alert('Failed to delete user')
      }
    }
  }

  const handleBlockUser = async (userId: string) => {
    try {
      const user = users.find((u: User) => u._id === userId || u.id === userId)
      if (!user) return
      const newStatus = !user.isActive
      const result = await blockUser(userId, newStatus)
      setUsers(users.map((u: User) =>
        (u._id === userId || u.id === userId) ? result.data.user : u
      ))
      alert(`User ${newStatus ? 'activated' : 'blocked'} successfully`)
    } catch (error) {
      console.error('Failed to update user status:', error)
      alert('Failed to update user status')
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleSaveUser = async (updatedUser: User) => {
    try {
      // Only send fields that are present and valid
      const data: Record<string, unknown> = {};
      if (updatedUser.firstname) data.firstname = updatedUser.firstname;
    if (updatedUser.lastname) data.lastname = updatedUser.lastname;
      if (updatedUser.email) data.email = updatedUser.email;
      if (updatedUser.role) data.role = updatedUser.role;
      if (typeof updatedUser.isActive === 'boolean') data.isActive = updatedUser.isActive;

      const result = await updateUser(updatedUser._id || updatedUser.id, data);

      setUsers(users.map(user => 
        user._id === updatedUser._id ? result.data.user : user
      ));
      setEditingUser(null);
      alert('User updated successfully');
    } catch (error: unknown) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="mb-6 pt-4 pb-2">
            <TabsList
              className="flex w-full whitespace-nowrap gap-2 bg-gray-800 border-gray-700 rounded-lg p-1 overflow-x-auto justify-start lg:justify-center"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 px-4 py-2 rounded-lg font-semibold flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="games" className="data-[state=active]:bg-purple-600 px-4 py-2 rounded-lg font-semibold flex items-center">
                <Gamepad2 className="w-4 h-4 mr-2" /> Games
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 px-4 py-2 rounded-lg font-semibold flex items-center">
                <Users className="w-4 h-4 mr-2" /> Users
              </TabsTrigger>
              <TabsTrigger value="tokens" className="data-[state=active]:bg-purple-600 px-4 py-2 rounded-lg font-semibold flex items-center">
                <Package className="w-4 h-4 mr-2" /> Tokens
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-purple-600 px-4 py-2 rounded-lg font-semibold flex items-center">
                <CreditCard className="w-4 h-4 mr-2" /> Payments
              </TabsTrigger>
            </TabsList>
            <style>{`
              .overflow-x-auto::-webkit-scrollbar { display: none; }
              .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Games</CardTitle>
                  <Gamepad2 className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalGames}</div>
                  <p className="text-xs text-gray-400">
                    {stats.activeGames} active, {stats.featuredGames} featured
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                  <p className="text-xs text-gray-400">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</div>
                  <p className="text-xs text-gray-400">
                    {stats.totalPayments} transactions
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Active Payments</CardTitle>
                  <Activity className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalPayments}</div>
                  <p className="text-xs text-gray-400">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {games.slice(0, 5).map((game) => (
                      <div key={game._id} className="flex items-center space-x-4">
                        <Image
                          src={game.image || "/placeholder.svg"}
                          alt={game.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{game.name}</p>
                          <p className="text-gray-400 text-sm">{game.category}</p>
                        </div>
                        <Badge variant={game.status === "active" ? "default" : "secondary"}>
                          {game.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment._id} className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{payment.metadata.gameName}</p>
                          <p className="text-gray-400 text-sm">{payment.metadata.userFirstname} {payment.metadata.userLastname}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{formatCurrency(payment.amount)}</p>
                          <Badge variant={payment.status === "succeeded" ? "default" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Game Management</h2>
              <Button size="sm" onClick={() => router.push('/admin/games/create')} className="bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-sm">
                <Plus className="w-4 h-4 mr-2" /> Create Game
              </Button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search games by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <span className="ml-2 text-gray-300">Loading games...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Game</TableHead>
                        <TableHead className="text-gray-300">Category</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Featured</TableHead>
                        <TableHead className="text-gray-300">Locations</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGames.map((game) => (
                        <TableRow key={game._id} className="border-gray-700">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Image
                                src={game.image || "/placeholder.svg"}
                                alt={game.name}
                                width={40}
                                height={40}
                                  className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <p className="text-white font-medium">{game.name}</p>
                                <p className="text-gray-400 text-sm">{game.description.substring(0, 50)}...</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-purple-600 text-purple-400">
                              {game.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={game.status === "active" ? "default" : "secondary"}>
                              {game.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={game.featured ? "default" : "outline"}>
                              {game.featured ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-300">
                              {game.locations.length} locations
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => router.push(`/admin/games/${game._id}/edit`)}
                                className="border-gray-600 bg-transparent"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDelete(game._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
            </div>

            {/* User Filters */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label className="text-gray-400">Search</Label>
                    <Input
                      placeholder="Search users..."
                      value={userFilters.search}
                      onChange={(e) => setUserFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400">Role</Label>
                                            <Select value={userFilters.role} onValueChange={(value) => setUserFilters(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="All roles" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All roles</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="cashierCedar">Cedar Park Cashier</SelectItem>
                            <SelectItem value="cashierLiberty">Liberty Hill Cashier</SelectItem>
                          </SelectContent>
                        </Select>
                  </div>
                  <div>
                    <Label className="text-gray-400">Status</Label>
                    <Select value={userFilters.status} onValueChange={(value) => setUserFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="All status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-400">Sort By</Label>
                    <Select value={userFilters.sortBy} onValueChange={(value) => setUserFilters(prev => ({ ...prev, sortBy: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Join Date</SelectItem>
                        <SelectItem value="firstname">First Name</SelectItem>
                        <SelectItem value="lastname">Last Name</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="lastLogin">Last Login</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-400">Order</Label>
                    <Button
                      variant="outline"
                      onClick={() => setUserFilters(prev => ({ 
                        ...prev, 
                        sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                      }))}
                      className="w-full bg-gray-700 border-gray-600 text-white"
                    >
                      {userFilters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Role</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Total Tokens</TableHead>
                      <TableHead className="text-gray-300">Join Date</TableHead>
                      <TableHead className="text-gray-300">Last Login</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter(user => {
                        const matchesSearch = !userFilters.search || 
                                          user.firstname.toLowerCase().includes(userFilters.search.toLowerCase()) ||
                user.lastname.toLowerCase().includes(userFilters.search.toLowerCase()) ||
                user.email.toLowerCase().includes(userFilters.search.toLowerCase())
                        const matchesRole = userFilters.role === 'all' || !userFilters.role || user.role === userFilters.role
                        const matchesStatus = userFilters.status === 'all' || !userFilters.status || 
                          (userFilters.status === 'active' && user.isActive !== false) ||
                          (userFilters.status === 'inactive' && user.isActive === false)
                        return matchesSearch && matchesRole && matchesStatus
                      })
                      .sort((a, b) => {
                        const aValue = a[userFilters.sortBy as keyof User] || ''
                        const bValue = b[userFilters.sortBy as keyof User] || ''
                        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
                        return userFilters.sortOrder === 'asc' ? comparison : -comparison
                      })
                      .map((user) => {
                        const userBalances = userTokenBalances[user._id || user.id] || []
                        const totalTokens = userBalances.reduce((sum, balance) => sum + balance.tokens, 0)
                        
                        return (
                          <TableRow key={user._id || user.id} className="border-gray-700">
                            <TableCell>
                              <div>
                                <p className="text-white font-medium">{user.firstname} {user.lastname}</p>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.isActive !== false ? "default" : "destructive"}>
                                {user.isActive !== false ? "Active" : "Blocked"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-purple-400 font-bold">{totalTokens}</div>
                              <div className="text-gray-400 text-xs">
                                {userBalances.length} game{userBalances.length !== 1 ? 's' : ''}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-gray-300">{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-gray-300">
                                {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEditUser(user)}
                                  className="border-blue-600 text-blue-400 bg-transparent hover:bg-blue-600 hover:text-white"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleBlockUser(user._id || user.id)}
                                  className={`border-orange-600 text-orange-400 bg-transparent hover:bg-orange-600 hover:text-white`}
                                >
                                  <Ban className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => setSelectedUser(user)}
                                  className="border-gray-600 bg-transparent"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleDeleteUser(user._id || user.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
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

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Payment Analytics</h2>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Game</TableHead>
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment._id} className="border-gray-700">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Image
                              src={payment.game.image || "/placeholder.svg"}
                              alt={payment.game.name}
                              width={40}
                              height={40}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-white font-medium">{payment.game.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{payment.metadata.userFirstname} {payment.metadata.userLastname}</p>
                            <p className="text-gray-400 text-sm">{payment.metadata.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-green-400 font-medium">
                            {formatCurrency(payment.amount)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={payment.status === "succeeded" ? "default" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-300">{formatDate(payment.createdAt)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-gray-600 bg-transparent"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tokens Tab */}
          <TabsContent value="tokens" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Token Management</h2>
            </div>

            {/* Token Filters */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label className="text-gray-400">Search User</Label>
                    <Input
                      placeholder="Search by name..."
                      value={tokenFilters.search}
                      onChange={(e) => setTokenFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400">Location</Label>
                    <Select value={tokenFilters.location} onValueChange={(value) => setTokenFilters(prev => ({ ...prev, location: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All locations</SelectItem>
                        <SelectItem value="Cedar Park">Cedar Park</SelectItem>
                        <SelectItem value="Liberty Hill">Liberty Hill</SelectItem>
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
                    {Object.entries(userTokenBalances)
                      .flatMap(([userId, balances]) => 
                        balances.map(balance => ({ userId, balance }))
                      )
                      .filter(({ userId, balance }) => {
                        const user = users.find(u => u._id === userId || u.id === userId)
                        
                        const matchesSearch = !tokenFilters.search || 
                          (user && `${user.firstname} ${user.lastname}`.toLowerCase().includes(tokenFilters.search.toLowerCase()))
                        const matchesLocation = tokenFilters.location === 'all' || !tokenFilters.location || balance.location === tokenFilters.location
                        const matchesGame = tokenFilters.game === 'all' || !tokenFilters.game || balance.game._id === tokenFilters.game
                        
                        return matchesSearch && matchesLocation && matchesGame
                      })
                      .sort((a, b) => {
                        let aValue: string | number | Date, bValue: string | number | Date
                        
                        switch (tokenFilters.sortBy) {
                          case 'user':
                            const userA = users.find(u => u._id === a.userId || u.id === a.userId)
                            const userB = users.find(u => u._id === b.userId || u.id === b.userId)
                            aValue = userA?.firstname + ' ' + userA?.lastname || ''
                            bValue = userB?.firstname + ' ' + userB?.lastname || ''
                            break
                          case 'game':
                            aValue = a.balance.game.name
                            bValue = b.balance.game.name
                            break
                          case 'location':
                            aValue = a.balance.location
                            bValue = b.balance.location
                            break
                          case 'tokens':
                            aValue = a.balance.tokens
                            bValue = b.balance.tokens
                            break
                          case 'updatedAt':
                            aValue = new Date(a.balance.updatedAt)
                            bValue = new Date(b.balance.updatedAt)
                            break
                          default:
                            aValue = ''
                            bValue = ''
                        }
                        
                        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
                        return tokenFilters.sortOrder === 'asc' ? comparison : -comparison
                      })
                      .map(({ userId, balance }) => {
                        const user = users.find(u => u._id === userId || u.id === userId)
                        const game = games.find(g => g._id === balance.game._id)
                        
                        return (
                          <TableRow key={`${userId}-${balance.game._id}-${balance.location}`} className="border-gray-700">
                            <TableCell>
                              <div>
                                <p className="text-white font-medium">{user?.firstname + ' ' + user?.lastname || 'Unknown User'}</p>
                                <p className="text-gray-400 text-sm">{user?.email || 'N/A'}</p>
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
                                {pendingTokenChanges[`${userId}-${balance.game._id}-${balance.location}`] ?? balance.tokens}
                              </div>
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
                                    const key = `${userId}-${balance.game._id}-${balance.location}`;
                                    const currentValue = pendingTokenChanges[key] ?? balance.tokens;
                                    const newValue = Math.max(0, currentValue - 5);
                                    setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                    handleTokenAdjustment(userId, balance.game._id, balance.location, newValue - balance.tokens);
                                  }}
                                  disabled={(pendingTokenChanges[`${userId}-${balance.game._id}-${balance.location}`] ?? balance.tokens) < 5}
                                  className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <Input
                                  type="number"
                                  min="0"
                                  value={pendingTokenChanges[`${userId}-${balance.game._id}-${balance.location}`] ?? balance.tokens}
                                  onChange={e => {
                                    const key = `${userId}-${balance.game._id}-${balance.location}`;
                                    const newValue = Math.max(0, parseInt(e.target.value) || 0);
                                    setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                    handleTokenAdjustment(userId, balance.game._id, balance.location, newValue - balance.tokens);
                                  }}
                                  className="w-20 text-center bg-gray-700 border-gray-600 text-white"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const key = `${userId}-${balance.game._id}-${balance.location}`;
                                    const currentValue = pendingTokenChanges[key] ?? balance.tokens;
                                    const newValue = currentValue + 5;
                                    setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                    handleTokenAdjustment(userId, balance.game._id, balance.location, 5);
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
        </Tabs>

        {/* User Details Modal */}
        {selectedUser && (
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">User Details - {selectedUser.firstname} {selectedUser.lastname}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-400">Full Name</Label>
                    <div className="text-white font-medium">{selectedUser.firstname} {selectedUser.lastname}</div>
                  </div>
                  <div>
                    <Label className="text-gray-400">Email</Label>
                    <div className="text-white font-medium">{selectedUser.email}</div>
                  </div>
                  <div>
                    <Label className="text-gray-400">Role</Label>
                    <Badge variant={selectedUser.role === "admin" ? "default" : "secondary"}>
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-400">Join Date</Label>
                    <div className="text-white font-medium">{selectedUser.createdAt ? formatDate(selectedUser.createdAt) : 'N/A'}</div>
                  </div>
                  <div>
                    <Label className="text-gray-400">Last Login</Label>
                    <div className="text-white font-medium">
                      {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Token Adjustment Modal */}
        {tokenAdjustmentModal && (
          <Dialog open={!!tokenAdjustmentModal} onOpenChange={() => setTokenAdjustmentModal(null)}>
            <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Manage Tokens - {tokenAdjustmentModal.user.firstname} {tokenAdjustmentModal.user.lastname}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {tokenAdjustmentModal.balances.length > 0 ? (
                  <div className="grid gap-6">
                    {tokenAdjustmentModal.balances.map((balance) => {
                      const key = `${tokenAdjustmentModal.user._id || tokenAdjustmentModal.user.id}-${balance.game._id}-${balance.location}`;
                      const currentValue = pendingTokenChanges[key] ?? balance.tokens;
                      
                      return (
                        <Card key={balance._id} className="bg-gray-800 border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-white text-lg">{balance.game.name}</CardTitle>
                            <p className="text-gray-400 text-sm">Location: {balance.location}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-purple-400 font-medium">Current Tokens</Label>
                                <div className="text-2xl font-bold text-purple-400">{balance.tokens}</div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newValue = Math.max(0, currentValue - 5);
                                    setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                    handleTokenAdjustment(tokenAdjustmentModal.user._id || tokenAdjustmentModal.user.id, balance.game._id, balance.location, newValue - balance.tokens);
                                  }}
                                  disabled={currentValue < 5}
                                  className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                
                                <div className="flex-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    value={currentValue}
                                    onChange={(e) => {
                                      const newValue = Math.max(0, parseInt(e.target.value) || 0);
                                      setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                      handleTokenAdjustment(tokenAdjustmentModal.user._id || tokenAdjustmentModal.user.id, balance.game._id, balance.location, newValue - balance.tokens);
                                    }}
                                    className="text-center bg-gray-700 border-gray-600 text-white"
                                  />
                                </div>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newValue = currentValue + 5;
                                    setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                    handleTokenAdjustment(tokenAdjustmentModal.user._id || tokenAdjustmentModal.user.id, balance.game._id, balance.location, 5);
                                  }}
                                  className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newValue = currentValue + 10;
                                    setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                    handleTokenAdjustment(tokenAdjustmentModal.user._id || tokenAdjustmentModal.user.id, balance.game._id, balance.location, 10);
                                  }}
                                  className="bg-purple-900/30 border-purple-600 text-purple-400 hover:bg-purple-800/50"
                                >
                                  +10
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newValue = Math.max(0, currentValue - 10);
                                    setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                    handleTokenAdjustment(tokenAdjustmentModal.user._id || tokenAdjustmentModal.user.id, balance.game._id, balance.location, newValue - balance.tokens);
                                  }}
                                  disabled={currentValue < 10}
                                  className="bg-red-900/30 border-red-600 text-red-400 hover:bg-red-800/50"
                                >
                                  -10
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No tokens found for this user</p>
                    <p className="text-sm">This user hasn&apos;t purchased any tokens yet.</p>
                  </div>
                )}
                
                <div className="flex space-x-4 pt-4 border-t border-gray-700">
                  <Button 
                    onClick={() => setTokenAdjustmentModal(null)} 
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* User Edit Modal */}
        {editingUser && (
          <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
            <DialogContent className="max-w-md bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">Edit User - {editingUser.firstname} {editingUser.lastname}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-gray-400">First Name</Label>
                  <Input
                    value={editingUser.firstname}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, firstname: e.target.value } : null)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Last Name</Label>
                  <Input
                    value={editingUser.lastname}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, lastname: e.target.value } : null)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Email</Label>
                  <Input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Role</Label>
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, role: value as 'user' | 'admin' | 'cashierCedar' | 'cashierLiberty' } : null)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="cashierCedar">Cedar Park Cashier</SelectItem>
                      <SelectItem value="cashierLiberty">Liberty Hill Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-400">Status</Label>
                  <Select 
                    value={editingUser.isActive !== false ? 'active' : 'inactive'} 
                    onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, isActive: value === 'active' } : null)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-4 pt-4 border-t border-gray-700">
                  <Button 
                    onClick={() => editingUser && handleSaveUser(editingUser)} 
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingUser(null)}
                    className="border-gray-600 text-gray-300 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
