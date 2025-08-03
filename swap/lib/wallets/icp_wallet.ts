interface IcpWallet {
  isConnected: boolean;
  principalId: string | null;
  connect: () => Promise<{ principalId: string }>;
  disconnect: () => Promise<void>;
  getBalance: () => Promise<string>;
  transfer: (to: string, amount: string) => Promise<{ txHash: string }>;
}

export class IcpWalletAdapter {
  private wallet: IcpWallet | null = null;
  private connected: boolean = false;
  public address: string | null = null;

  async connect(): Promise<void> {
    try {
      if (typeof window === "undefined" || !(window as any).ic?.plug) {
        throw new Error("ICP wallet not found");
      }

      const plug = (window as any).ic.plug;
      
      const whitelist = [""];
      const network = "testnet";
      
      await plug.requestConnect({ whitelist, network });
      
      const principalId = await plug.getPrincipal();
      this.address = principalId.toString();
      this.wallet = plug;
      this.connected = true;
    } catch (error: any) {
      if (error.code === "USER_CANCELLED") {
        throw new Error("User cancelled connection");
      }
      throw new Error(error.message || "Failed to connect ICP wallet");
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.wallet && (window as any).ic?.plug) {
        await (window as any).ic.plug.disconnect();
      }
      this.wallet = null;
      this.connected = false;
      this.address = null;
    } catch (error: any) {
      throw new Error(error.message || "Failed to disconnect");
    }
  }

  async getBalance(): Promise<string> {
    try {
      if (!this.connected || !this.wallet) {
        throw new Error("Wallet not connected");
      }

      const plug = (window as any).ic.plug;
      const balance = await plug.requestBalance();
      
      return balance[0]?.value?.toString() || "0";
    } catch (error: any) {
      throw new Error(error.message || "Failed to get balance");
    }
  }

  async signAndSendTransaction(transaction: any): Promise<{ txHash: string }> {
    try {
      if (!this.connected || !this.wallet) {
        throw new Error("Wallet not connected");
      }

      const plug = (window as any).ic.plug;
      const result = await plug.requestTransfer(transaction);
      
      return { txHash: result.height.toString() };
    } catch (error: any) {
      if (error.message?.includes("User rejected")) {
        throw new Error("User rejected transaction");
      }
      throw new Error(error.message || "Failed to send transaction");
    }
  }

  isConnected(): boolean {
    return this.connected && this.address !== null;
  }

  getAddress(): string | null {
    return this.address;
  }
}