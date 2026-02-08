'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { motion } from 'framer-motion'
import { formatUnits } from 'viem'

function shortenAddress(address?: string) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const { data: balance, isLoading } = useBalance({ address })

  const metamaskConnector = connectors.find(
    (c) => c.name.toLowerCase().includes('meta')
  )

  if (isConnected) {
    const formattedBalance =
      balance
        ? Number(formatUnits(balance.value, balance.decimals)).toFixed(4)
        : '0.0000'

    return (
      <div className="flex items-center gap-4 rounded-xl bg-white/70 px-4 py-1 "
          >
        {/* Wallet Info */}
        <div className="flex flex-col text-sm">
          <span className="font-semibold">
            {shortenAddress(address)}
          </span>
          <span className="text-xs opacity-70">
            {isLoading
              ? 'Loading balance...'
              : `${formattedBalance} ${balance?.symbol}`}
          </span>
        </div>

        {/* Disconnect */}
        <motion.button
          onClick={() => disconnect()}
          className="px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: 'var(--color-primary)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Disconnect
        </motion.button>
      </div>
    )
  }

  return (
    <motion.button
      onClick={() =>
        metamaskConnector && connect({ connector: metamaskConnector })
      }
      className="px-6 py-3 rounded-xl text-white font-semibold shadow-md"
      style={{ backgroundColor: 'var(--color-primary)' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Connect Wallet
    </motion.button>
  )
}
