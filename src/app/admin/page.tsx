'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Activity, 
  Shield, 
  Settings, 
  Database, 
  Cpu, 
  HardDrive, 
  Network, 
  Lock, 
  Trash2, 
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
  isAdmin: boolean;
  createdAt: string;
  lastLogin: string;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
  };
  todoList: any[];
  history: any[];
  savedItems: any[];
  stats: {
    totalLogins: number;
    successfulLogins: number;
    failedLogins: number;
    lastSuccessfulLogin: string | null;
    lastLoginAttempt: string | null;
  };
  recentLoginAttempts: Array<{
    timestamp: string;
    ipAddress: string;
    userAgent: string;
    success: boolean;
  }>;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false
  });

  useEffect(() => {
    if (user?.isAdmin) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!selectedUser || !newPassword) return;
    
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      
      if (response.ok) {
        setNewPassword('');
        setIsPasswordDialogOpen(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh user list
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData)
      });
      
      if (response.ok) {
        setNewUserData({ name: '', email: '', password: '', isAdmin: false });
        setIsAddUserDialogOpen(false);
        fetchUsers(); // Refresh user list
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchUsers(); // Refresh user list
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}/admin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin })
      });
      
      if (response.ok) {
        fetchUsers(); // Refresh user list
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const getSystemStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => {
      const lastLogin = new Date(u.lastLogin);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return lastLogin > thirtyDaysAgo;
    }).length;
    const adminUsers = users.filter(u => u.isAdmin).length;
    const totalTasks = users.reduce((sum, u) => sum + u.todoList.length, 0);
    const completedTasks = users.reduce((sum, u) => sum + u.todoList.filter(t => t.completed).length, 0);
    
    return { totalUsers, activeUsers, adminUsers, totalTasks, completedTasks };
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-red-900/20 dark:via-pink-900/20 dark:to-red-900/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = getSystemStats();

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage users, monitor system, and configure settings
              </p>
            </div>
          </div>
        </motion.div>

        {/* Admin Overview Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { title: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            { title: 'Admin Users', value: stats.adminUsers, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { title: 'Total Tasks', value: stats.totalTasks, icon: Database, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
            { title: 'Completed Tasks', value: stats.completedTasks, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="glass card-hover border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Admin Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="users" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 p-1 rounded-xl">
              <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" /> User Management
              </TabsTrigger>
              <TabsTrigger value="system" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Database className="h-4 w-4 mr-2" /> System Status
              </TabsTrigger>
              <TabsTrigger value="support" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <AlertTriangle className="h-4 w-4 mr-2" /> Support
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" /> Settings
              </TabsTrigger>
            </TabsList>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                  <p className="text-gray-600 dark:text-gray-300">Manage all users and their permissions</p>
                </div>
                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Plus className="h-4 w-4 mr-2" /> Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>Create a new user account</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newUserData.name}
                          onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                          placeholder="Enter user name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUserData.email}
                          onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                          placeholder="Enter user email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUserData.password}
                          onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                          placeholder="Enter user password"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isAdmin"
                          checked={newUserData.isAdmin}
                          onChange={(e) => setNewUserData({ ...newUserData, isAdmin: e.target.checked })}
                        />
                        <Label htmlFor="isAdmin">Admin privileges</Label>
                      </div>
                      <Button onClick={handleAddUser} className="w-full">Add User</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((userItem) => (
                    <motion.div
                      key={userItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {userItem.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{userItem.name}</h3>
                              <Badge variant={userItem.isAdmin ? 'default' : 'secondary'}>
                                {userItem.isAdmin ? 'Admin' : 'User'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{userItem.email}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Joined: {new Date(userItem.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Activity className="h-3 w-3" /> Last: {new Date(userItem.lastLogin).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Logins: {userItem.stats.successfulLogins}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(userItem);
                              setIsPasswordDialogOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleAdmin(userItem.id, !userItem.isAdmin)}
                            disabled={userItem.id === user?.id}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(userItem.id)}
                            disabled={userItem.id === user?.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Login History */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Login Activity</h4>
                        <div className="space-y-2">
                          {userItem.recentLoginAttempts.slice(0, 3).map((attempt, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                              <div className={`w-2 h-2 rounded-full ${attempt.success ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span className="text-gray-600 dark:text-gray-400">
                                {new Date(attempt.timestamp).toLocaleString()}
                              </span>
                              <span className="text-gray-500">
                                {attempt.ipAddress !== 'unknown' && `• ${attempt.ipAddress}`}
                              </span>
                              <Badge variant={attempt.success ? 'default' : 'destructive'} className="text-xs">
                                {attempt.success ? 'Success' : 'Failed'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* System Status Tab */}
            <TabsContent value="system" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">System Status</h2>
                <p className="text-gray-600 dark:text-gray-300">Monitor system health and performance</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: 'Database', status: 'healthy', icon: CheckCircle },
                      { name: 'API', status: 'healthy', icon: CheckCircle },
                      { name: 'Authentication', status: 'healthy', icon: CheckCircle },
                      { name: 'File Storage', status: 'healthy', icon: CheckCircle }
                    ].map((service) => (
                      <div key={service.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{service.name}</span>
                        <div className="flex items-center gap-2">
                          <service.icon className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Healthy</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: 'CPU Usage', value: '23%', icon: Cpu },
                      { name: 'Memory', value: '1.2GB', icon: HardDrive },
                      { name: 'Storage', value: '45%', icon: Database },
                      { name: 'Network', value: '2.1MB/s', icon: Network }
                    ].map((metric) => (
                      <div key={metric.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          <metric.icon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{metric.value}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Support & Maintenance</h2>
                <p className="text-gray-600 dark:text-gray-300">System maintenance and support tools</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      View Logs
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p>No active alerts</p>
                      <p className="text-sm">All systems are running normally</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Settings</h2>
                <p className="text-gray-600 dark:text-gray-300">Configure application preferences and settings</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appName">Application Name</Label>
                      <Input id="appName" defaultValue="Career Compass" />
                    </div>
                    <div>
                      <Label htmlFor="version">Version</Label>
                      <Input id="version" defaultValue="1.0.0" disabled />
                    </div>
                    <div>
                      <Label htmlFor="maintenance">Maintenance Mode</Label>
                      <select id="maintenance" className="w-full p-2 border rounded-md">
                        <option value="false">Disabled</option>
                        <option value="true">Enabled</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="logLevel">Log Level</Label>
                      <select id="logLevel" className="w-full p-2 border rounded-md">
                        <option value="error">Error</option>
                        <option value="warn">Warning</option>
                        <option value="info">Info</option>
                        <option value="debug">Debug</option>
                      </select>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Password</DialogTitle>
            <DialogDescription>
              Enter a new password for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePasswordChange} className="flex-1">Change Password</Button>
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
