'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Download } from 'lucide-react'
import Papa from 'papaparse'
import QRCode from 'qrcode'
import JSZip from 'jszip'

interface Result {
  id: number;
  name: string;
}

const results: Result[] = [
  { id: 1, name: 'Example' },
];

interface Error {
  message: string;
}

const error: Error = {
  message: 'An error occurred',
};

export default function QRifyUploader(): JSX.Element {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
    } else {
      alert('Please select a valid CSV file.')
      setFile(null)
    }
  }

  const handleDownload = async (): Promise<void> => {
    if (!file) return

    Papa.parse<string[]>(file, {
      complete: async (results) => {
        const zip = new JSZip()
        const rows = results.data as string[][]

        for (let i = 0; i < rows.length; i++) {
          const [text] = rows[i]
          if (text) {
            const qrCodeDataUrl = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H' })
            zip.file(`QRCode_${i + 1}.png`, qrCodeDataUrl.split(',')[1], { base64: true })
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })

        const link = document.createElement('a')
        link.href = URL.createObjectURL(zipBlob)
        link.download = 'QR_Codes.zip'
        link.click()

        alert('QR Codes generated successfully!')
      },
      error: (error) => {
        alert(`Failed to parse CSV: ${error.message}`)
      },
    })
  }

  return (
    <Card className="w-full max-w-md bg-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle>Upload CSV & Generate QR Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="csv-upload">Upload CSV</Label>
            <Input 
              id="csv-upload" 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
              className="bg-gray-700 text-gray-100 file:bg-gray-600 file:text-gray-100 file:border-gray-500"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-400">
          {file ? `Selected: ${file.name}` : 'No file selected'}
        </p>
        <Button 
          onClick={handleDownload} 
          disabled={!file}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Download className="mr-2 h-4 w-4" /> Download QR Codes
        </Button>
      </CardFooter>
    </Card>
  )
}
