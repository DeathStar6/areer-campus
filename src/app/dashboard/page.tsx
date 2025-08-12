
'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { CareerForm } from '@/components/dashboard/career-form';
import { UserDashboard } from '@/components/dashboard/user-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Target, TrendingUp, Users, Calendar, Clock, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Ready to discover your next career move?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" variants={itemVariants}>
          {[
            { title: 'Study Levels', value: '14+', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { title: 'Course Categories', value: '50+', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { title: 'Specializations', value: '100+', icon: Users, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
            { title: 'AI Models', value: '3', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
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

        {/* Main Dashboard Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div>
              <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 p-1 rounded-xl">
                {[
                  { value: 'overview', label: 'Overview', icon: Target },
                  { value: 'career', label: 'Career Guidance', icon: Sparkles },
                  { value: 'todo', label: 'To-Do List', icon: Calendar },
                  { value: 'history', label: 'History', icon: Clock }
                ].map((tab, index) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-200"
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Overview Tab */}
            <AnimatePresence mode="wait">
              <TabsContent key={activeTab} value="overview" className="space-y-8">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tabVariants}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center mb-8">
                    <Badge variant="secondary" className="mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium">
                      <Sparkles className="h-4 w-4" />
                      Dashboard Overview
                    </Badge>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Your Career Journey at a Glance
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                      Track your progress, manage your tasks, and explore new opportunities all in one place.
                    </p>
                  </div>
                  
                  <UserDashboard />
                </motion.div>
              </TabsContent>
            </AnimatePresence>

            {/* Career Guidance Tab */}
            <AnimatePresence mode="wait">
              <TabsContent key={activeTab} value="career" className="space-y-8">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tabVariants}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center mb-8">
                    <Badge variant="secondary" className="mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium">
                      <Sparkles className="h-4 w-4" />
                      AI-Powered Career Guidance
                    </Badge>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Find Your Perfect Career Path
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                      Select your study level and specialization to receive personalized AI-powered recommendations 
                      for your future studies, career opportunities, and college choices.
                    </p>
                  </div>
                  
                  <CareerForm />
                </motion.div>
              </TabsContent>
            </AnimatePresence>

            {/* To-Do Tab */}
            <AnimatePresence mode="wait">
              <TabsContent key={activeTab} value="todo" className="space-y-8">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tabVariants}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center mb-8">
                    <Badge variant="secondary" className="mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      Task Management
                    </Badge>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Your Career Action Plan
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                      Organize your career development tasks, set priorities, and track your progress.
                    </p>
                  </div>
                  
                  <UserDashboard showTodoOnly={true} />
                </motion.div>
              </TabsContent>
            </AnimatePresence>

            {/* History Tab */}
            <AnimatePresence mode="wait">
              <TabsContent key={activeTab} value="history" className="space-y-8">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tabVariants}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center mb-8">
                    <Badge variant="secondary" className="mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      Activity History
                    </Badge>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Your Career Journey Timeline
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                      Review your past activities, saved recommendations, and track your career development progress.
                    </p>
                  </div>
                  
                  <UserDashboard showHistoryOnly={true} />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}
