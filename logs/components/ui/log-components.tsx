"use client";

import { 
  User, 
  Radio, 
  Handshake, 
  Package, 
  Lock, 
  TrendingUp, 
  CheckCircle, 
  Key, 
  ArrowUpRight, 
  Shield, 
  Coins 
} from "lucide-react";
import { 
  Log, 
  LogType,
  LogSource,
  OrderCreationData,
  OrderBroadcastData,
  ResolverCommitmentData,
  EscrowDeploymentData,
  AssetLockData,
  DestinationFillData,
  FillCompleteData,
  SecretRevealData,
  UserReleaseData,
  SafetyRecoveryData,
  SourceCollectData
} from "../../types";
import { TokenLogo } from "./token-logo";
import { ExplorerLink } from "./explorer-link";
import { getRelativeTime } from "../../lib/time-utils";
import { chainConfigs } from "../../lib/chains";

interface LogEntryProps {
  log: Log;
  isLast?: boolean;
}

export function LogEntry({ log, isLast = false }: LogEntryProps) {
  return (
    <div className="flex gap-3">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getSourceStyle(log.source).bg}`}>
          {getLogIcon(log.logType)}
        </div>
        {!isLast && <div className="w-px h-8 bg-border mt-2" />}
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceStyle(log.source).badge}`}>
            {log.source}
          </span>
          <span className="text-xs text-muted-foreground">
            {getRelativeTime(log.timestamp)}
          </span>
        </div>
        
        <h4 className="font-medium mb-1">{log.title}</h4>
        <p className="text-sm text-muted-foreground mb-3">{log.description}</p>
        
        {/* Custom component based on log type */}
        <LogTypeComponent log={log} />
      </div>
    </div>
  );
}

function LogTypeComponent({ log }: { log: Log }) {
  switch (log.logType) {
    case "order_creation":
      return <OrderCreationLog data={log.data as OrderCreationData} />;
    case "order_broadcast":
      return <OrderBroadcastLog data={log.data as OrderBroadcastData} />;
    case "resolver_commitment":
      return <ResolverCommitmentLog data={log.data as ResolverCommitmentData} />;
    case "escrow_deployment":
      return <EscrowDeploymentLog data={log.data as EscrowDeploymentData} />;
    case "asset_lock":
      return <AssetLockLog data={log.data as AssetLockData} />;
    case "destination_fill":
      return <DestinationFillLog data={log.data as DestinationFillData} />;
    case "fill_complete":
      return <FillCompleteLog data={log.data as FillCompleteData} />;
    case "secret_reveal":
      return <SecretRevealLog data={log.data as SecretRevealData} />;
    case "user_release":
      return <UserReleaseLog data={log.data as UserReleaseData} />;
    case "safety_recovery":
      return <SafetyRecoveryLog data={log.data as SafetyRecoveryData} />;
    case "source_collect":
      return <SourceCollectLog data={log.data as SourceCollectData} />;
    default:
      return null;
  }
}

// Individual log type components
function OrderCreationLog({ data }: { data: OrderCreationData }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TokenLogo token={data.srcToken} chain="" className="w-5 h-5" />
          <span className="font-medium">{data.srcAmount} {data.srcToken}</span>
          <span className="text-muted-foreground">→</span>
          <TokenLogo token={data.dstToken} chain="" className="w-5 h-5" />
          <span className="font-medium">{data.dstAmount} {data.dstToken}</span>
        </div>
        <div className="flex items-center gap-1 text-green-500">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs">Signed</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Order Hash:</span>
          <ExplorerLink value={data.orderHash} type="tx" chainId={data.srcChainId} className="ml-1" />
        </div>
        <div>
          <span className="text-muted-foreground">Secret Hash:</span>
          <span className="font-mono ml-1">{data.secretHash.slice(0, 10)}...</span>
        </div>
      </div>
    </div>
  );
}

function OrderBroadcastLog({ data }: { data: OrderBroadcastData }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio className="w-4 h-4 text-purple-500" />
            <div className="absolute inset-0 rounded-full border-2 border-purple-500 animate-ping" />
          </div>
          <span className="text-sm">Broadcasted to resolvers</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="bg-purple-500/20 text-purple-500 px-2 py-1 rounded text-xs font-medium">
            {data.resolverCount} Resolvers
          </span>
        </div>
      </div>
    </div>
  );
}

function ResolverCommitmentLog({ data }: { data: ResolverCommitmentData }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Handshake className="w-4 h-4 text-green-500" />
          <span className="text-sm">Committed to fill</span>
          <span className="font-medium">{data.fillPercentage}%</span>
        </div>
        <ExplorerLink value={data.commitmentTxHash} type="tx" chainId={data.chainId} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Fill Amount: {data.fillAmount}</span>
          <span>Safety Deposit: {data.safetyDepositAmount}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${data.fillPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function EscrowDeploymentLog({ data }: { data: EscrowDeploymentData }) {
  const srcChain = chainConfigs[data.srcChainId];
  const dstChain = chainConfigs[data.dstChainId];
  
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <img src={`/logos/${srcChain?.name.toLowerCase().replace(/ /g, "").replace("testnet", "").replace("sepolia", "")}.png`} className="w-4 h-4" alt={srcChain?.name} />
            <span className="text-xs font-medium">Source Escrow</span>
          </div>
          <ExplorerLink value={data.srcEscrowAddress} type="address" chainId={data.srcChainId} className="text-xs" />
          <ExplorerLink value={data.deploySrcTxHash} type="tx" chainId={data.srcChainId} className="text-xs" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <img src={`/logos/${dstChain?.name.toLowerCase().replace(/ /g, "").replace("testnet", "").replace("sepolia", "")}.png`} className="w-4 h-4" alt={dstChain?.name} />
            <span className="text-xs font-medium">Destination Escrow</span>
          </div>
          <ExplorerLink value={data.dstEscrowAddress} type="address" chainId={data.dstChainId} className="text-xs" />
          <ExplorerLink value={data.deployDstTxHash} type="tx" chainId={data.dstChainId} className="text-xs" />
        </div>
      </div>
    </div>
  );
}

function AssetLockLog({ data }: { data: AssetLockData }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-orange-500" />
          <span className="text-sm">Assets Locked</span>
        </div>
        <ExplorerLink value={data.lockTxHash} type="tx" chainId={data.chainId} />
      </div>
      <div className="flex items-center gap-2">
        <TokenLogo token={data.token} chain="" className="w-5 h-5" />
        <span className="font-medium">{data.amount} {data.token}</span>
        <span className="text-muted-foreground text-xs">in escrow</span>
      </div>
    </div>
  );
}

function DestinationFillLog({ data }: { data: DestinationFillData }) {
  const fillProgress = (parseFloat(data.cumulativeFilled) / (parseFloat(data.cumulativeFilled) + parseFloat(data.remainingToFill))) * 100;
  
  return (
    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-sm">Filled {data.fillAmount} {data.token}</span>
        </div>
        <ExplorerLink value={data.fillTxHash} type="tx" chainId={data.chainId} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Total Filled: {data.cumulativeFilled}</span>
          <span>Remaining: {data.remainingToFill}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${fillProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function FillCompleteLog({ data }: { data: FillCompleteData }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium">Order Fully Filled</span>
        </div>
        <span className="text-green-500 font-medium">{data.totalFilled}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        {data.participatingResolvers.length} resolvers participated
      </div>
    </div>
  );
}

function SecretRevealLog({ data }: { data: SecretRevealData }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-yellow-500" />
          <span className="text-sm">Secret Revealed</span>
        </div>
        <div className="flex items-center gap-1 text-green-500">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs">Verified</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Secret:</span>
          <span className="font-mono ml-1">{data.secret.slice(0, 10)}...</span>
        </div>
        <div>
          <span className="text-muted-foreground">Hash:</span>
          <span className="font-mono ml-1">{data.secretHash.slice(0, 10)}...</span>
        </div>
      </div>
    </div>
  );
}

function UserReleaseLog({ data }: { data: UserReleaseData }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-green-500" />
          <span className="text-sm">Released to User</span>
        </div>
        <ExplorerLink value={data.unlockTxHash} type="tx" chainId={data.chainId} />
      </div>
      <div className="flex items-center gap-2">
        <TokenLogo token={data.token} chain="" className="w-5 h-5" />
        <span className="font-medium">{data.amount} {data.token}</span>
        <span className="text-muted-foreground text-xs">→</span>
        <ExplorerLink value={data.recipient} type="address" chainId={data.chainId} className="text-xs" />
      </div>
    </div>
  );
}

function SafetyRecoveryLog({ data }: { data: SafetyRecoveryData }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="text-sm">Safety Deposit Recovered</span>
        </div>
        <ExplorerLink value={data.claimTxHash} type="tx" chainId={data.chainId} />
      </div>
      <div className="flex items-center gap-2">
        <TokenLogo token={data.token} chain="" className="w-5 h-5" />
        <span className="font-medium">{data.safetyAmount} {data.token}</span>
      </div>
    </div>
  );
}

function SourceCollectLog({ data }: { data: SourceCollectData }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-green-500" />
          <span className="text-sm">Collected Rewards</span>
        </div>
        <ExplorerLink value={data.collectTxHash} type="tx" chainId={data.chainId} />
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Reward: {data.rewardAmount} {data.token}</span>
          <span>Safety: {data.safetyAmount} {data.token}</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <TokenLogo token={data.token} chain="" className="w-4 h-4" />
          <span>Total: {data.totalAmount} {data.token}</span>
        </div>
      </div>
    </div>
  );
}

function getLogIcon(logType: LogType) {
  const iconClass = "w-4 h-4 text-white";
  
  switch (logType) {
    case "order_creation":
      return <User className={iconClass} />;
    case "order_broadcast":
      return <Radio className={iconClass} />;
    case "resolver_commitment":
      return <Handshake className={iconClass} />;
    case "escrow_deployment":
      return <Package className={iconClass} />;
    case "asset_lock":
      return <Lock className={iconClass} />;
    case "destination_fill":
      return <TrendingUp className={iconClass} />;
    case "fill_complete":
      return <CheckCircle className={iconClass} />;
    case "secret_reveal":
      return <Key className={iconClass} />;
    case "user_release":
      return <ArrowUpRight className={iconClass} />;
    case "safety_recovery":
      return <Shield className={iconClass} />;
    case "source_collect":
      return <Coins className={iconClass} />;
    default:
      return <User className={iconClass} />;
  }
}

function getSourceStyle(source: LogSource) {
  switch (source) {
    case "UI":
      return {
        bg: "bg-blue-500",
        badge: "bg-blue-500/20 text-blue-500"
      };
    case "Relayer":
      return {
        bg: "bg-purple-500",
        badge: "bg-purple-500/20 text-purple-500"
      };
    case "ResolverA":
      return {
        bg: "bg-green-500",
        badge: "bg-green-500/20 text-green-500"
      };
    case "ResolverB":
      return {
        bg: "bg-emerald-500",
        badge: "bg-emerald-500/20 text-emerald-500"
      };
    case "ResolverC":
      return {
        bg: "bg-teal-500",
        badge: "bg-teal-500/20 text-teal-500"
      };
    case "ResolverD":
      return {
        bg: "bg-cyan-500",
        badge: "bg-cyan-500/20 text-cyan-500"
      };
    default:
      return {
        bg: "bg-gray-500",
        badge: "bg-gray-500/20 text-gray-500"
      };
  }
}