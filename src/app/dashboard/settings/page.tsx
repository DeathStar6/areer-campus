
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { SettingsForm } from '@/components/dashboard/settings-form';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Settings"
        description="Manage your application preferences and settings."
      />
      <SettingsForm />
    </div>
  );
}
