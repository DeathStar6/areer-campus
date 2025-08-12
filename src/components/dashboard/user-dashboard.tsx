'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Trash2, 
  Edit, 
  Calendar, 
  Clock, 
  Bookmark, 
  Target,
  TrendingUp,
  Star,
  AlertCircle
} from 'lucide-react';
import type { TodoItem, HistoryItem, SavedItem } from '@/hooks/use-auth';

interface UserDashboardProps {
  showTodoOnly?: boolean;
  showHistoryOnly?: boolean;
}

export function UserDashboard({ showTodoOnly = false, showHistoryOnly = false }: UserDashboardProps) {
  const { user, addTodo, updateTodo, deleteTodo, addHistory, saveItem, deleteSavedItem } = useAuth();
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: ''
  });
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  if (!user) return null;

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return;
    
    addTodo({
      title: newTodo.title,
      description: newTodo.description,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate,
      completed: false
    });
    
    setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
    setIsAddingTodo(false);
  };

  const handleToggleTodo = (todoId: string, completed: boolean) => {
    updateTodo(todoId, { completed });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (showTodoOnly) {
    return (
      <div className="space-y-6">
        {/* Add Todo Section */}
        <Card className="glass card-hover border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Add New Task
            </CardTitle>
            <CardDescription>
              Create a new task to help you stay organized in your career journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="todo-title">Task Title</Label>
                <Input
                  id="todo-title"
                  placeholder="Enter task title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="todo-priority">Priority</Label>
                <Select value={newTodo.priority} onValueChange={(value: any) => setNewTodo({ ...newTodo, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="todo-description">Description</Label>
              <Textarea
                id="todo-description"
                placeholder="Enter task description"
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="todo-due-date">Due Date</Label>
              <Input
                id="todo-due-date"
                type="date"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
              />
            </div>
            <Button onClick={handleAddTodo} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </CardContent>
        </Card>

        {/* Todo List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Tasks</h3>
          {user.todoList && user.todoList.length > 0 ? (
            user.todoList.map((todo) => (
              <Card key={todo.id} className="glass card-hover border-0">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTodo(todo.id, !todo.completed)}
                      className="mt-1"
                    >
                      {todo.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {todo.title}
                        </h4>
                        <Badge className={getPriorityColor(todo.priority)}>
                          {todo.priority}
                        </Badge>
                      </div>
                      {todo.description && (
                        <p className={`text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {todo.dueDate ? formatDate(todo.dueDate) : 'No due date'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(todo.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="glass border-0 text-center py-8">
              <CardContent>
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks yet</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Start adding tasks to organize your career development journey
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (showHistoryOnly) {
    return (
      <div className="space-y-6">
        {/* History Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="glass card-hover border-0">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.history?.length || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities</p>
            </CardContent>
          </Card>
          <Card className="glass card-hover border-0">
            <CardContent className="p-6 text-center">
              <Bookmark className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.savedItems?.length || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Saved Items</p>
            </CardContent>
          </Card>
          <Card className="glass card-hover border-0">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.todoList?.filter(t => t.completed).length || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</p>
            </CardContent>
          </Card>
        </div>

        {/* History Timeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Timeline</h3>
          {user.history && user.history.length > 0 ? (
            <div className="space-y-4">
              {user.history
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((item) => (
                  <Card key={item.id} className="glass card-hover border-0">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {item.action}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {item.details}
                          </p>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card className="glass border-0 text-center py-8">
              <CardContent>
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No activity yet</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Your career activities will appear here as you use the platform
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Saved Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Items</h3>
          {user.savedItems && user.savedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.savedItems.map((item) => (
                <Card key={item.id} className="glass card-hover border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Bookmark className="h-4 w-4 text-blue-600" />
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
                          {item.content}
                        </p>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(item.savedAt)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSavedItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass border-0 text-center py-8">
              <CardContent>
                <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved items</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Save important career recommendations and insights for later reference
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Default overview view
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Quick Actions */}
      <Card className="glass card-hover border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and shortcuts for your career development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start h-12 border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            onClick={() => setIsAddingTodo(true)}
          >
            <Plus className="h-4 w-4 mr-3" />
            Add New Task
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start h-12 border-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <Bookmark className="h-4 w-4 mr-3" />
            Save Current Recommendations
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start h-12 border-2 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <TrendingUp className="h-4 w-4 mr-3" />
            View Progress Report
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass card-hover border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your latest career development activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {user.history && user.history.length > 0 ? (
            user.history
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 3)
              .map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.action}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {formatTime(item.timestamp)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
              ))
          ) : (
            <div className="text-center py-4">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Summary */}
      <Card className="glass card-hover border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Task Summary
          </CardTitle>
          <CardDescription>
            Overview of your current tasks and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {user.todoList?.filter(t => !t.completed).length || 0}
              </p>
              <p className="text-sm text-blue-600">Pending</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {user.todoList?.filter(t => t.completed).length || 0}
              </p>
              <p className="text-sm text-green-600">Completed</p>
            </div>
          </div>
          {user.todoList && user.todoList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Recent Tasks</h4>
              {user.todoList.slice(0, 3).map((todo) => (
                <div key={todo.id} className="flex items-center gap-2 text-sm">
                  {todo.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {todo.title}
                  </span>
                  <Badge className={getPriorityColor(todo.priority)}>
                    {todo.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Items Summary */}
      <Card className="glass card-hover border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-pink-600" />
            Saved Items
          </CardTitle>
          <CardDescription>
            Your bookmarked career insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {user.savedItems && user.savedItems.length > 0 ? (
            user.savedItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Bookmark className="h-4 w-4 text-pink-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.category}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Bookmark className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">No saved items yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Todo Dialog */}
      <Dialog open={isAddingTodo} onOpenChange={setIsAddingTodo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task to help you stay organized in your career journey
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dialog-todo-title">Task Title</Label>
              <Input
                id="dialog-todo-title"
                placeholder="Enter task title"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dialog-todo-description">Description</Label>
              <Textarea
                id="dialog-todo-description"
                placeholder="Enter task description"
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dialog-todo-priority">Priority</Label>
                <Select value={newTodo.priority} onValueChange={(value: any) => setNewTodo({ ...newTodo, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dialog-todo-due-date">Due Date</Label>
                <Input
                  id="dialog-todo-due-date"
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingTodo(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTodo} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
