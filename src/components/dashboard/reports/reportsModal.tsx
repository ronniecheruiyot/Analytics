import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { spacing } from '@mui/system';
import { Divider, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { exportToExcel } from '@/utils/exportToExcel';
import { allCompaniesUrl, allDelegatesUrl, getCompanyReportUrl, getDelegatesReportUrl, getpaymentReportUrl } from '@/globalConstants';
import { PartialPayments } from '../overview/partial-payments';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ReportsModal({modal, setModal, name}: {modal: boolean, setModal: (boolean: boolean) => void, name: string}) {
  const [from, setFrom] = React.useState<Dayjs | null>(dayjs(new Date()));
  const [to, setTo] = React.useState<Dayjs | null>(dayjs(new Date().toISOString()));
  const [loading, setloading] = React.useState(false);

  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setModal(false)
    setFrom((dayjs(from)))
    setTo((dayjs(to)))
    setloading(false)
  }

  const onSubmit = async() => {
    setloading(true)
    const fromDate = from.format('YYYY-MM-DD HH:mm:ss')
    const toDate = to.format('YYYY-MM-DD HH:mm:ss')

    if(name === "Full Payments" || name === "Partial Payments"){
      const res = await fetch(getpaymentReportUrl + `?from=${fromDate}&to=${toDate}`, {cache: 'no-store'})
      const responseData = await res.json()
      const partailPayments = responseData.filter(item => item != null && item.totalPayment < 80000)
      const fullPayments = responseData.filter(item => item != null && item.totalPayment >= 80000)
      const reportData = name === "Partial Payments" ? partailPayments : fullPayments
      exportToExcel(reportData, `${name} Payments Report`);
    } else if(name === "Companies"){
      const res = await fetch(getCompanyReportUrl + `&from=${from}&to=${to}`, { cache: 'no-store' })
      const companies = await res.json()
      exportToExcel(companies, `${name} Report`);
    }else if(name === "Delegates"){
      const res = await fetch(getDelegatesReportUrl + `&from=${from}&to=${to}`, { cache: 'no-store' })
      const delegates = await res.json()
      exportToExcel(delegates, `${name} Report`);
    }
    

    handleClose()
  }

  // console.log("Date from to", from, to)

  return (
    <>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={modal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2" sx={{mb: 1}}>
              {name}
            </Typography>
            <Divider sx={{mb: 5}}/>

            <Grid container spacing={2} > 
              <Grid item xs={6} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From"
                    value={from}
                    onChange={(newValue) => setFrom(newValue)}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={6} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To"
                    value={to}
                    onChange={(newValue) => setTo(newValue)}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid container spacing={2} justifyContent='flex-end' sx={{mt: 3}}>
                <Grid item>
                <Button variant='outlined' title='cancel' color='error' onClick={handleClose}>
                  Cancel
                </Button>
                </Grid>
                <Grid item>
                {!loading ?
                    <Button variant='outlined' title='cancel' color='success' onClick={onSubmit}>Download</Button>
                  :
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="outlined"
                    >
                      Downloading
                    </LoadingButton>
                }
                </Grid>
              </Grid>
              
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}