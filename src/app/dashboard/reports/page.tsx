import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { ReportsInfo } from '@/components/dashboard/reports/reports-info';
import { ReportsDetailsForm } from '@/components/dashboard/reports/reports-details-form';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Reports</Typography>
      </div>
      <Grid container spacing={3}>
        Coming soon...
        {/* <Grid lg={4} md={6} xs={12}>
          <ReportsInfo />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <ReportsDetailsForm/>
        </Grid> */}
      </Grid>
    </Stack>
  );
}
