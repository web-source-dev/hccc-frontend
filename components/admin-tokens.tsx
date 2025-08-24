"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Minus,
  Package,
  SortAsc,
  SortDesc,
} from "lucide-react"
import { getAdminTokenBalances, adjustUserTokenBalance, type User } from '@/lib/auth'
import { getGames, type Game } from '@/lib/games'
import Image from "next/image"

// Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
  totalItems: number;
}) => {
  const pages = []
  const maxVisiblePages = 5
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-t border-gray-700">
      <div className="text-sm text-gray-400">
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-700 border-gray-600 text-white"
        >
          Previous
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="bg-gray-700 border-gray-600 text-white"
            >
              1
            </Button>
            {startPage > 2 && <span className="text-gray-400">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={page === currentPage ? "bg-blue-600" : "bg-gray-700 border-gray-600 text-white"}
          >
            {page}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="bg-gray-700 border-gray-600 text-white"
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-700 border-gray-600 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

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

interface TokenFilters {
  search: string;
  location: string;
  game: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function AdminTokens() {
  const [games, setGames] = useState<Game[]>([])
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [pendingTokenChanges, setPendingTokenChanges] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 0 })
  const [filters, setFilters] = useState<TokenFilters>({
    search: '',
    location: 'all',
    game: 'all',
    sortBy: 'user',
    sortOrder: 'asc'
  })

  // Fetch games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getGames()
        setGames(response.data.games)
      } catch (error) {
        console.error('Failed to fetch games:', error)
      }
    }

    fetchGames()
  }, [])

  // Fetch token balances when filters or pagination changes
  useEffect(() => {
    const fetchTokenBalances = async () => {
      setLoading(true)
      try {
        const params: any = {
          page: pagination.page,
          limit: pagination.limit
        }
        
        if (filters.search) params.search = filters.search
        if (filters.location !== 'all') params.location = filters.location
        if (filters.game !== 'all') params.game = filters.game

        const response = await getAdminTokenBalances(params)
        setTokenBalances(response.data.balances)
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }))
      } catch (error) {
        console.error('Failed to fetch token balances:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokenBalances()
  }, [pagination.page, filters.search, filters.location, filters.game])

  // Compute filtered and sorted token balances
  const filteredTokenBalances = useMemo(() => {
    let filtered = [...tokenBalances]

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (filters.sortBy) {
        case 'user':
          aValue = `${a.user.firstname} ${a.user.lastname}`.toLowerCase()
          bValue = `${b.user.firstname} ${b.user.lastname}`.toLowerCase()
          break
        case 'game':
          aValue = a.game.name.toLowerCase()
          bValue = b.game.name.toLowerCase()
          break
        case 'location':
          aValue = a.location.toLowerCase()
          bValue = b.location.toLowerCase()
          break
        case 'tokens':
          aValue = a.tokens
          bValue = b.tokens
          break
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime()
          bValue = new Date(b.updatedAt).getTime()
          break
        default:
          aValue = `${a.user.firstname} ${a.user.lastname}`.toLowerCase()
          bValue = `${b.user.firstname} ${b.user.lastname}`.toLowerCase()
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [tokenBalances, filters.sortBy, filters.sortOrder])

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof TokenFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page when filters change
  }

  const handleTokenAdjustment = async (userId: string, gameId: string, location: string, delta: number) => {
    try {
      await adjustUserTokenBalance(userId, gameId, location, delta)
      
      // Update local state
      setTokenBalances(prev => 
        prev.map(balance => {
          if (balance.user._id === userId && balance.game._id === gameId && balance.location === location) {
            return {
              ...balance,
              tokens: Math.max(0, balance.tokens + delta)
            }
          }
          return balance
        })
      )
    } catch (error) {
      console.error('Failed to adjust token balance:', error)
      alert('Failed to adjust token balance')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Token Management</h2>
      </div>

      {/* Token Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Label className="text-gray-400">Search User</Label>
              <Input
                placeholder="Search by name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-400">Location</Label>
              <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
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
              <Select value={filters.game} onValueChange={(value) => handleFilterChange('game', value)}>
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
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
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
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full bg-gray-700 border-gray-600 text-white"
              >
                {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-2 text-gray-300">Loading token balances...</span>
            </div>
          ) : (
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
                {filteredTokenBalances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      No token balances found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTokenBalances.map((balance) => {
                    const game = games.find(g => g._id === balance.game._id)
                    
                    return (
                      <TableRow key={balance._id} className="border-gray-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{balance.user.firstname + ' ' + balance.user.lastname}</p>
                            <p className="text-gray-400 text-sm">{balance.user.email || 'N/A'}</p>
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
                          <div className="font-bold text-lg text-purple-400">
                            {pendingTokenChanges[`${balance.user._id}-${balance.game._id}-${balance.location}`] ?? balance.tokens}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-300">
                            {formatDate(balance.updatedAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const key = `${balance.user._id}-${balance.game._id}-${balance.location}`;
                                const currentValue = pendingTokenChanges[key] ?? balance.tokens;
                                const newValue = Math.max(0, currentValue - 5);
                                setPendingTokenChanges(prev => ({ ...prev, [key]: newValue }));
                                handleTokenAdjustment(balance.user._id, balance.game._id, balance.location, newValue - balance.tokens);
                              }}
                              disabled={(pendingTokenChanges[`${balance.user._id}-${balance.game._id}-${balance.location}`] ?? balance.tokens) < 5}
                              className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              min="0"
                              value={pendingTokenChanges[`${balance.user._id}-${balance.game._id}-${balance.location}`] ?? balance.tokens}
                              onChange={e => {
                                const key = `${balance.user._id}-${balance.game._id}-${balance.location}`;
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
                                const key = `${balance.user._id}-${balance.game._id}-${balance.location}`;
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
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Pagination 
        currentPage={pagination.page} 
        totalPages={pagination.pages} 
        onPageChange={handlePageChange} 
        totalItems={pagination.total} 
      />
    </div>
  )
}
