import deployments from "@/lib/constants/deployments.json";

export function getEscrowFactoryAddress(chainId: number | string): string | null {
  const deployment = deployments[chainId as keyof typeof deployments];
  
  if (!deployment) {
    console.warn(`[EscrowFactory] No deployment found for chain ${chainId}`);
    return null;
  }
  
  const address = deployment.escrowFactoryAddress;
  
  if (!address || address === "") {
    console.warn(`[EscrowFactory] No escrow factory address configured for chain ${chainId}`);
    return null;
  }
  
  return address;
}

export function isEVMChain(chainId: number | string): boolean {
  return typeof chainId === "number";
}

export function hasEscrowFactoryConfigured(chainId: number | string): boolean {
  const address = getEscrowFactoryAddress(chainId);
  return address !== null && address !== "";
}