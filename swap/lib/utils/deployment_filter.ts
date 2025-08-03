import deployments from "@/lib/constants/deployments.json";

/**
 * Interface for deployment configuration
 */
export interface DeploymentConfig {
  chainName: string;
  escrowFactoryAddress: string;
  mockUsdtAddress: string;
  mockDaiAddress: string;
  mockWrappedNativeAddress: string;
}

/**
 * Check if a chain has actual contract deployments
 * A chain is considered deployed if it has at least one non-empty contract address
 */
export function hasDeployments(chainId: string | number): boolean {
  const chainIdStr = chainId.toString();
  const deployment = deployments[chainIdStr as keyof typeof deployments] as DeploymentConfig | undefined;
  
  if (!deployment) {
    return false;
  }
  
  // Check if at least one contract address is not empty
  return !!(
    deployment.escrowFactoryAddress ||
    deployment.mockUsdtAddress ||
    deployment.mockDaiAddress ||
    deployment.mockWrappedNativeAddress
  );
}

/**
 * Get all deployed chain IDs
 */
export function getDeployedChainIds(): (string | number)[] {
  return Object.keys(deployments).filter(chainId => hasDeployments(chainId));
}

/**
 * Get all non-deployed chain IDs
 */
export function getNonDeployedChainIds(): (string | number)[] {
  return Object.keys(deployments).filter(chainId => !hasDeployments(chainId));
}

/**
 * Check if a chain has specific contract deployed
 */
export function hasContract(
  chainId: string | number, 
  contractType: "escrowFactory" | "mockUsdt" | "mockDai" | "mockWrappedNative"
): boolean {
  const chainIdStr = chainId.toString();
  const deployment = deployments[chainIdStr as keyof typeof deployments] as DeploymentConfig | undefined;
  
  if (!deployment) {
    return false;
  }
  
  switch (contractType) {
    case "escrowFactory":
      return !!deployment.escrowFactoryAddress;
    case "mockUsdt":
      return !!deployment.mockUsdtAddress;
    case "mockDai":
      return !!deployment.mockDaiAddress;
    case "mockWrappedNative":
      return !!deployment.mockWrappedNativeAddress;
    default:
      return false;
  }
}

/**
 * Get contract address for a specific chain and contract type
 */
export function getContractAddress(
  chainId: string | number,
  contractType: "escrowFactory" | "mockUsdt" | "mockDai" | "mockWrappedNative"
): string | null {
  const chainIdStr = chainId.toString();
  const deployment = deployments[chainIdStr as keyof typeof deployments] as DeploymentConfig | undefined;
  
  if (!deployment) {
    return null;
  }
  
  switch (contractType) {
    case "escrowFactory":
      return deployment.escrowFactoryAddress || null;
    case "mockUsdt":
      return deployment.mockUsdtAddress || null;
    case "mockDai":
      return deployment.mockDaiAddress || null;
    case "mockWrappedNative":
      return deployment.mockWrappedNativeAddress || null;
    default:
      return null;
  }
}

/**
 * Get deployment configuration for a chain
 */
export function getDeploymentConfig(chainId: string | number): DeploymentConfig | null {
  const chainIdStr = chainId.toString();
  const deployment = deployments[chainIdStr as keyof typeof deployments] as DeploymentConfig | undefined;
  
  return deployment || null;
}