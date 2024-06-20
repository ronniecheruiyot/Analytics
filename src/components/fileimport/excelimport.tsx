// components/FileUpload.js
import { Button } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

type FileUploadProps = {
    onFileUpload: (data: object[]) => void;
  };
  
const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
        const target = e.target;
        if (target && target.result) {
            const data = new Uint8Array(target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json<object>(worksheet);
            onFileUpload(json);
        }
      
    };

    reader.readAsArrayBuffer(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />} {...getRootProps()} style={{ width: '100%', height: '100%', backgroundColor: '#D4AF37' }}>
      <input {...getInputProps()} />
      Import
    </Button>
  );
};

export default FileUpload;