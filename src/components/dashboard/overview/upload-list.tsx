// app/dashboard/ClientDashboard.js
"use client";

import FileUpload from '@/components/fileimport/excelimport';
import { useState } from 'react';

interface Data {
  Category: string;
  FullName: string;
  Email: string;
  Phone: string;
  IhrmNumber: string;
  JobTitle: string;
  CompanyId?: number;
  PaymentId?: number;
  CompanyName: string,
  ContactPersonName?: string,
  ContactPersonEmail?: string,
  ContactPersonPhone?: number
}

type JsonData = {
  // Replace with actual properties and types
  [key: string]: any;
};

const UploadList = () => {
  const [data, setData] = useState<JsonData[]>([]);

  const handleFileUpload = async (json: JsonData[]) => {
    setData(json);
    console.log(data);
    

    // Send data to back-end
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ data: json }),
    });

    if (response.ok) {
      console.log('File data sent to server');
    } else {
      console.error('Error sending file data to server');
    }
  };

  return (
    <div>
      <FileUpload onFileUpload={handleFileUpload} />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default UploadList;
