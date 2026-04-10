import React from 'react'
import '../styles/globals.css'

export default function App({ Component, pageProps }: any) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Component {...pageProps} />
    </div>
  )
}
