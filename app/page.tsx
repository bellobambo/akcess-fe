'use client'

import { WalletConnect } from '@/components/WalletConnect'
import { AICreateEvent } from '@/components/AICreateEvent'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Wallet Section */}
      <WalletConnect />

      {/* AI Create Event Section */}
      {isConnected && <AICreateEvent />}
    </main>
  )
}
