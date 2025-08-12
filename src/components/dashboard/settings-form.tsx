
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sun, Moon, Laptop } from 'lucide-react';

const settingsFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const [isSaving, setIsSaving] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // In a real app, you'd fetch these defaults from user preferences
    const form = useForm<SettingsFormData>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: {
            theme: (theme as 'light' | 'dark' | 'system') || 'system',
            emailNotifications: true,
            pushNotifications: false,
            marketingEmails: true,
        },
    });

    useEffect(() => {
        setIsMounted(true);
        form.setValue('theme', (theme as 'light' | 'dark' | 'system') || 'system');
    }, [theme, form]);

    const onSubmit = (data: SettingsFormData) => {
        setIsSaving(true);
        setTheme(data.theme);
        
        console.log(data);
        // Simulate API call
        setTimeout(() => {
        toast({
            title: 'Settings Saved',
            description: 'Your new preferences have been saved.',
        });
        setIsSaving(false);
        }, 1000);
    };

    if (!isMounted) {
        return null;
    }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Label>Theme</Label>
                 <RadioGroup
                    onValueChange={(value: 'light' | 'dark' | 'system') => {
                        form.setValue('theme', value)
                        setTheme(value);
                    }}
                    value={form.watch('theme')}
                    className="grid grid-cols-3 gap-4"
                    >
                    <div>
                        <RadioGroupItem value="light" id="light" className="peer sr-only" />
                        <Label htmlFor="light" className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                            <Sun className="h-6 w-6" />
                            Light
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                        <Label htmlFor="dark" className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                           <Moon className="h-6 w-6" />
                           Dark
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="system" id="system" className="peer sr-only" />
                        <Label htmlFor="system" className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                            <Laptop className="h-6 w-6" />
                            System
                        </Label>
                    </div>
                </RadioGroup>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications from us.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive important updates and suggestions via email.
                    </p>
                </div>
                 <Switch
                    checked={form.watch('emailNotifications')}
                    onCheckedChange={(checked) => form.setValue('emailNotifications', checked)}
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                       Get notified directly on your device. (Coming soon!)
                    </p>
                </div>
                 <Switch
                    checked={form.watch('pushNotifications')}
                    onCheckedChange={(checked) => form.setValue('pushNotifications', checked)}
                    disabled
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive news about new features and special offers.
                    </p>
                </div>
                 <Switch
                    checked={form.watch('marketingEmails')}
                    onCheckedChange={(checked) => form.setValue('marketingEmails', checked)}
                />
            </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Preferences
            </Button>
        </CardFooter>
      </Card>

    </form>
  );
}
