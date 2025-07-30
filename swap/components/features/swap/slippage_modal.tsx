"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface SlippageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slippage: number;
  onSlippageChange: (slippage: number) => void;
}

export function SlippageModal({
  open,
  onOpenChange,
  slippage,
  onSlippageChange,
}: SlippageModalProps) {
  const [customSlippage, setCustomSlippage] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const presetSlippages = [
    { label: "Auto", value: 0.5 },
    { label: "0.1%", value: 0.1 },
    { label: "0.5%", value: 0.5 },
    { label: "1%", value: 1 },
  ];

  const handlePresetClick = (value: number) => {
    setIsCustom(false);
    setCustomSlippage("");
    onSlippageChange(value);
  };

  const handleCustomChange = (value: string) => {
    setCustomSlippage(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      onSlippageChange(numValue);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#1b1b23] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-violet-400">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            Slippage tolerance
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-4 gap-2">
            {presetSlippages.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                className={`border-gray-700 ${
                  !isCustom && slippage === preset.value
                    ? "bg-violet-600 text-white border-violet-600"
                    : "hover:bg-gray-800"
                }`}
                onClick={() => handlePresetClick(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className={`w-full justify-start border-gray-700 ${
                isCustom ? "bg-violet-600 text-white border-violet-600" : "hover:bg-gray-800"
              }`}
              onClick={() => {
                setIsCustom(true);
                if (customSlippage) {
                  handleCustomChange(customSlippage);
                }
              }}
            >
              Custom
            </Button>

            {isCustom && (
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="number"
                    value={customSlippage}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    placeholder="0.50"
                    className="bg-[#0e0e15] border-gray-800 pr-8"
                    step="0.01"
                    min="0"
                    max="50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    %
                  </span>
                </div>

                {parseFloat(customSlippage) > 5 && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-yellow-500 font-medium">High slippage</p>
                      <p className="text-gray-400">
                        Your transaction may be frontrun and result in an unfavorable trade.
                      </p>
                    </div>
                  </div>
                )}

                {parseFloat(customSlippage) < 0.1 && parseFloat(customSlippage) > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-red-500 font-medium">Low slippage</p>
                      <p className="text-gray-400">
                        Your transaction may fail due to price movement.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-400 space-y-1">
            <p>Slippage tolerance is the maximum price change you're willing to accept.</p>
            <p>Your transaction will revert if the price changes unfavorably by more than this percentage.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}