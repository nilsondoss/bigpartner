import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import AiroErrorBoundary from '../dev-tools/src/AiroErrorBoundary';
import RootLayout, { RootLayoutConfig } from './layouts/RootLayout';
import { routes } from './routes';
import { Spinner } from './components/Spinner';
import { AuthProvider } from './contexts/AuthContext';

const SpinnerFallback = () => (
  <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>
);

/**
 * Centralized header configuration for the entire site
 *
 * This configuration is shared across all pages to maintain consistent navigation.
 * Update these values to change the header across the entire application.
 */
const headerConfig: RootLayoutConfig['header'] = {
  logo: {
    image: 'https://img1.wsimg.com/isteam/ip/e32ee418-703e-45cc-9e23-c1a75d171d00/Logo.png',
    text: 'Big Partner',
    href: '/'
  },
  navItems: [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/for-investors', label: 'For Investors' },
    { href: '/for-partners', label: 'For Partners' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ],
  sticky: true
};

/**
 * Centralized footer configuration for the entire site
 *
 * This configuration is shared across all pages to maintain consistent footer.
 * Update these values to change the footer across the entire application.
 */
const footerConfig: RootLayoutConfig['footer'] = {
  variant: 'detailed',
  logo: {
    image: 'https://img1.wsimg.com/isteam/ip/e32ee418-703e-45cc-9e23-c1a75d171d00/Logo.png',
    text: 'Big Partner',
    href: '/'
  },
  copyright: {
    text: 'Big Partner',
    showYear: true,
    position: 'left'
  },
  sections: [
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
        { href: '/careers', label: 'Careers' },
        { href: '/blog', label: 'Blog' }
      ]
    },
    {
      title: 'For Investors',
      links: [
        { href: '/for-investors', label: 'Learn More' },
        { href: '/properties', label: 'Browse Properties' },
        { href: '/register-investor', label: 'Register' }
      ]
    },
    {
      title: 'For Partners',
      links: [
        { href: '/for-partners', label: 'Learn More' },
        { href: '/register-partner', label: 'Become a Partner' }
      ]
    },
    {
      title: 'Support',
      links: [
        { href: '/help-center', label: 'Help Center' },
        { href: '/faq', label: 'FAQ' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/privacy', label: 'Privacy Policy' }
      ]
    }
  ],
  socialLinks: [
    { href: 'https://facebook.com/bigpartner', label: 'Facebook' },
    { href: 'https://twitter.com/bigpartner', label: 'Twitter' },
    { href: 'https://linkedin.com/company/bigpartner', label: 'LinkedIn' },
    { href: 'https://instagram.com/bigpartner', label: 'Instagram' }
  ]
};

// Create router with layout wrapper
const router = createBrowserRouter([
  {
    path: '/',
    element: import.meta.env.DEV ? (
      <AiroErrorBoundary>
        <Suspense fallback={<SpinnerFallback />}>
          <AuthProvider>
            <RootLayout config={{ header: headerConfig, footer: footerConfig }}>
              <Outlet />
            </RootLayout>
          </AuthProvider>
        </Suspense>
      </AiroErrorBoundary>
    ) : (
      <Suspense fallback={<SpinnerFallback />}>
        <AuthProvider>
          <RootLayout config={{ header: headerConfig, footer: footerConfig }}>
            <Outlet />
          </RootLayout>
        </AuthProvider>
      </Suspense>
    ),
    children: routes,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
