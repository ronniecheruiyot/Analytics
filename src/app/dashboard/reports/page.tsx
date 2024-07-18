import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { ReportsDetailsForm } from '@/components/dashboard/reports/reports-details-form';
import { ReportsCard } from '@/components/dashboard/reports/report-card';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Grid>
        <Typography variant="h4">Reports</Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <ReportsCard name="Partial Payments"/>
        </Grid>
        <Grid lg={4} md={6} xs={12}>
          <ReportsCard name="Full Payments"/>
        </Grid>
        <Grid lg={4} md={6} xs={12}>
          <ReportsCard name="Companies"/>
        </Grid>
        <Grid lg={4} md={6} xs={12}>
          <ReportsCard name="Delegates"/>
        </Grid>
      
      </Grid>
    </Stack>
  );
}
