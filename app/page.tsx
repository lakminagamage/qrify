import QRifyUploader from '@/components/qrify-uploader'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-bold mb-8">QRify</h1>
      <p className="text-xl mb-8">Generate multiple QR codes from your CSV file</p>
      <QRifyUploader />
    </main>
  )
}

