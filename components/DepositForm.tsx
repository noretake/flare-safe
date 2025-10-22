import React, { useState, useEffect } from 'react';
import {Coins, Send, User, Users, Target } from 'lucide-react';

interface DepositFormProps {
  account: string;
  onDeposit: () => void;
  initiateWithdraw: () => void;
  loading: boolean;
}

export let deposit_amount: string;
export let withdrawAmount:string;

export const DepositForm: React.FC<DepositFormProps> = ({
  account,
  onDeposit,
  initiateWithdraw,
  loading,
}) => {
  const [amount, setAmount] = useState('');
  const [selectedTab, setSelectedTab] = useState<'self' | 'custom'>('self');
  const [depositAmount, setDepositAmount] = useState('')
  

  useEffect(()=>{
      
    deposit_amount = depositAmount
    withdrawAmount = amount

  },[depositAmount, amount])

  const inititate = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) > 0) {
      initiateWithdraw();
    }
  };

  return (
    <div className="flare-card p-8 animate-slide-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-flare-gradient rounded-2xl mb-4 shadow-lg">
          <Send className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Manage Your FLR Tokens
        </h3>
        <p className="text-gray-600">
          Deposit to earn rewards or withdraw your staked tokens
        </p>
      </div>

      <div className="flex space-x-2 mb-8 bg-gray-50 p-2 rounded-2xl">
        <button
          onClick={() => setSelectedTab('self')}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            selectedTab === 'self'
              ? 'bg-flare-gradient text-white shadow-lg transform scale-[1.02]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          <Coins className="w-5 h-5 inline mr-2" />
          Deposit FLR
        </button>
        <button
          onClick={() => setSelectedTab('custom')}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            selectedTab === 'custom'
              ? 'bg-flare-gradient text-white shadow-lg transform scale-[1.02]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          <Target className="w-5 h-5 inline mr-2" />
          Withdraw FLR
        </button>
      </div>

      {selectedTab === 'self' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-flare-50 to-flare-orange-50 p-6 rounded-2xl border border-flare-200">
            <div className="flex items-center space-x-2 mb-4">
              <Coins className="w-5 h-5 text-flare-600" />
              <p className="text-flare-800 font-semibold">Deposit Amount</p>
            </div>
            <input 
              type="number" 
              className="flare-input text-lg font-semibold" 
              placeholder='Enter FLR amount (e.g. 100)' 
              onChange={(e)=>{setDepositAmount(e.target.value)}} 
            />
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-gray-500">Minimum: 0.1 FLR</span>
              <span className="text-flare-600 font-semibold">APY: 5%</span>
            </div>
          </div>
          
          <button
            onClick={onDeposit}
            disabled={loading || !depositAmount || Number(depositAmount) <= 0}
            className="flare-button w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Depositing...
              </>
            ) : (
              <>
                <Coins className="w-5 h-5 mr-2" />
                Deposit {depositAmount || '...'} FLR
              </>
            )}
          </button>
        </div>
      )}

      {selectedTab === 'custom' && (
        <form onSubmit={inititate} className="space-y-6">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-orange-600" />
              <p className="text-orange-800 font-semibold">Withdraw Amount</p>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter FLR amount to withdraw"
              className="flare-input text-lg font-semibold focus:border-orange-500 focus:ring-orange-100"
            />
            <div className="bg-orange-100 border border-orange-200 rounded-lg p-3 mt-4">
              <p className="text-orange-800 text-sm font-medium mb-1">
                <span className="text-orange-600 font-bold">Important:</span> Withdrawal Notice
              </p>
              <p className="text-orange-700 text-xs">
                Yields are calculated on remaining balance after withdrawal
              </p>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={Number(amount) <= 0 || loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50 flex items-center justify-center text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Initiating...
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-2" />
                Withdraw {amount || '...'} FLR
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
