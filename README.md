# Akcess — AI-Powered On-Chain Event Access

Akcess is an AI-driven, blockchain-based event management platform built specifically for the **BNB Smart Chain**. It allows organizers to create events using natural language prompts, publish them as immutable smart contracts, and manage entry through verifiable QR code checks on-chain.

---

## Key Features

### AI-Driven Event Creation
* **Natural Language Processing:** Create events by describing them in plain English.
* **Automated Structuring:** The AI extracts the title, date, ticket price (BNB), and capacity, converting them into on-chain data.
* **Smart Normalization:** Automatically handles time zone adjustments and theme generation.

### Secure On-Chain Management (BNB Smart Chain)
* **Transparent Ticketing:** All events are deployed to a smart contract on the **BNB Smart Chain (Testnet)**, ensuring verifiable and tamper-proof records.
* **Trustless Payments:** Ticket purchases are handled directly via BSC smart contracts—no middlemen required.
* **Real-time Attendance:** Bookings and check-in statuses are updated live on the blockchain for full transparency.

### Seamless QR Verification
* **Unique Entry Passes:** Every booking generates a unique, wallet-linked QR code.
* **One-Tap Validation:** Organizers scan codes to instantly verify wallet ownership and check-in status directly against the blockchain.

---

## Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion
* **Blockchain:** Solidity, **BNB Smart Chain (Testnet)**
* **Web3 Integration:** wagmi, viem
* **AI Engine:** OpenAI Responses API (Function Calling)
* **Utilities:** react-qr-code for ticket generation

---

## Smart Contract Information
* **Network:** BNB Smart Chain (Testnet)
* **Address:** `0x08758DDAbA20d43C1Ead2c9753939755177D25B0`
* **Source Code:** [AkcessSmartContract Repository](https://github.com/bellobambo/AkcessSmartContract)
* **Capabilities:** Event deployment, automated fund withdrawals, and role-based access for organizers.


---

## Reproduction instructions
Follow these steps to run Akcess locally.


1. Prerequisites

* Node.js ≥ 18 (npm -v to check)
* npm or yarn
* git installed in your computer (git -v to check)
* A MetaMask wallet
* Access to BNB Smart Chain Testnet
* Testnet BNB (get from BSC faucet)

2. Clone the Repository & install Ddpendencies

* git clone https://github.com/bellobambo/akcess-fe.git
* cd akcess-fe
* npm i


3. Environment Setup
Create a .env.local file in the root of your project and paste the following, replacing the placeholders with your new credentials:

* NEXT_PUBLIC_BSC_TESTNET_RPC_URL=https://bsc-testnet.infura.io/v3/YOUR_INFURA_ID
* OPENAI_API_KEY=sk-proj-YOUR_NEW_OPENAI_KEY

4. Run the Project
npm run dev

Navigate to http://localhost:3000, to see project runing locally
