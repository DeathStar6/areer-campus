import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Target, TrendingUp } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  description: string;
  showStats?: boolean;
}

export function DashboardHeader({ title, description, showStats = false }: DashboardHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200 dark:border-blue-800">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            AI-Powered Guidance
          </span>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Quick Stats */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { 
              label: 'Study Levels', 
              value: '14+', 
              icon: Target, 
              color: 'text-blue-600',
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              border: 'border-blue-200 dark:border-blue-800'
            },
            { 
              label: 'Course Categories', 
              value: '50+', 
              icon: TrendingUp, 
              color: 'text-purple-600',
              bg: 'bg-purple-50 dark:bg-purple-900/20',
              border: 'border-purple-200 dark:border-purple-800'
            },
            { 
              label: 'Specializations', 
              value: '100+', 
              icon: Sparkles, 
              color: 'text-pink-600',
              bg: 'bg-pink-50 dark:bg-pink-900/20',
              border: 'border-pink-200 dark:border-pink-800'
            }
          ].map((stat, index) => (
            <Card key={index} className={`glass card-hover border-2 ${stat.border} ${stat.bg}`}>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-xl mb-4 shadow-sm">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}