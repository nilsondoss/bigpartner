import { Link, useLocation } from 'react-router-dom';
import { Building2, Users, UserPlus, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    title: 'Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare,
  },
  {
    title: 'Investors',
    href: '/admin/investors',
    icon: Users,
  },
  {
    title: 'Partners',
    href: '/admin/partners',
    icon: UserPlus,
  },
  {
    title: 'Properties',
    href: '/admin/properties',
    icon: Building2,
  },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your platform</p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

