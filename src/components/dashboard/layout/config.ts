import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'delegates', title: 'Delegates', href: paths.dashboard.delegates, icon: 'users' },
  { key: 'companies', title: 'Companies', href: paths.dashboard.companies, icon: 'building' },
  { key: 'payments', title: 'Payments', href: paths.dashboard.payments, icon: 'credit-card' },
  { key: 'reports', title: 'Reports', href: paths.dashboard.reports, icon: 'chart-line' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
