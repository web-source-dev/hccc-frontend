"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  DollarSign, 
  Gamepad2, 
  BarChart3,
  Activity,
  Package,
} from "lucide-react"
import { getGames, type Game } from '@/lib/games'
import { getUserStats, type User } from '@/lib/auth'
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

export default function AdminOverview() {
  const [games, setGames] = useState<Game[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalGames: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalPayments: 0,
    activeGames: 0,
    featuredGames: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOverviewData()
  }, [])

  const fetchOverviewData = async () => {
    setLoading(true)
    try {
      console.log('Fetching overview data...')
      
      // Fetch initial data (first page only)
      const gamesRes = await getGames({ limit: 5, page: 1 })
      const paymentsRes = await getAllPayments({ limit: 5, page: 1 })

      const gamesData = gamesRes.data.games
      const paymentsData = paymentsRes.data.payments

      setGames(gamesData)
      setPayments(paymentsData)

      // Fetch statistics
      const userStatsRes = await getUserStats()
      const paymentStatsRes = await getPaymentStats()

      // Calculate stats
      const activeGames = gamesData.filter(game => game.status === 'active').length
      const featuredGames = gamesData.filter(game => game.featured).length

      const statsData = {
        totalGames: userStatsRes.data.totalUsers > 0 ? userStatsRes.data.totalUsers : gamesData.length,
        totalUsers: userStatsRes.data.totalUsers,
        totalRevenue: paymentStatsRes.data.totalRevenue,
        totalPayments: paymentStatsRes.data.totalPayments,
        activeGames,
        featuredGames
      }
      
      setStats(statsData)
      console.log('Overview data fetch completed successfully')

    } catch (e) {
      console.error('Failed to fetch overview data:', e)
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <span className="ml-2 text-gray-300">Loading overview...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
                    <Badge className={getPaymentStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
