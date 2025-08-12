
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ProfileForm } from '@/components/dashboard/profile-form';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Profile"
        description="Manage your account settings and personal information."
      />
      <ProfileForm />
    </div>
  );
}
