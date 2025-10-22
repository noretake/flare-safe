import React, { useState, useEffect } from 'react';
import { Vote, Coins } from 'lucide-react';
import { useWeb3 } from './hooks/useWeb3';
import { useDelegationContract } from './hooks/useDelegationContract';
import { WalletConnection } from './components/WalletConnection';
import { DepositForm } from './components/DepositForm';
import { deposit_amount } from './components/DepositForm';
import { createPublicClient, http, formatEther  } from 'viem';
import { CONTRACT_ABI,CONTRACT_ADDRESS, CrossFi } from './components/contractConfig';
import {RunUP} from './hooks/useDelegationContract'


const PublicClient =  createPublicClient({
  chain: CrossFi,
  transport: http()
})

function App() {
  const {
    account,
    signer,
    isConnecting,
    isConnected,
    isOnCrossFi,
    connectWallet,
    switchtoCrossFi,
    disconnect
  } = useWeb3();

  const {
    loading,
    stewards,
    delegationInfo,
    stats,
    onDeposit,
    initiate_Withdraw,
  } = useDelegationContract(signer);

  const [transactionStatus, setTransactionStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [Stake,setStake] = useState<any>();
  const [Reallocated,setReallocated] = useState<any>();
  const [Unstake,setUnstake] = useState<any>();



  useEffect(()=>{

    const getData = async () => {

       const Data = await PublicClient.simulateContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName:"unloadData",
          account: account
       })

      console.log("Data:....", Data.result, account)

      setStake(Data.result[0])
      setReallocated(Data.result[1])
      setUnstake(Data.result[3])
  }

  
    getData()
    console.log("The Stake...", Stake)

  },[account, Stake, RunUP])

  const handleDeposit = async () => {
    try {
      await onDeposit();
      setTransactionStatus({
        type: 'success',
        message: 'Successfully Deposited '+deposit_amount+' FLR tokens',
      });
    } catch (error) {
      setTransactionStatus({
        type: 'error',
        message: 'Failed to Deposit FLR Tokens.',
      });
    }
  };


  const initWithdraw = async () => {
    try {
      await initiate_Withdraw();
      setTransactionStatus({
        type: 'success',
        message: 'Successfully initiated withdraw',
      });
    } catch (error) {
      setTransactionStatus({
        type: 'error',
        message: 'Failed to initiate withdraw. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-flare-50 via-white to-flare-orange-50">
      {/* Header */}
      <header className="glass-effect border-b border-flare-200/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-flare-gradient rounded-2xl flex items-center justify-center shadow-lg">
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gradient-flare">FLR-Safe</h1>
                  <p className="text-sm text-gray-600 font-medium">Secure • Rewarding • Decentralized</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
               <button
                style={{display: account ? 'flex' : 'none'}}
                onClick={disconnect}
                disabled={isConnecting}
                className="flare-button-secondary"
              >
                {!isConnecting ? 'Disconnect' : 'Disconnecting...'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-flare-gradient-light px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-flare-500 rounded-full animate-pulse"></div>
            <span className="text-flare-700 font-semibold text-sm">Powered by Flare Network</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Secure Your <span className="text-gradient-flare">FLR Tokens</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
           Earn attractive yields by safely staking your FLR tokens on the Flare Network. 
           Simple, secure, and built for the community.
          </p>
          <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>5% APY</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Secure Smart Contract</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Instant Deposits</span>
            </div>
          </div>
        </div>


        {transactionStatus.type && (
          <div className={`mb-8 p-4 rounded-xl animate-slide-up ${
            transactionStatus.type === 'success' 
              ? 'bg-green-50 border-2 border-green-200 text-green-800' 
              : 'bg-red-50 border-2 border-red-200 text-red-800'
          }`}>
            <p className="font-semibold">{transactionStatus.message}</p>
            <button
              onClick={() => setTransactionStatus({ type: null, message: '' })}
              className="text-sm underline mt-2 hover:no-underline transition-all"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Card */}
        {Stake && (
          <div className="stats-card mb-12 animate-slide-up">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 mb-4">
                <Coins className="w-6 h-6 text-flare-600" />
                <h3 className="text-lg font-semibold text-gray-700">Your Staked Balance</h3>
              </div>
              <div className="text-4xl font-bold text-gradient-flare mb-2">
                {Number(formatEther(Stake)).toFixed(3)} FLR
              </div>
              <div className="text-sm text-gray-500">
                Earning 5% Annual Yield
              </div>
            </div>
          </div>
        )}

                {/* <div 
                  style={{display: Unstake && Number((formatEther(Unstake))/86400) <= 7? 'flex' : 'none'}}
                  className={`flex py-2 px-4 align-center rounded-md font-medium transition-colors bg-white text-blue-600 shadow-sm'`}>
                 
                  {
                  Number((formatEther(Unstake))/86400) <= 7 ?
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 
                  to-purple-600">

                  <span>Unstaking In:</span> {
                    (Number(formatEther(Unstake))/86400).toFixed(0) > 0 ? 
                  <span className=" font-bold text-gray-900 mb-4"> {
                  (Number(formatEther(Unstake))/86400).toFixed(0)} Days</span> :

                  (Number(formatEther(Unstake))/3600).toFixed(0) > 0 ?
                  <span className=" font-bold text-gray-900 mb-4"> {
                  (Number(formatEther(Unstake))/3600).toFixed(0)} Hours</span> : 
                  
                  (Number(formatEther(Unstake))/60).toFixed(0) > 0 ? 
                  <span className=" font-bold text-gray-900 mb-4"> {
                  (Number(formatEther(Unstake))/60).toFixed(0)} Minutes</span> : 

                  
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 
                  to-purple-600">
                  Unstaked</h3>
                }
                  
                
                </h3> :

                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 
                  to-purple-600">
                  Un..staked</h3>
                
              }

                </div> */}

                {/* <div
                  style={{display: Reallocated ? 'flex' : 'none'}}
                  className={`flex py-2 px-4 align-center rounded-md font-medium transition-colors bg-white text-blue-600 shadow-sm'`}>
                 
                   <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 
                  to-pink-600">
                  Reallocated: <span className=" font-bold text-gray-900 mb-4"> { Number(formatEther(Reallocated)).toFixed(3)} XFI </span>
                </h3> 

                </div> */}

                

                {/* <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Save your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 
                  to-purple-600">XFI Tokens</span>
                </h2> */}




        <div className="mb-8">
          <WalletConnection
            account={account}
            isConnecting={isConnecting}
            isOnCrossFi={isOnCrossFi}
            connectWallet={connectWallet}
            switchtoCrossFi={switchtoCrossFi}
          />
        </div>

        {isConnected && isOnCrossFi && (
          <>
        
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">

              <DepositForm
                account={account!}
                onDeposit={handleDeposit}
                initiateWithdraw={initWithdraw}
                loading={loading}
              />
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="text-center py-12 border-t border-flare-200/30 mt-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-flare-gradient rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-flare">FLR-Safe</span>
            </div>
            <p className="text-gray-600 mb-6">
              Built with ❤️ for the Flare Network community
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
