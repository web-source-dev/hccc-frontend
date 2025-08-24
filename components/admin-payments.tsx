"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  SortAsc,
  SortDesc,
} from "lucide-react"
import { getAllPayments, type Payment } from '@/lib/payments'
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

interface PaymentFilters {
  search: string;
  status: string;
  game: string;
  location: string;
  tokens: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const [filters, setFilters] = useState<PaymentFilters>({
    search: '',
    status: 'all',
    game: 'all',
    location: 'all',
    tokens: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      // Fetch payments and games
      const paymentsRes = await getAllPayments({ limit: pagination.limit, page: 1 })
      const gamesRes = await getGames({ limit: 100, page: 1 })
      
      setPayments(paymentsRes.data.payments)
      setGames(gamesRes.data.games)
      setPagination(prev => ({ ...prev, total: paymentsRes.data.pagination.total }))
    } catch (error) {
      console.error('Failed to fetch payments data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentsData = async (page: number) => {
    setLoading(true)
    try {
      const paymentsRes = await getAllPayments({ limit: pagination.limit, page })
      setPayments(paymentsRes.data.payments)
      setPagination(prev => ({ ...prev, total: paymentsRes.data.pagination.total }))
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (page: number) => {
    setPagination(prev => ({ ...prev, page }))
    await fetchPaymentsData(page)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-600 text-white'
      case 'processing':
        return 'bg-blue-600 text-white'
      case 'pending':
        return 'bg-yellow-600 text-white'
      case 'failed':
        return 'bg-red-400 text-white'
      case 'canceled':
        return 'bg-gray-400 text-white'
      case 'expired':
        return 'bg-orange-600 text-white'
      case 'incomplete':
        return 'bg-purple-600 text-white'
      case 'refunded':
        return 'bg-gray-600 text-white'
      case 'blocked':
        return 'bg-red-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const filteredPayments = payments
    .filter(payment => {
      const matchesSearch = !filters.search || 
        payment.metadata.gameName.toLowerCase().includes(filters.search.toLowerCase()) ||
        `${payment.metadata.userFirstname} ${payment.metadata.userLastname}`.toLowerCase().includes(filters.search.toLowerCase()) ||
        payment.metadata.userEmail.toLowerCase().includes(filters.search.toLowerCase())
      const matchesStatus = filters.status === 'all' || !filters.status || payment.status === filters.status
      const matchesGame = filters.game === 'all' || !filters.game || payment.game._id === filters.game
      const matchesLocation = filters.location === 'all' || !filters.location || payment.location === filters.location
      const matchesTokens = filters.tokens === 'all' || !filters.tokens || 
        (filters.tokens === '0-100' && payment.tokenPackage.tokens <= 100) ||
        (filters.tokens === '100-500' && payment.tokenPackage.tokens > 100 && payment.tokenPackage.tokens <= 500) ||
        (filters.tokens === '500-1000' && payment.tokenPackage.tokens > 500 && payment.tokenPackage.tokens <= 1000) ||
        (filters.tokens === '1000+' && payment.tokenPackage.tokens > 1000)
      return matchesSearch && matchesStatus && matchesGame && matchesLocation && matchesTokens
    })
    .sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date
      
      switch (filters.sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'tokens':
          aValue = a.tokenPackage.tokens
          bValue = b.tokenPackage.tokens
          break
        case 'game':
          aValue = a.game.name
          bValue = b.game.name
          break
        case 'user':
          aValue = `${a.metadata.userFirstname} ${a.metadata.userLastname}`
          bValue = `${b.metadata.userFirstname} ${b.metadata.userLastname}`
          break
        case 'location':
          aValue = a.location
          bValue = b.location
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = ''
          bValue = ''
      }
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Analytics</h2>
      </div>

      {/* Payment Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label className="text-gray-400">Search</Label>
              <Input
                placeholder="Search payments..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-400">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="succeeded">Succeeded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-400">Game</Label>
              <Select value={filters.game} onValueChange={(value) => setFilters(prev => ({ ...prev, game: value }))}>
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
              <Label className="text-gray-400">Location</Label>
              <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
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
              <Label className="text-gray-400">Tokens</Label>
              <Select value={filters.tokens} onValueChange={(value) => setFilters(prev => ({ ...prev, tokens: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All tokens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tokens</SelectItem>
                  <SelectItem value="0-100">0-100</SelectItem>
                  <SelectItem value="100-500">100-500</SelectItem>
                  <SelectItem value="500-1000">500-1000</SelectItem>
                  <SelectItem value="1000+">1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-400">Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="tokens">Tokens</SelectItem>
                  <SelectItem value="game">Game</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-400">Order</Label>
              <Button
                variant="outline"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                }))}
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-2 text-gray-300">Loading payments...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Game</TableHead>
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Location</TableHead>
                  <TableHead className="text-gray-300">Tokens</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
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
                      <Badge variant="outline" className="border-blue-600 text-blue-400">
                        {payment.location}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-purple-400 font-bold text-lg">
                        {payment.tokenPackage.tokens}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-green-400 font-medium">
                        {formatCurrency(payment.amount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-300">{formatDate(payment.createdAt)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Pagination 
        currentPage={pagination.page} 
        totalPages={Math.ceil(pagination.total / pagination.limit)} 
        onPageChange={handlePageChange} 
        totalItems={pagination.total} 
      />
    </div>
  )
}
