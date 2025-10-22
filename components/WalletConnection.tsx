import React from 'react';
import { Wallet, AlertCircle } from 'lucide-react';

interface WalletConnectionProps {
  account: string | null;
  isConnecting: boolean;
  isOnCrossFi: boolean;
  connectWallet: () => void;
  switchtoCrossFi: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  account,
  isConnecting,
  isOnCrossFi,
  connectWallet,
  switchtoCrossFi,
}) => {
  if (!account) {
    return (
      <div className="flare-card p-8 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-flare-gradient rounded-3xl mb-6 shadow-xl">
          <Wallet className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600 mb-8 text-lg">
          Connect your wallet to start earning rewards on your FLR tokens
        </p>
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flare-button w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5 mr-2 inline" />
              Connect Wallet
            </>
          )}
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Supports MetaMask and other Web3 wallets
        </p>
      </div>
    );
  }

  if (!isOnCrossFi) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-2xl mr-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-orange-800">
                Switch to Flare Network
              </h3>
              <p className="text-orange-700 text-sm mt-1">
                Please switch to Flare Coston 2 testnet to continue
              </p>
            </div>
          </div>
          <button
            onClick={switchtoCrossFi}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Switch Network
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-2xl mr-4">
            <div className="w-6 h-6 bg-green-500 rounded-full relative">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <div>
            <p className="text-green-800 font-bold text-lg">
              ✓ Connected to Flare Network
            </p>
            <p className="text-green-600 text-sm font-mono bg-green-100 px-3 py-1 rounded-lg mt-1 inline-block">
              {account.slice(0, 8)}...{account.slice(-6)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-green-700 text-sm font-semibold">Flare Coston 2</p>
          <p className="text-green-600 text-xs">Testnet</p>
        </div>
      </div>
    </div>
  );
};