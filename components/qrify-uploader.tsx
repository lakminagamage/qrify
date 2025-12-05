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
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

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

    const parseFile = (): Promise<{ qr_name: string; qr_value: string }[]> => {
      return new Promise((resolve, reject) => {
        Papa.parse<{ qr_name: string; qr_value: string }>(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            resolve(results.data)
          },
          error: (error) => {
            reject(error)
          },
        })
      })
    }

    try {
      setIsGenerating(true)
      const rows = await parseFile()
      const validRows = rows.filter(row => row.qr_name && row.qr_value)
      const total = validRows.length

      if (total === 0) {
        alert('No valid rows found in CSV. Ensure columns "qr_name" and "qr_value" exist.')
        setIsGenerating(false)
        return
      }

      setProgress({ current: 0, total })
      const zip = new JSZip()

      for (let i = 0; i < validRows.length; i++) {
        const { qr_name, qr_value } = validRows[i]
        const qrCodeDataUrl = await QRCode.toDataURL(qr_value, { errorCorrectionLevel: 'H' })
        zip.file(`${qr_name}.png`, qrCodeDataUrl.split(',')[1], { base64: true })
        setProgress({ current: i + 1, total })
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(zipBlob)
      link.download = 'QR_Codes.zip'
      link.click()

      alert('QR Codes generated successfully!')
    } catch (error) {
      alert(`Failed to generate QR codes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
      setProgress(null)
    }
  }

  return (
    <div>
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
            {progress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{progress.current}/{progress.total}</span>
                  <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-150"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-400">
            {file ? `Selected: ${file.name}` : 'No file selected'}
          </p>
          <Button 
            onClick={handleDownload} 
            disabled={!file || isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="mr-2 h-4 w-4" /> {isGenerating ? 'Generating...' : 'Download QR Codes'}
          </Button>
        </CardFooter>
      </Card>

    </div>
  )
}
