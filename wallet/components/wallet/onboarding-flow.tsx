"use client";

import { useState } from "react";
import { WalletManager } from "@/lib/wallet-manager";
import { useWalletState } from "@/hooks/use-wallet-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Download, Copy, Check, Wallet, Key, Shield } from "lucide-react";

type OnboardingStep = "welcome" | "generate" | "backup" | "password" | "complete";

export function OnboardingFlow() {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [mnemonicConfirmed, setMnemonicConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { createWallet } = useWalletState();

  const handleGenerateMnemonic = () => {
    const newMnemonic = WalletManager.generateMnemonic();
    setMnemonic(newMnemonic);
    setStep("generate");
  };

  const handleBackupComplete = () => {
    setMnemonicConfirmed(true);
    setStep("password");
  };

  const handleCreateWallet = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    const success = await createWallet(mnemonic, password);
    if (success) {
      setStep("complete");
    } else {
      alert("Failed to create wallet. Please try again.");
    }
  };

  const handleCopyMnemonic = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDownloadBackup = () => {
    const backupData = {
      mnemonic,
      chains: "All supported chains",
      createdAt: new Date().toISOString(),
      warning: "Keep this backup secure and never share it with anyone!"
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `unite-wallet-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {step === "welcome" && (
          <Card className="border-violet-800 bg-black/40 backdrop-blur-md">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-white">Welcome to Unite DeFi Wallet</CardTitle>
              <CardDescription className="text-violet-200 text-lg">
                Your gateway to multi-chain DeFi. Create a new wallet to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-violet-900/30 border border-violet-700">
                  <Shield className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Secure</h3>
                  <p className="text-sm text-violet-200">Encrypted with your password</p>
                </div>
                <div className="p-4 rounded-lg bg-violet-900/30 border border-violet-700">
                  <Key className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Multi-Chain</h3>
                  <p className="text-sm text-violet-200">40+ blockchain networks</p>
                </div>
                <div className="p-4 rounded-lg bg-violet-900/30 border border-violet-700">
                  <Wallet className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">One Wallet</h3>
                  <p className="text-sm text-violet-200">Single mnemonic for all chains</p>
                </div>
              </div>
              <Button 
                onClick={handleGenerateMnemonic}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 text-lg"
              >
                Create New Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "generate" && (
          <Card className="border-violet-800 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Your Recovery Phrase</CardTitle>
              <CardDescription className="text-violet-200">
                This 12-word phrase is the key to your wallet. Keep it safe and never share it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <div className={`grid grid-cols-3 gap-3 p-6 bg-black/60 rounded-lg border border-violet-700 ${!showMnemonic ? 'blur-sm' : ''}`}>
                  {mnemonic.split(" ").map((word, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-violet-900/30 rounded border border-violet-600">
                      <span className="text-xs text-violet-400 w-6">{index + 1}</span>
                      <span className="text-white font-mono">{word}</span>
                    </div>
                  ))}
                </div>
                {!showMnemonic && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      onClick={() => setShowMnemonic(true)}
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Click to reveal
                    </Button>
                  </div>
                )}
              </div>

              {showMnemonic && (
                <div className="flex space-x-3">
                  <Button
                    onClick={handleCopyMnemonic}
                    variant="outline"
                    className="flex-1 border-violet-600 text-violet-200 hover:bg-violet-900/50"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    onClick={handleDownloadBackup}
                    variant="outline"
                    className="flex-1 border-violet-600 text-violet-200 hover:bg-violet-900/50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}

              <div className="bg-amber-900/30 border border-amber-600 rounded-lg p-4">
                <h4 className="font-semibold text-amber-200 mb-2">⚠️ Important Security Warning</h4>
                <ul className="text-sm text-amber-100 space-y-1 list-disc list-inside">
                  <li>Never share your recovery phrase with anyone</li>
                  <li>Store it in a safe, offline location</li>
                  <li>If someone has your phrase, they control your wallet</li>
                  <li>We cannot recover your wallet if you lose this phrase</li>
                </ul>
              </div>

              <Button
                onClick={() => setStep("backup")}
                disabled={!showMnemonic}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3"
              >
                I've Saved My Recovery Phrase
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "backup" && (
          <Card className="border-violet-800 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Confirm Your Backup</CardTitle>
              <CardDescription className="text-violet-200">
                Please confirm that you have safely stored your recovery phrase.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-violet-900/30 rounded-lg border border-violet-700">
                  <h4 className="font-semibold text-white mb-2">✅ I have written down my recovery phrase</h4>
                  <p className="text-sm text-violet-200">And stored it in a secure location</p>
                </div>
                <div className="p-4 bg-violet-900/30 rounded-lg border border-violet-700">
                  <h4 className="font-semibold text-white mb-2">✅ I understand the risks</h4>
                  <p className="text-sm text-violet-200">If I lose my recovery phrase, I cannot access my wallet</p>
                </div>
                <div className="p-4 bg-violet-900/30 rounded-lg border border-violet-700">
                  <h4 className="font-semibold text-white mb-2">✅ I will keep it private</h4>
                  <p className="text-sm text-violet-200">I will never share it with anyone</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setStep("generate")}
                  variant="outline"
                  className="flex-1 border-violet-600 text-violet-200 hover:bg-violet-900/50"
                >
                  Go Back
                </Button>
                <Button
                  onClick={handleBackupComplete}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "password" && (
          <Card className="border-violet-800 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Set Your Password</CardTitle>
              <CardDescription className="text-violet-200">
                This password will encrypt your wallet locally. Choose a strong password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-black/60 border-violet-600 text-white pr-10"
                      placeholder="Enter a strong password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-violet-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Confirm Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-black/60 border-violet-600 text-white"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                <h4 className="font-semibold text-blue-200 mb-2">🔒 Password Requirements</h4>
                <ul className="text-sm text-blue-100 space-y-1 list-disc list-inside">
                  <li>At least 8 characters long</li>
                  <li>Use a combination of letters, numbers, and symbols</li>
                  <li>Don't use easily guessable information</li>
                  <li>Store it securely - we cannot reset it</li>
                </ul>
              </div>

              <Button
                onClick={handleCreateWallet}
                disabled={!password || !confirmPassword || password !== confirmPassword || password.length < 8}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3"
              >
                Create Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "complete" && (
          <Card className="border-violet-800 bg-black/40 backdrop-blur-md">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-white">Wallet Created Successfully!</CardTitle>
              <CardDescription className="text-violet-200 text-lg">
                Your multi-chain wallet is ready to use across 40+ blockchain networks.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 text-lg"
              >
                Enter Wallet
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}