'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  GraduationCap, 
  Briefcase, 
  School, 
  Loader2,
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react';

interface SuggestionCardProps {
  title: string;
  icon: 'GraduationCap' | 'Briefcase' | 'School';
  content: string | null;
  isLoading?: boolean;
}

const iconMap = {
  GraduationCap: GraduationCap,
  Briefcase: Briefcase,
  School: School,
};

const colorMap = {
  GraduationCap: {
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  },
  Briefcase: {
    bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    text: 'text-purple-600',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  },
  School: {
    bg: 'bg-gradient-to-br from-pink-500 to-pink-600',
    text: 'text-pink-600',
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
  },
};

export function SuggestionCard({ title, icon, content, isLoading }: SuggestionCardProps) {
  const IconComponent = iconMap[icon];
  const colors = colorMap[icon];

  if (isLoading) {
    return (
      <Card className="glass card-hover border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <Card className="glass card-hover border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </CardTitle>
              <Badge variant="secondary" className={colors.badge}>
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Personalized recommendations based on your profile
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent dark:via-gray-700"></div>
          <div className="pl-4">
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${colors.text} bg-current`}></div>
              <div className="flex-1">
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  {content}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Target className="h-4 w-4" />
            <span>Tailored for you</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-4 w-4" />
            <span>Updated today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
