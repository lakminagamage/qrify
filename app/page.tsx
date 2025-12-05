import QRifyUploader from '@/components/qrify-uploader'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-bold mb-8">QRify</h1>
      <p className="text-xl mb-8">Generate multiple QR codes from your CSV file</p>
      <QRifyUploader />
      <div className="mt-8 max-w-md text-center text-sm text-gray-400">
        <p className="font-semibold text-gray-300 mb-2">How to use:</p>
        <p>Upload a CSV file with two columns:</p>
        <code className="block bg-gray-800 rounded px-3 py-2 mt-2 text-gray-300">
          qr_name,qr_value
        </code>
        <p className="mt-2">
          <span className="text-gray-300">qr_name</span> — filename for the generated QR code<br />
          <span className="text-gray-300">qr_value</span> — content to embed in the QR code
        </p>
      </div>
    </main>
  )
}

