import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface HeaderConfig {
  variant?: 'default' | 'centered' | 'split';
  logoPosition?: 'left' | 'center' | 'right';
  navPosition?: 'left' | 'center' | 'right';
  sticky?: boolean;
  transparent?: boolean;
  blur?: boolean;
  border?: boolean;
  mobileBehavior?: 'hamburger' | 'bottom-bar' | 'slide-down';
  logo?: {
    text?: string;
    href?: string;
    className?: string;
  };
  navItems?: Array<{
    href: string;
    label: string;
    external?: boolean;
  }>;
  actions?: React.ReactNode;
}

interface HeaderPatternProps {
  config?: HeaderConfig;
  className?: string;
}

export default function HeaderPattern({ config = {}, className }: HeaderPatternProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const {
    variant = 'default',
    logoPosition = 'left',
    navPosition = 'right',
    sticky = true,
    transparent = false,
    blur = true,
    border = true,
    mobileBehavior = 'hamburger',
    logo = { text: 'App', href: '/' },
    navItems = [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
    actions
  } = config;

  const renderAuthUI = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hidden md:flex"
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/my-properties" className="cursor-pointer">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                My Properties
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/my-favorites" className="cursor-pointer">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                My Favorites
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/trash" className="cursor-pointer">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Trash
              </Link>
            </DropdownMenuItem>
            {user.email === 'admin@bigpartner.com' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Admin</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/admin/dashboard" className="cursor-pointer">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/property-approval" className="cursor-pointer">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approve Properties
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/properties" className="cursor-pointer">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    All Properties
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="hidden md:flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/register">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Link>
        </Button>
      </div>
    );
  };

  const renderLogo = () => (
    <Link
      to={logo.href || '/'}
      className={cn(
        "flex items-center",
        logo.className
      )}
    >
      {logo.image && <img src={logo.image} alt={logo.text || 'Big Partner'} className="h-16" />}
      {!logo.image && <span className="text-xl font-bold">{logo.text}</span>}
    </Link>
  );

  const renderNav = () => (
    <nav className={cn(
      "flex gap-4",
      mobileBehavior === 'hamburger' && "hidden md:flex"
    )}>
      {navItems.map((item) => (
        item.external || item.href.startsWith('#') ? (
          <a
            key={item.href}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </a>
        ) : (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        )
      ))}
    </nav>
  );

  const renderMobileMenu = () => {
    if (mobileBehavior !== 'hamburger') return null;

    return (
      <>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border md:hidden">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                item.external || item.href.startsWith('#') ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary py-2",
                      location.pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary py-2",
                      location.pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium transition-colors hover:text-primary py-2 text-muted-foreground flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium transition-colors hover:text-primary py-2 text-destructive flex items-center gap-2 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium transition-colors hover:text-primary py-2 text-muted-foreground flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium transition-colors hover:text-primary py-2 text-muted-foreground flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </>
    );
  };

  const getHeaderContent = () => {
    switch (variant) {
      case 'centered':
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              {renderLogo()}
              {renderMobileMenu()}
            </div>
            {renderNav()}
          </div>
        );

      case 'split':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {renderLogo()}
              {navPosition === 'left' && renderNav()}
            </div>
            <div className="flex items-center gap-4">
              {navPosition === 'right' && renderNav()}
              {actions}
              {renderAuthUI()}
              {renderMobileMenu()}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex h-16 items-center justify-between">
            {logoPosition === 'left' && renderLogo()}
            {navPosition === 'center' && (
              <div className="flex-1 flex justify-center">
                {renderNav()}
              </div>
            )}
            {logoPosition === 'center' && (
              <div className="flex-1 flex justify-center">
                {renderLogo()}
              </div>
            )}
            <div className="flex items-center gap-4">
              {navPosition === 'right' && renderNav()}
              {logoPosition === 'right' && renderLogo()}
              {actions}
              {renderAuthUI()}
              {renderMobileMenu()}
            </div>
          </div>
        );
    }
  };

  return (
    <header
      className={cn(
        "z-50",
        sticky && "sticky top-0",
        !sticky && "relative",
        transparent ? "bg-transparent" : "bg-background/80",
        blur && "backdrop-blur-sm",
        border && "border-b border-border",
        className
      )}
    >
      <div className="container mx-auto px-4">
        {getHeaderContent()}
      </div>
    </header>
  );
}
