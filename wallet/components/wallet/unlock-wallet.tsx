"use client";

import { useState } from "react";
import { useWalletState } from "@/hooks/use-wallet-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

export function UnlockWallet() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState("");
  const { walletState, unlockWallet } = useWalletState();

  const handleUnlock = async () => {
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsUnlocking(true);
    setError("");

    // Get the first wallet (we'll support multiple wallets later)
    const wallet = walletState.wallets[0];
    if (!wallet) {
      setError("No wallet found");
      setIsUnlocking(false);
      return;
    }

    const success = await unlockWallet(wallet.id, password);
    
    if (!success) {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
    
    setIsUnlocking(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-violet-800 bg-black/40 backdrop-blur-md">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-violet-200">
              Enter your password to unlock your wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {walletState.wallets.length > 0 && (
              <div className="p-3 bg-violet-900/30 rounded-lg border border-violet-700">
                <p className="text-sm text-violet-200">
                  <strong className="text-white">{walletState.wallets[0].name}</strong>
                </p>
                <p className="text-xs text-violet-300">
                  Created {new Date(walletState.wallets[0].createdAt).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-white">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-black/60 border-violet-600 text-white pr-10"
                  placeholder="Enter your password"
                  disabled={isUnlocking}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-violet-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isUnlocking}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-900/30 border border-red-600 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <Button
              onClick={handleUnlock}
              disabled={!password.trim() || isUnlocking}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3"
            >
              {isUnlocking ? "Unlocking..." : "Unlock Wallet"}
            </Button>

            <div className="text-center">
              <p className="text-xs text-violet-300">
                Forgot your password? You'll need to restore from your recovery phrase.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}