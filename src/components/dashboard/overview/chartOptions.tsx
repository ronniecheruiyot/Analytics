import type { ApexOptions } from 'apexcharts';
import { alpha, useTheme } from '@mui/material/styles';

export function useChartOptions(): ApexOptions {
    const theme = useTheme();
  
    return {
      chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
      colors: ["#FD8879", alpha(theme.palette.primary.main, 0.25)],
      dataLabels: { enabled: false },
      fill: { opacity: 1, type: 'solid' },
      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 2,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      legend: { show: false },
      plotOptions: { bar: { columnWidth: '26px' } },
      stroke: { colors: ['transparent'], show: true, width: 2 },
      theme: { mode: theme.palette.mode },
      xaxis: {
        axisBorder: { color: theme.palette.divider, show: true },
        axisTicks: { color: theme.palette.divider, show: true },
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
      },
      yaxis: {
        labels: {
          // formatter: (value) => (value > 0 ? `${value}K` : `${value}`),
          formatter: (value) => (value > 0 ? `${value}` : `${value}`),
          offsetX: -10,
          style: { colors: theme.palette.text.secondary },
        },
      },
    };
  }