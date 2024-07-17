import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], fileName: string) {
  // console.log('data',data);
  // Convert data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  // Generate a binary string representation of the workbook
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  // Create a blob from the buffer and generate a URL for downloading
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(dataBlob);
  // Create a link and trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${fileName}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
