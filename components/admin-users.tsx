"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Edit, 
  Trash2, 
  Eye, 
  Ban,
  SortAsc,
  SortDesc,
  Users,
} from "lucide-react"
import { getAllUsers, deleteUser, blockUser, updateUser, type User } from '@/lib/auth'

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

interface UserFilters {
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  useEffect(() => {
    fetchUsersData(1)
  }, [])

  const fetchUsersData = async (page: number) => {
    setLoading(true)
    try {
      const usersRes = await getAllUsers({ limit: pagination.limit, page })
      setUsers(usersRes.data.users)
      setPagination(prev => ({ ...prev, total: usersRes.data.pagination.total }))
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
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
        (user._id === updatedUser._id || user.id === updatedUser._id) ? result.data.user : user
      ))
      setEditingUser(null)
      alert('User updated successfully')
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('Failed to update user')
    }
  }

  const handlePageChange = async (page: number) => {
    setPagination(prev => ({ ...prev, page }))
    await fetchUsersData(page)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = !filters.search || 
        user.firstname.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.lastname.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      const matchesRole = filters.role === 'all' || !filters.role || user.role === filters.role
      const matchesStatus = filters.status === 'all' || !filters.status || 
        (filters.status === 'active' && user.isActive !== false) ||
        (filters.status === 'inactive' && user.isActive === false)
      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[filters.sortBy as keyof User] || ''
      const bValue = b[filters.sortBy as keyof User] || ''
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

  return (
    <div className="space-y-6">
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
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-400">Role</Label>
              <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
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
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
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
              <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-300">Loading users...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Join Date</TableHead>
                  <TableHead className="text-gray-300">Last Login</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
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
  )
}
