"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Gamepad2,
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { getGames, deleteGame, type Game } from '@/lib/games'
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

export default function AdminGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  
  const router = useRouter()

  useEffect(() => {
    fetchGamesData(1)
  }, [])

  const fetchGamesData = async (page: number) => {
    setLoading(true)
    try {
      const gamesRes = await getGames({ limit: pagination.limit, page })
      setGames(gamesRes.data.games)
      setPagination(prev => ({ ...prev, total: gamesRes.data.pagination.total }))
    } catch (error) {
      console.error('Failed to fetch games:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      setLoading(true)
      try {
        await deleteGame(id)
        setGames(games.filter(game => game._id !== id))
        // Refresh data
        await fetchGamesData(pagination.page)
      } catch (e) {
        console.error('Failed to delete game:', e)
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePageChange = async (page: number) => {
    setPagination(prev => ({ ...prev, page }))
    await fetchGamesData(page)
  }

  const filteredGames = games.filter(
    (game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
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
      
      <Pagination 
        currentPage={pagination.page} 
        totalPages={Math.ceil(pagination.total / pagination.limit)} 
        onPageChange={handlePageChange} 
        totalItems={pagination.total} 
      />
    </div>
  )
}
