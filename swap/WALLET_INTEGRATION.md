# Wallet Integration Guide

## Overview

This guide explains how to integrate both EVM and non-EVM wallets into the UniteDefi swap interface.

## EVM Wallets

EVM wallets are handled through Reown AppKit (formerly WalletConnect) with wagmi. The following EVM chains are supported:

1. Ethereum Sepolia
2. Base Sepolia
3. Arbitrum Sepolia
4. Optimism Sepolia
5. Polygon Amoy
6. Scroll Sepolia
7. Celo Alfajores
8. Unichain Sepolia
9. Flow Testnet (EVM)
10. Sei Testnet (EVM)
11. BNB Testnet
12. Aurora Testnet
13. Injective Testnet (EVM)
14. Etherlink Testnet
15. Monad Testnet

## Non-EVM Wallets

Non-EVM wallets require individual SDK integrations. Here's the implementation approach for each:

### 1. Aptos
- **SDK**: `@aptos-labs/wallet-adapter-react`
- **Wallets**: Petra, Martian, Pontem
- **Example**: See `/lib/wallets/aptos_wallet.ts`

### 2. Sui
- **SDK**: `@mysten/wallet-kit`
- **Wallets**: Sui Wallet, Ethos, Martian

### 3. Stellar
- **SDK**: `@stellar/freighter-api`
- **Wallets**: Freighter, Albedo

### 4. Cosmos Ecosystem (Osmosis)
- **SDK**: `@keplr-wallet/types`
- **Wallets**: Keplr, Leap

### 5. XRPL
- **SDK**: `xrpl`
- **Wallets**: Xumm, GemWallet

### 6. Starknet
- **SDK**: `starknetkit`
- **Wallets**: Argent X, Braavos

### 7. ICP
- **SDK**: `@dfinity/agent`
- **Wallets**: Internet Identity, Plug

## Implementation Steps

To add a new non-EVM wallet:

1. Install the required SDK:
   ```bash
   yarn add [wallet-sdk-package]
   ```

2. Create a wallet adapter in `/lib/wallets/[chain]_wallet.ts`

3. Update the `NonEvmWalletContext` connect method to handle the new wallet type

4. Add wallet detection logic to check if the wallet extension is installed

5. Implement the following methods:
   - `connect()`: Establish connection with the wallet
   - `disconnect()`: Close the wallet connection
   - `getBalance()`: Fetch the wallet balance
   - `signTransaction()`: Sign transactions for swaps

## Testing

1. Install the wallet browser extension
2. Create/import a testnet account
3. Test the connection flow
4. Verify balance display
5. Test transaction signing

## Security Considerations

- Always verify the wallet's origin
- Validate all addresses and transactions
- Handle connection errors gracefully
- Store minimal wallet data
- Clear wallet data on disconnect