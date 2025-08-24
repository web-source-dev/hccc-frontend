"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3,
  Gamepad2,
  Users,
  Package,
  CreditCard,
  Calendar,
  Trophy,
} from "lucide-react"
import EventsManagement from '@/components/events-management'
import WinnersManagement from '@/components/winners-management'
import AdminOverview from '@/components/admin-overview'
import AdminGames from '@/components/admin-games'
import AdminUsers from '@/components/admin-users'
import AdminTokens from '@/components/admin-tokens'
import AdminPayments from '@/components/admin-payments'

export default function AdminPage() {
  const [authError, setAuthError] = useState<string | null>(null)

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

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Authentication Error</div>
          <p className="text-white">{authError}</p>
        </div>
      </div>
    )
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
              <TabsTrigger value="events" className="data-[state=active]:bg-purple-600 px-4 py-2 rounded-lg font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-2" /> Events
              </TabsTrigger>
              <TabsTrigger value="winners" className="data-[state=active]:bg-purple-600 px-4 py-2 rounded-lg font-semibold flex items-center">
                <Trophy className="w-4 h-4 mr-2" /> Winners
              </TabsTrigger>
            </TabsList>
            <style>{`
              .overflow-x-auto::-webkit-scrollbar { display: none; }
              .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <AdminOverview />
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <AdminGames />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <AdminUsers />
          </TabsContent>

          {/* Tokens Tab */}
          <TabsContent value="tokens" className="space-y-6">
            <AdminTokens />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <AdminPayments />
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <EventsManagement />
          </TabsContent>

          {/* Winners Tab */}
          <TabsContent value="winners" className="space-y-6">
            <WinnersManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
