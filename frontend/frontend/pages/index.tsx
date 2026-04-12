import React from 'react'

export default function Home() {
  return (
    <div className="container mx-auto py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Aksesa
        </h1>
        <p className="text-xl text-gray-600">
          AI-Powered Credit Scoring for Indonesian SMEs
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">📊 Input Data</h2>
          <p className="text-gray-600 mb-6">
            Unggah foto nota, transaksi harian, atau data marketplace Anda untuk penilaian kredit.
          </p>
          <button className="btn btn-primary">Mulai Scoring →</button>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">🤖 AI Scoring</h2>
          <p className="text-gray-600 mb-6">
            Dapatkan skor kredit 0-100 dengan penjelasan detail tentang faktor penilaian Anda.
          </p>
          <button className="btn btn-primary">Lihat Contoh →</button>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">💰 Simulasi Pinjaman</h2>
          <p className="text-gray-600 mb-6">
            Simulasikan tenor dan cicilan yang sesuai dengan skor kredit Anda.
          </p>
          <button className="btn btn-secondary">Hitung Cicilan →</button>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">📑 Export Laporan</h2>
          <p className="text-gray-600 mb-6">
            Cetak laporan scoring untuk dibawa ke bank atau lembaga keuangan.
          </p>
          <button className="btn btn-secondary">Download PDF →</button>
        </div>
      </main>
    </div>
  )
}
