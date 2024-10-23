"use client";
import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import axios, { AxiosResponse } from 'axios';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Define types for Network and Wallet
interface Network {
  _id: string;
  name: string;
}

interface Wallet {
  walletAddress: string;
}

const CreateToken: React.FC = () => {
  const [tg] = useState(WebApp); // Initialize WebApp SDK
  const [networks, setNetworks] = useState<Network[]>([]); // Use defined Network type
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [userWallets, setUserWallets] = useState<Wallet[]>([]); // Use defined Wallet type
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>('0.00');
  const [isConfirmationMode, setIsConfirmationMode] = useState<boolean>(false);

  // Form fields
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenSupply, setTokenSupply] = useState<string>('');
  const [tokenDecimal, setTokenDecimal] = useState<string>('');

  useEffect(() => {
    // Initialize Telegram WebApp
    tg.ready();
    tg.expand();

    // Fetch networks and wallets
    getNetworkList();
    getWallets();
  }, [tg]);

  // Fetch networks from API
  const getNetworkList = async (): Promise<void> => {
    try {
      // Change the response type to AxiosResponse<Network[]>
      const response: AxiosResponse<Network[]> = await axios.post('https://api-tg.blocktools.ai/external/core/list-networks');
      
      // Set the actual network array to state
      setNetworks(response.data); 
    } catch (error) {
      console.error('Error fetching network list:', error);
    }
  };

  // Fetch user wallets
  const getUserId = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userid');
  };

  const getWallets = async (): Promise<void> => {
    const userId = getUserId();
    if (!userId) return;

    try {
      // Adjust the response typing to match the actual API structure
      const response: AxiosResponse<{ walletDetails: Wallet[] }> = await axios.post(
        'https://api-tg.blocktools.ai/wallet/list-wallets',
        {
          userId: userId,
        }
      );
      setUserWallets(response.data.walletDetails); // Access walletDetails directly
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  // Handle network selection
  const handleNetworkSelect = (networkId: string): void => {
    setSelectedNetworkId(networkId);
    if (selectedWallet) {
      getBalance(networkId, selectedWallet);
    } else {
      setWalletBalance('N/A');
    }
  };

  // Handle wallet selection
  const handleWalletSelect = (walletAddress: string): void => {
    setSelectedWallet(walletAddress);
    const selectedNetwork = networks.find((network) => network._id === selectedNetworkId);
    if (selectedNetwork) {
      getBalance(selectedNetwork._id, walletAddress);
    } else {
      setWalletBalance('N/A');
    }
    tg.MainButton.setParams({ is_active: true });
  };

  // Fetch balance
  const getBalance = async (networkName: string, walletAddress: string): Promise<void> => {
    try {
      const response: AxiosResponse<{ balance: string }> = await axios.post(
        'https://api-tg.blocktools.ai/wallet/get-new-balance',
        {
          networkName: networkName,
          walletAddress: walletAddress,
        }
      );
      setWalletBalance(response.data.balance); // Correctly access the balance inside the response
    } catch (error) {
      console.error('Error fetching balance:', error);
      setWalletBalance('N/A');
    }
  };

  // Toggle Confirmation View
  const toggleConfirmationView = (): void => {
    setIsConfirmationMode(!isConfirmationMode);
    if (!isConfirmationMode) {
      tg.MainButton.setParams({ text: 'Create Token', is_active: true });
    } else {
      tg.MainButton.setParams({ text: 'Continue', is_active: false });
    }
  };

  return (
    <div className="min-h-screen  p-4">
    
      {!isConfirmationMode ? (
        <div id="formView">
                <Navbar/>
          <h2 className="text-lg font-bold text-white">Fill out details below to Continue</h2>
          <div className="form-group">
            <div className="flex flex-col mb-8">
              <p className="text-white">Available Networks</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {networks.map((network) => (
                  <button
                    key={network._id}
                    className={`p-2 border ${selectedNetworkId === network._id ? 'bg-[#24A1DE] text-white' : 'bg-transparent border border-gray-500 text-white'} rounded`}
                    onClick={() => handleNetworkSelect(network._id)}
                  >
                    {network.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Fields */}
            <div className="form-group">
              <input
                type="text"
                className="w-full rounded-md border border-[#434C59] bg-white p-2 shadow-lg dark:bg-[#191919] my-2"
                placeholder="Token Name"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
              />
              <input
                type="text"
                className="w-full rounded-md border border-[#434C59] bg-white p-2 shadow-lg dark:bg-[#191919] my-2"
                placeholder="Token Symbol"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
              />
              <input
                type="number"
                className="w-full rounded-md border border-[#434C59] bg-white p-2 shadow-lg dark:bg-[#191919] my-2"
                placeholder="Total Supply"
                value={tokenSupply}
                onChange={(e) => setTokenSupply(e.target.value)}
              />
              <input
                type="number"
                className="w-full rounded-md border border-[#434C59] bg-white p-2 shadow-lg dark:bg-[#191919] my-2"
                placeholder="Decimals"
                value={tokenDecimal}
                onChange={(e) => setTokenDecimal(e.target.value)}
              />
            </div>

            {/* Wallet Selection */}
            <div className="flex flex-col">
              <p className="text-white">Owner</p>
              <div className="wallet-list border p-2 rounded max-h-48 overflow-auto">
                {userWallets.map((wallet) => (
                  <div
                    key={wallet.walletAddress}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleWalletSelect(wallet.walletAddress)}
                  >
                    {wallet.walletAddress}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-white">Selected Wallet: {selectedWallet || 'None'}</p>
              <p className="mt-2 text-white">Balance: {walletBalance}</p>
            </div>
          </div>
        </div>
      ) : (
        <div id="confirmationView">
          <h2 className="text-lg font-bold">Review Details</h2>
          <div className="form-group">
            <div className="p-2 border rounded mb-2">
              <span>Network: {networks.find((network) => network._id === selectedNetworkId)?.name}</span>
            </div>
            <div className="p-2 border rounded mb-2">
              <span>Owner Wallet: {selectedWallet}</span>
            </div>
            <div className="p-2 border rounded mb-2">
              <span>Token Name: {tokenName}</span>
            </div>
            <div className="p-2 border rounded mb-2">
              <span>Token Symbol: {tokenSymbol}</span>
            </div>
            <div className="p-2 border rounded mb-2">
              <span>Total Supply: {tokenSupply}</span>
            </div>
            <div className="p-2 border rounded mb-2">
              <span>Decimals: {tokenDecimal}</span>
            </div>
          </div>
        </div>
      )}

      {/* Telegram WebApp Main Button Action */}
      <div className="mt-4">
        <button className="bg-btn mt-4 w-full rounded-md text-center px-4 py-2 font-semibold text-white" onClick={toggleConfirmationView}>
          {isConfirmationMode ? 'Go Back' : 'Continue'}
        </button>
      </div>
      <Footer/>
    </div>
  );
};

export default CreateToken;
