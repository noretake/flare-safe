import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';
import { CONTRACT_ABI,CONTRACT_ADDRESS,CrossFi } from '../components/contractConfig';
import {createWalletClient,custom,parseEther} from 'viem'
import { deposit_amount } from '../components/DepositForm'
import { withdrawAmount } from '../components/DepositForm';

const WalletClient = createWalletClient({
  chain:CrossFi,
  transport:custom(window.ethereum)
});


export interface Steward {
  address: string;
  name: string;
  delegationCount: number;
}

export interface DelegationInfo {
  delegate: string;
  timestamp: number;
  delegationType: string;
  active: boolean;
}

export interface DelegationStats {
  total: number;
  self: number;
  steward: number;
  custom: number;
}

export let RunUP;

export const useDelegationContract = (signer: ethers.JsonRpcSigner | null) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [stewards, setStewards] = useState<Steward[]>([]);
  const [delegationInfo, setDelegationInfo] = useState<DelegationInfo | null>(null);
  const [stats, setStats] = useState<DelegationStats | null>(null);
  const [rerun, setRerun] = useState(false)

  const {account} = useWeb3()

  

  useEffect(() => {
    if (signer) {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
      loadContractData();
    } 
    
    RunUP = rerun

  }, [signer, rerun]);

  //Get User Data
  const loadContractData = async () => {
    if (!contract) return;

    try {
      setLoading(true);

      // Initialize with empty data since these functions don't exist in the contract
      setStewards([]);
      setStats({
        total: 0,
        self: 0,
        steward: 0,
        custom: 0
      });
      setDelegationInfo(null);
      
    } catch (error) {
      console.error('Error loading contract data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDeposit = async () => {
    
    setLoading(true);

    try {

      const tx = await WalletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName:"depositToSafe",
        account: account,
        value: parseEther(deposit_amount)
      })
 
      await loadContractData(); 

      rerun ? setRerun(false) : setRerun(true);

      return tx;
      
    } catch (error) {
      console.error('Error Depositing FLR Tokens:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const initiate_Withdraw = async () => {

    setLoading(true);
    try {

      const tx = await WalletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName:"userWithdraw",
        args:[parseEther(withdrawAmount)],
        account: account,
      })

      console.log("Withdraw..",tx)

      rerun ? setRerun(false) : setRerun(true);
      
      return tx;

    } catch (error) {
      console.error('Error initiating withdraw', error);
      throw error;

    } finally {
      setLoading(false);
    }
  };

  return {
    contract,
    loading,
    stewards,
    delegationInfo,
    stats,
    onDeposit,
    initiate_Withdraw,
    refreshData: loadContractData
  };
};