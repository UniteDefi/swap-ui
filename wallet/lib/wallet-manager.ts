import { generateMnemonic, mnemonicToSeed, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { HDKey } from "@scure/bip32";
import { keccak_256 as keccak256 } from "@noble/hashes/sha3";
import { ripemd160 } from "@noble/hashes/ripemd160";
import { sha256 } from "@noble/hashes/sha256";
import CryptoJS from "crypto-js";
import { SUPPORTED_CHAINS, WalletAccount, EncryptedWallet, Chain } from "./wallet-types";

export class WalletManager {
  private static readonly STORAGE_KEY = "unite_defi_wallets";
  private static readonly CURRENT_WALLET_KEY = "unite_defi_current_wallet";

  static generateMnemonic(): string {
    return generateMnemonic(wordlist, 128); // 12 words
  }

  static validateMnemonic(mnemonic: string): boolean {
    return validateMnemonic(mnemonic, wordlist);
  }

  static async deriveWalletAccounts(mnemonic: string): Promise<WalletAccount[]> {
    if (!this.validateMnemonic(mnemonic)) {
      throw new Error("Invalid mnemonic phrase");
    }

    const seed = await mnemonicToSeed(mnemonic);
    const accounts: WalletAccount[] = [];

    for (const chain of SUPPORTED_CHAINS) {
      try {
        const account = await this.deriveAccountForChain(seed, chain);
        accounts.push(account);
      } catch (error) {
        console.error(`[WalletManager] Failed to derive account for ${chain.name}:`, error);
      }
    }

    return accounts;
  }

  private static async deriveAccountForChain(seed: Uint8Array, chain: Chain): Promise<WalletAccount> {
    const hdkey = HDKey.fromMasterSeed(seed);
    const derived = hdkey.derive(chain.derivationPath);

    if (!derived.privateKey) {
      throw new Error(`Failed to derive private key for ${chain.name}`);
    }

    let address: string;
    let publicKey: string;

    switch (chain.addressFormat) {
      case "ethereum":
        address = this.deriveEthereumAddress(derived.privateKey);
        publicKey = `0x${Buffer.from(derived.publicKey!).toString("hex")}`;
        break;
      
      case "bitcoin":
        address = this.deriveBitcoinAddress(derived.publicKey!);
        publicKey = Buffer.from(derived.publicKey!).toString("hex");
        break;
      
      case "solana":
        // Solana uses ed25519, but we'll approximate with secp256k1 for now
        publicKey = Buffer.from(derived.publicKey!).toString("hex");
        address = this.deriveSolanaAddress(derived.publicKey!);
        break;
      
      default:
        // For custom chains, we'll use a generic approach
        publicKey = Buffer.from(derived.publicKey!).toString("hex");
        address = this.deriveGenericAddress(derived.publicKey!, chain.id);
        break;
    }

    return {
      chainId: chain.id,
      address,
      publicKey,
      derivationPath: chain.derivationPath,
    };
  }

  private static deriveEthereumAddress(privateKey: Uint8Array): string {
    const hdkey = HDKey.fromMasterSeed(privateKey);
    if (!hdkey.publicKey) throw new Error("No public key");
    
    const publicKeyBytes = hdkey.publicKey.slice(1); // Remove 0x04 prefix
    const hash = keccak256(publicKeyBytes);
    const address = hash.slice(-20);
    return `0x${Buffer.from(address).toString("hex")}`;
  }

  private static deriveBitcoinAddress(publicKey: Uint8Array): string {
    const hash1 = sha256(publicKey);
    const hash2 = ripemd160(hash1);
    // Simplified Bitcoin address derivation (P2PKH)
    return `1${Buffer.from(hash2).toString("hex").slice(0, 32)}`;
  }

  private static deriveSolanaAddress(publicKey: Uint8Array): string {
    // Simplified Solana address - in reality would use ed25519
    return Buffer.from(publicKey).toString("base64").slice(0, 44);
  }

  private static deriveGenericAddress(publicKey: Uint8Array, chainId: string): string {
    const hash = sha256(publicKey);
    return `${chainId}_${Buffer.from(hash).toString("hex").slice(0, 40)}`;
  }

  static encryptWallet(mnemonic: string, password: string, name: string = "Wallet 1"): EncryptedWallet {
    const encrypted = CryptoJS.AES.encrypt(mnemonic, password).toString();
    
    return {
      id: Date.now().toString(),
      name,
      encryptedMnemonic: encrypted,
      accounts: [], // Will be populated when unlocked
      createdAt: Date.now(),
    };
  }

  static decryptMnemonic(encryptedMnemonic: string, password: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedMnemonic, password);
      const mnemonic = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!mnemonic || !this.validateMnemonic(mnemonic)) {
        throw new Error("Invalid password or corrupted wallet");
      }
      
      return mnemonic;
    } catch (error) {
      throw new Error("Failed to decrypt wallet. Check your password.");
    }
  }

  static saveWallet(wallet: EncryptedWallet): void {
    const existingWallets = this.getStoredWallets();
    const updatedWallets = [...existingWallets, wallet];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedWallets));
  }

  static getStoredWallets(): EncryptedWallet[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static setCurrentWallet(walletId: string): void {
    localStorage.setItem(this.CURRENT_WALLET_KEY, walletId);
  }

  static getCurrentWalletId(): string | null {
    return localStorage.getItem(this.CURRENT_WALLET_KEY);
  }

  static hasWallets(): boolean {
    return this.getStoredWallets().length > 0;
  }

  static exportWallets(password: string): string {
    const wallets = this.getStoredWallets();
    const exportData = {
      wallets: wallets.map(wallet => ({
        ...wallet,
        mnemonic: this.decryptMnemonic(wallet.encryptedMnemonic, password)
      })),
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  static clearAllWallets(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.CURRENT_WALLET_KEY);
  }
}