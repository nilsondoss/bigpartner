import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import RootLayout from './layouts/RootLayout';

// Lazy load ALL pages for maximum memory optimization during build
const HomePage = lazy(() => import('./pages/index'));
const PropertiesPage = lazy(() => import('./pages/properties'));
const PropertyDetailPage = lazy(() => import('./pages/property-detail'));
const RegisterInvestorPage = lazy(() => import('./pages/register-investor'));
const RegisterPartnerPage = lazy(() => import('./pages/register-partner'));
const DashboardPage = lazy(() => import('./pages/dashboard'));
const AdminInvestorsPage = lazy(() => import('./pages/admin/investors'));
const AdminPartnersPage = lazy(() => import('./pages/admin/partners'));
const AdminInquiriesPage = lazy(() => import('./pages/admin/inquiries'));
const AdminPropertiesPage = lazy(() => import('./pages/admin/properties'));
const PropertyImagesPage = lazy(() => import('./pages/admin/property-images'));
const AddPropertyPage = lazy(() => import('./pages/admin/add-property'));
const EditPropertyPage = lazy(() => import('./pages/admin/edit-property'));
const AdminDashboardPage = lazy(() => import('./pages/admin/dashboard'));
const PropertyApprovalPage = lazy(() => import('./pages/admin/property-approval'));
const ContactPage = lazy(() => import('./pages/contact'));
const ForInvestorsPage = lazy(() => import('./pages/for-investors'));
const ForPartnersPage = lazy(() => import('./pages/for-partners'));
const AboutPage = lazy(() => import('./pages/about'));
const CareersPage = lazy(() => import('./pages/careers'));
const BlogPage = lazy(() => import('./pages/blog'));
const HelpCenterPage = lazy(() => import('./pages/help-center'));
const FAQPage = lazy(() => import('./pages/faq'));
const TermsPage = lazy(() => import('./pages/terms'));
const PrivacyPage = lazy(() => import('./pages/privacy'));
const LoginPage = lazy(() => import('./pages/login'));
const RegisterPage = lazy(() => import('./pages/register'));
const ForgotPasswordPage = lazy(() => import('./pages/forgot-password'));
const ResetPasswordPage = lazy(() => import('./pages/reset-password'));
const IndustrialPropertiesPage = lazy(() => import('./pages/properties-industrial'));
const ResidentialPropertiesPage = lazy(() => import('./pages/properties-residential'));
const CommercialPropertiesPage = lazy(() => import('./pages/properties-commercial'));
const FarmLandPropertiesPage = lazy(() => import('./pages/properties-farmland'));
const RentalPropertiesPage = lazy(() => import('./pages/properties-rental'));
const LogoTestPage = lazy(() => import('./pages/logo-test'));
const ProfilePage = lazy(() => import('./pages/profile'));
const MyPropertiesPage = lazy(() => import('./pages/my-properties'));
const TrashPage = lazy(() => import('./pages/trash'));
const MyFavoritesPage = lazy(() => import('./pages/my-favorites'));
const AllPropertiesPage = lazy(() => import('./pages/all-properties'));

// Lazy load 404 page
const isDevelopment = (import.meta.env as any).DEV;
const NotFoundPage = isDevelopment ? lazy(() => import('../dev-tools/src/PageNotFound')) : lazy(() => import('./pages/_404'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/properties',
    element: <PropertiesPage />,
  },
  {
    path: '/all-properties',
    element: <AllPropertiesPage />,
  },
  {
    path: '/properties/:slug',
    element: <PropertyDetailPage />,
  },
  {
    path: '/properties/residential',
    element: <ResidentialPropertiesPage />,
  },
  {
    path: '/properties/commercial',
    element: <CommercialPropertiesPage />,
  },
  {
    path: '/properties/industrial',
    element: <IndustrialPropertiesPage />,
  },
  {
    path: '/properties/rental',
    element: <RentalPropertiesPage />,
  },
  {
    path: '/properties/farmland',
    element: <FarmLandPropertiesPage />,
  },
  {
    path: '/register/investor',
    element: <RegisterInvestorPage />,
  },
  {
    path: '/register/partner',
    element: <RegisterPartnerPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-properties',
    element: (
      <ProtectedRoute>
        <MyPropertiesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/trash',
    element: (
      <ProtectedRoute>
        <TrashPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-favorites',
    element: (
      <ProtectedRoute>
        <MyFavoritesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/investors',
    element: (
      <ProtectedRoute>
        <AdminInvestorsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/partners',
    element: (
      <ProtectedRoute>
        <AdminPartnersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/inquiries',
    element: (
      <ProtectedRoute>
        <AdminInquiriesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/properties',
    element: (
      <ProtectedRoute>
        <AdminPropertiesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/property-images',
    element: (
      <ProtectedRoute>
        <PropertyImagesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/add-property',
    element: (
      <ProtectedRoute>
        <AddPropertyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/edit-property/:id',
    element: (
      <ProtectedRoute>
        <EditPropertyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/property-approval',
    element: (
      <ProtectedRoute>
        <PropertyApprovalPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/for-investors',
    element: <ForInvestorsPage />,
  },
  {
    path: '/for-partners',
    element: <ForPartnersPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/careers',
    element: <CareersPage />,
  },
  {
    path: '/blog',
    element: <BlogPage />,
  },
  {
    path: '/help-center',
    element: <HelpCenterPage />,
  },
  {
    path: '/faq',
    element: <FAQPage />,
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/logo-test',
    element: <LogoTestPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
