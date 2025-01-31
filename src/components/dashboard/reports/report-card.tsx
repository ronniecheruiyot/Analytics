'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ReportsModal from './reportsModal';

const user = {
  name: 'Sofia Rivers',
  avatar: '/assets/avatar.png',
  jobTitle: 'Senior Developer',
  country: 'USA',
  city: 'Los Angeles',
  timezone: 'GTM-7',
} as const;

export function ReportsCard({name} : {name: String}): React.JSX.Element {
  const [modal, setModal] = React.useState(false)
  return (
    <>
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          {/* <div>
            <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
          </div> */}
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            {/* <Typography variant="subtitle1">Delegates</Typography> */}
            <Typography color="text.secondary" variant="subtitle1">
              {name}
            </Typography>
            {/* <Typography color="text.secondary" variant="body2">
              {user.timezone}
            </Typography> */}
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" onClick={() => setModal(true)}>
          Get Report
        </Button>
      </CardActions>
    </Card>
    <ReportsModal modal={modal} setModal={setModal} name={`${name}`}/>
    </>
  );
}
