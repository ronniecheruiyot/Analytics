export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    reports: '/dashboard/reports',
    delegates: '/dashboard/delegates',
    companies: '/dashboard/companies',
    payments: '/dashboard/payments',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
