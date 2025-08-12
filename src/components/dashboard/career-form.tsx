
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateFutureStudies, generatePlacementsAndJobs, generateCollegeSuggestions } from '@/ai/flows/generate-career-suggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { studyLevels, courses, specializations } from '@/lib/data';
import { SuggestionCard } from './suggestion-card';
import { Loader2, Target, Zap, Sparkles } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  studyLevel: z.string({ required_error: 'Please select a study level.'}).min(1, 'Please select a study level.'),
  course: z.string({ required_error: 'Please select a course.'}).min(1, 'Please select a course.'),
  specialization: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;
type Suggestions = {
  futureStudies: string | null;
  placementsAndJobs: string | null;
  collegeSuggestions: string | null;
};

export function CareerForm() {
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<Suggestions>({ futureStudies: null, placementsAndJobs: null, collegeSuggestions: null });
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studyLevel: '',
      course: '',
      specialization: '',
    },
  });

  const watchStudyLevel = form.watch('studyLevel');
  const watchCourse = form.watch('course');

  useEffect(() => {
    if (watchCourse) {
      const courseSpecializations = specializations[watchCourse];
      if (!courseSpecializations || courseSpecializations.length === 0) {
        form.setValue('specialization', 'n/a');
      } else {
        if (form.getValues('specialization') === 'n/a') {
            form.resetField('specialization', { defaultValue: '' });
        }
      }
    }
  }, [watchCourse, form]);

  const onSubmit = (data: FormData) => {
    setSuggestions({ futureStudies: null, placementsAndJobs: null, collegeSuggestions: null });
    setError(null);
    startTransition(async () => {
      try {
        const levelLabel = studyLevels.find(l => l.value === data.studyLevel)?.label || '';
        const courseLabel = courses[data.studyLevel]?.find(c => c.value === data.course)?.label || '';
        const specLabel = data.specialization && data.specialization !== 'n/a'
          ? specializations[data.course]?.find(s => s.value === data.specialization)?.label || 'N/A'
          : 'N/A';
        
        const input = {
            studyLevel: levelLabel, 
            course: courseLabel,
            specialization: specLabel
        };

        const [futureStudies, placementsAndJobs, collegeSuggestions] = await Promise.all([
            generateFutureStudies(input).then(res => {
                setSuggestions(prev => ({...prev, futureStudies: res}));
                return res;
            }),
            generatePlacementsAndJobs(input).then(res => {
                setSuggestions(prev => ({...prev, placementsAndJobs: res}));
                return res;
            }),
            generateCollegeSuggestions(input).then(res => {
                setSuggestions(prev => ({...prev, collegeSuggestions: res}));
                return res;
            })
        ]);

      } catch (e) {
        console.error(e);
        setError('Failed to generate suggestions. Please check your connection and try again.');
      }
    });
  };

  const hasSpecializations = watchCourse && specializations[watchCourse] && specializations[watchCourse].length > 0;
  
  const hasAnySuggestion = suggestions.futureStudies || suggestions.placementsAndJobs || suggestions.collegeSuggestions;

  return (
    <div className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="glass card-hover border-0 shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Find Your Path
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Select your academic profile to receive personalized AI-powered career guidance tailored to your unique background.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                 <FormField
                  control={form.control}
                  name="studyLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        Study Level
                      </FormLabel>
                      <Select onValueChange={(value) => {
                          field.onChange(value);
                          form.resetField('course', { defaultValue: '' });
                          form.resetField('specialization', { defaultValue: '' });
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                            <SelectValue placeholder="Select your study level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {studyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        Course
                      </FormLabel>
                      <Select onValueChange={(value) => {
                          field.onChange(value);
                          form.resetField('specialization', { defaultValue: '' });
                      }} value={field.value} disabled={!watchStudyLevel}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                            <SelectValue placeholder="Select your course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {watchStudyLevel && courses[watchStudyLevel]?.map((course) => (
                            <SelectItem key={course.value} value={course.value}>
                              {course.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Target className="h-4 w-4 text-pink-500" />
                        Specialization
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value} 
                        disabled={!watchCourse || !hasSpecializations}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                            <SelectValue placeholder="Select your specialization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hasSpecializations ? (
                            specializations[watchCourse]?.map((spec) => (
                              <SelectItem key={spec.value} value={spec.value}>
                                {spec.label}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="n/a" disabled>
                              N/A
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
                <Button 
                  type="submit" 
                  disabled={isPending}
                  size="lg"
                  className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                {isPending && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                <Sparkles className="mr-2 h-5 w-5" />
                Generate AI Recommendations
                </Button>
            </div>
          </form>
        </Form>
      
      {isPending && !hasAnySuggestion && (
        <div className="flex flex-col items-center justify-center p-12 space-y-6 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Our AI is charting your career path...
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Analyzing your profile and generating personalized recommendations
              </p>
            </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTitle className="text-red-800 dark:text-red-200">Error</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
        </Alert>
      )}
      
      {hasAnySuggestion && (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Personalized Career Recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Based on your academic profile, here's what our AI suggests for your future
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
                <SuggestionCard 
                    title="Future Studies"
                    icon="GraduationCap"
                    content={suggestions.futureStudies}
                    isLoading={isPending && !suggestions.futureStudies}
                />
                <SuggestionCard 
                    title="Placements & Jobs"
                    icon="Briefcase"
                    content={suggestions.placementsAndJobs}
                    isLoading={isPending && !suggestions.placementsAndJobs}
                />
            </div>
             <SuggestionCard
                title="Top College Suggestions"
                icon="School"
                content={suggestions.collegeSuggestions}
                isLoading={isPending && !suggestions.collegeSuggestions}
            />
        </div>
      )}
    </div>
  );
}
