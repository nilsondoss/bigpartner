import RootLayout from '@/layouts/RootLayout';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminInvestors() {
  return (
    <RootLayout>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <div className="container mx-auto py-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Investors</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage investor registrations and verifications
                  </p>
                </div>
                <Button onClick={() => window.location.href = '/register-investor'}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Investor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
