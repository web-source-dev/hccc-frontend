"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  Trophy, 
  Heart, 
  Package, 
  DollarSign, 
  Gamepad2,
  MapPin,
  RotateCcw,
  Edit,
  Camera,
  Clock,
  Activity,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { getCurrentUser, getUserTokenBalances, setRedirectUrl } from "@/lib/auth"
import { getUserPayments, type Payment } from "@/lib/payments"
import { getGames, type Game } from "@/lib/games"
import type { User } from "@/lib/auth"
import Link from "next/link"
import Image from "next/image"

interface UserStats {
  totalTokens: number;
  totalSpent: number;
  totalPurchases: number;
  successfulPurchases: number;
  memberSince: string;
  achievementsUnlocked: number;
  totalAchievements: number;
  favoriteCategory: string;
  gamesOwned: number;
}

interface GameTokenData {
  gameId: string;
  gameName: string;
  gameImage: string;
  category: string;
  totalTokens: number;
  totalSpent: number;
  purchases: number;
  lastPurchase: string | null;
  progress: number;
  nextMilestone: number;
  locationName: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  unlocked: boolean;
  date: string | null;
  progress: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

// Token balance interface
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

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const searchParams = useSearchParams()

  // Set active tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['overview', 'tokens', 'history', 'achievements'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Calculate user statistics
  const calculateUserStats = (): UserStats => {
    const successfulPayments = payments.filter(p => p.status === 'succeeded')
    const totalSpent = successfulPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalTokens = tokenBalances.reduce((sum, balance) => sum + balance.tokens, 0)
    const uniqueGames = new Set(tokenBalances.map(b => b.game._id)).size
    
    // Calculate favorite category from token balances
    const categoryCounts: { [key: string]: number } = {}
    tokenBalances.forEach(balance => {
      const game = games.find(g => g._id === balance.game._id)
      if (game) {
        categoryCounts[game.category] = (categoryCounts[game.category] || 0) + balance.tokens
      }
    })
    const favoriteCategory = Object.keys(categoryCounts).length > 0 
      ? Object.entries(categoryCounts).sort(([,a], [,b]) => b - a)[0][0]
      : 'None'

    // Calculate achievements
    const achievements = calculateAchievements()
    const unlockedAchievements = achievements.filter(a => a.unlocked)

    return {
      totalTokens,
      totalSpent,
      totalPurchases: payments.length,
      successfulPurchases: successfulPayments.length,
      memberSince: user?.createdAt || new Date().toISOString(),
      achievementsUnlocked: unlockedAchievements.length,
      totalAchievements: achievements.length,
      favoriteCategory,
      gamesOwned: uniqueGames,
    }
  }

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load user data
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          // Store current URL for redirect after login
          const currentUrl = window.location.href;
          setRedirectUrl(currentUrl);
          window.location.href = '/login'
          return
        }
        setUser(currentUser)
        setUserName(currentUser.username)
        setUserEmail(currentUser.email)

        // Load payments, games, and token balances in parallel
        const [paymentsData, gamesData, tokenBalancesData] = await Promise.all([
          getUserPayments(),
          getGames(),
          getUserTokenBalances()
        ])

        setPayments(paymentsData.data.payments)
        setGames(gamesData.data.games)
        setTokenBalances(tokenBalancesData.data.balances)
      } catch (error) {
        console.error('Error loading profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate game token data using actual token balances
  const calculateGameTokenData = (): GameTokenData[] => {
    const gameData: { [key: string]: GameTokenData } = {}

    // Process token balances
    tokenBalances.forEach(balance => {
      const game = games.find(g => g._id === balance.game._id)
      if (!game) return

      const key = `${balance.game._id}-${balance.location}`
      if (!gameData[key]) {
        gameData[key] = {
          gameId: balance.game._id,
          gameName: balance.game.name,
          gameImage: game.image,
          category: game.category,
          totalTokens: 0,
          totalSpent: 0,
          purchases: 0,
          lastPurchase: null,
          progress: 0,
          nextMilestone: 25, // Default milestone
          locationName: balance.location,
        }
      }

      gameData[key].totalTokens = balance.tokens
    })

    // Add payment data for spending and purchase history
    const successfulPayments = payments.filter(p => p.status === 'succeeded')
    successfulPayments.forEach(payment => {
      const key = `${payment.game._id}-${payment.location}`
      if (gameData[key]) {
        gameData[key].totalSpent += payment.amount
        gameData[key].purchases += 1
        
        const purchaseDate = new Date(payment.createdAt)
        if (!gameData[key].lastPurchase || 
            purchaseDate > new Date(gameData[key].lastPurchase!)) {
          gameData[key].lastPurchase = payment.createdAt
        }
      }
    })

    // Calculate progress for each game
    Object.values(gameData).forEach(game => {
      game.progress = Math.min((game.totalTokens / game.nextMilestone) * 100, 100)
    })

    return Object.values(gameData)
  }

  // Calculate achievements
  const calculateAchievements = (): Achievement[] => {
    const successfulPayments = payments.filter(p => p.status === 'succeeded')
    const totalSpent = successfulPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalTokens = tokenBalances.reduce((sum, balance) => sum + balance.tokens, 0)
    const uniqueGames = new Set(tokenBalances.map(b => b.game._id)).size
    const firstPurchase = successfulPayments.length > 0 ? successfulPayments[successfulPayments.length - 1] : null

    return [
      {
        id: "first-purchase",
        title: "First Purchase",
        description: "Made your first token purchase",
        icon: Trophy,
        color: "from-yellow-500 to-orange-500",
        unlocked: successfulPayments.length > 0,
        date: firstPurchase ? new Date(firstPurchase.createdAt).toLocaleDateString() : null,
        progress: successfulPayments.length > 0 ? 100 : 0,
      },
      {
        id: "loyal-player",
        title: "Loyal Player",
        description: "Purchased tokens for 3 different games",
        icon: Heart,
        color: "from-red-500 to-pink-500",
        unlocked: uniqueGames >= 3,
        date: uniqueGames >= 3 ? "Achieved" : null,
        progress: Math.min((uniqueGames / 3) * 100, 100),
      },
      {
        id: "token-collector",
        title: "Token Collector",
        description: "Own 50+ tokens across all games",
        icon: Package,
        color: "from-purple-500 to-indigo-500",
        unlocked: totalTokens >= 50,
        date: totalTokens >= 50 ? "Achieved" : null,
        progress: Math.min((totalTokens / 50) * 100, 100),
      },
      {
        id: "big-spender",
        title: "Big Spender",
        description: "Spent $100+ on tokens",
        icon: DollarSign,
        color: "from-green-500 to-emerald-500",
        unlocked: totalSpent >= 100,
        date: totalSpent >= 100 ? "Achieved" : null,
        progress: Math.min((totalSpent / 100) * 100, 100),
      },
      ]
  }

  // Calculate recent activity
  const calculateRecentActivity = (): RecentActivity[] => {
    const successfulPayments = payments.filter(p => p.status === 'succeeded')
    const activities: RecentActivity[] = []

    // Add recent purchases
    successfulPayments.slice(0, 5).forEach((payment) => {
      const game = games.find(g => g._id === payment.game._id)
      if (!game) return

      const timeAgo = getTimeAgo(new Date(payment.createdAt))
      activities.push({
        id: `purchase-${payment._id}`,
        type: "purchase",
        title: `Purchased ${game.name} tokens`,
        description: `${payment.tokenPackage.tokens} tokens for $${payment.amount.toFixed(2)}`,
        time: timeAgo,
        icon: Package,
        color: "text-green-400",
      })
    })

    // Add achievements
    const achievements = calculateAchievements()
    achievements.filter(a => a.unlocked).slice(0, 3).forEach((achievement) => {
      activities.push({
        id: `achievement-${achievement.id}`,
        type: "achievement",
        title: `Unlocked ${achievement.title} achievement`,
        description: achievement.description,
        time: "Recently",
        icon: Trophy,
        color: "text-yellow-400",
      })
    })

    return activities.sort(() => {
      // Sort by time (recent first)
      return 0 // For now, just return as is since we don't have exact timestamps for achievements
    }).slice(0, 5)
  }

  // Helper function to get time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return `${Math.floor(diffInSeconds / 2592000)} months ago`
  }

  const userStats = calculateUserStats()
  const gameTokenData = calculateGameTokenData()
  const achievements = calculateAchievements()
  const recentActivity = calculateRecentActivity()

  const handleAvatarUpload = () => {
    console.log("Avatar upload clicked")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p>Please log in to view your profile</p>
          <Link href="/login">
            <Button className="mt-4">Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-purple-600 group-hover:scale-105 transition-transform duration-300">
                <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                <AvatarFallback className="text-3xl bg-gradient-to-r from-purple-600 to-blue-600">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 hover:bg-purple-700"
                onClick={handleAvatarUpload}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="text-2xl font-bold bg-gray-800 border-gray-600"
                  />
                  <Input
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="text-gray-400 bg-gray-800 border-gray-600"
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => setIsEditing(false)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">{userName}</h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 text-gray-400 hover:text-white"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-gray-400 mb-2">{userEmail}</p>
                  <div className="flex items-center space-x-4">
                  
                    <span className="text-gray-400 text-sm">
                      Member since {userStats.memberSince ? new Date(userStats.memberSince).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tokens" className="data-[state=active]:bg-purple-600">
              My Tokens
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
              Purchase History
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{userStats.totalTokens}</div>
                  <div className="text-gray-400 text-sm">Total Tokens</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">${userStats.totalSpent.toFixed(2)}</div>
                  <div className="text-gray-400 text-sm">Total Spent</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{userStats.achievementsUnlocked}</div>
                  <div className="text-gray-400 text-sm">Achievements</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{userStats.gamesOwned}</div>
                  <div className="text-gray-400 text-sm">Games Owned</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                        <div className={`w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center`}>
                          <activity.icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{activity.title}</div>
                          <div className="text-gray-400 text-sm">{activity.description}</div>
                        </div>
                        <div className="text-gray-500 text-sm">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm">Start purchasing tokens to see your activity here!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Tokens Tab */}
          <TabsContent value="tokens" className="space-y-6">
            {gameTokenData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameTokenData.map((game) => (
                  <Card key={game.gameId} className="bg-gray-800 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Image
                          src={game.gameImage}
                          alt={game.gameName}
                          className="w-16 h-16 rounded-lg object-cover"
                          width={64}
                          height={64}
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{game.gameName}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {game.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-blue-600 text-white">
                              <MapPin className="w-3 h-3 mr-1" />
                              {game.locationName}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Tokens:</span>
                          <span className="text-white font-semibold">{game.totalTokens}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Spent:</span>
                          <span className="text-white font-semibold">${game.totalSpent.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Purchases:</span>
                          <span className="text-white font-semibold">{game.purchases}</span>
                        </div>
                        
                        {game.lastPurchase && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Last Purchase:</span>
                            <span className="text-gray-400">{new Date(game.lastPurchase).toLocaleDateString()}</span>
                          </div>
                        )}

                        {/* Reorder Button */}
                        <Link href={`/tokens/${game.gameName.toLowerCase().replace(/\s+/g, "-")}?location=${game.locationName?.toLowerCase().replace(/\s+/g, "-") || "cedar-park"}&gameId=${game.gameId}`}>
                          <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white">
                            <Package className="w-4 h-4 mr-2" />
                            Reorder Tokens
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No tokens yet</h3>
                <p className="mb-4">You haven&apos;t purchased any tokens yet.</p>
                <Link href="/">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Browse Games
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Purchase History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => {
                      const game = games.find(g => g._id === payment.game._id)
                      const statusColor = payment.status === 'succeeded' ? 'text-green-400' : 
                                        payment.status === 'pending' ? 'text-yellow-400' : 
                                        payment.status === 'failed' ? 'text-red-400' : 
                                        payment.status === 'canceled' ? 'text-gray-400' : 'text-green-400'

                      return (
                        <div key={payment._id} className="flex items-center justify-between p-4 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center`}>
                              {payment.status === 'succeeded' ? (
                                <CheckCircle className={`w-5 h-5 ${statusColor}`} />
                              ) : payment.status === 'pending' ? (
                                <Clock className={`w-5 h-5 ${statusColor}`} />
                              ) : payment.status === 'failed' ? (
                                <AlertCircle className={`w-5 h-5 ${statusColor}`} />
                              ) : payment.status === 'canceled' ? (
                                <RotateCcw className={`w-5 h-5 ${statusColor}`} />
                              ) : (
                                <CheckCircle className={`w-5 h-5 ${statusColor}`} />
                              )}
                            </div>
                            <div>
                              <div className="text-white font-medium">{game?.name || 'Unknown Game'}</div>
                              <div className="text-gray-400 text-sm">
                                {payment.tokenPackage.tokens} tokens • {payment.location}
                              </div>
                              <div className="text-gray-500 text-xs capitalize">{payment.status}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">${payment.amount.toFixed(2)}</div>
                            <div className="text-gray-400 text-sm">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {payment.stripePaymentIntentId.slice(-8)}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No purchase history</p>
                    <p className="text-sm">Your purchases will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`bg-gray-800 border-gray-700 transition-all duration-300 ${
                  achievement.unlocked ? 'hover:bg-gray-800/70' : 'opacity-60'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center ${
                        !achievement.unlocked && 'grayscale'
                      }`}>
                        <achievement.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{achievement.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>
                        
                        {achievement.unlocked ? (
                          <div className="flex items-center space-x-2 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Unlocked {achievement.date}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Progress:</span>
                              <span className="text-gray-400">{achievement.progress.toFixed(0)}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-2 bg-gray-700" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 