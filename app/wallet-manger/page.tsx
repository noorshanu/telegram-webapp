"use client"
import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Footer } from '../../components/Footer';

// Define types for Wallet and Wallet Response
interface Wallet {
  walletAddress: string;
  balance?: string;
  privateKey?: string;
}

interface WalletsResponse {
  walletDetails: Wallet[];
  total: number;
}

const WalletManager: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const tg = WebApp;

  useEffect(() => {
    // Initialize Telegram Web App and get user ID from URL
    tg.ready();
    tg.expand();
    const userIdFromUrl = new URLSearchParams(window.location.search).get('userid');
    setUserId(userIdFromUrl);
    
    // Set up Telegram main button
    tg.MainButton.setParams({
      text: 'Create Wallet',
      is_visible: true,
      is_active: true,
    });

    // Load wallets when component mounts
    if (userIdFromUrl) {
      fetchWallets(userIdFromUrl);
    }
  }, [tg]);

  // Fetch user wallets and register if needed
  const fetchWallets = async (userId: string) => {
    try {
      setLoading(true);

      // Register user if needed
      await axios.post('https://api-tg.blocktools.ai/auth/register', { userId });

      // Fetch wallets
      const walletResponse = await axios.post<WalletsResponse>(
        'https://api-tg.blocktools.ai/wallet/list-wallets',
        { userId }
      );

      const { walletDetails, total } = walletResponse.data;

      if (total === 0) {
        setWallets([]);
      } else {
        setWallets(walletDetails);
      }

    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new wallet
  const createWallet = async () => {
    try {
      await axios.post('https://api-tg.blocktools.ai/wallet/create-worker-wallet', { userId });
      fetchWallets(userId as string); // Refresh the wallet list after creating a wallet
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  // Handle wallet selection
  const handleWalletClick = (wallet: Wallet) => {
    const { walletAddress, balance = 'loading', privateKey = '' } = wallet;
    const url = `/walletinfo?address=${walletAddress}&balance=${balance}&privateKey=${privateKey}&userid=${userId}`;
    window.location.href = url;
  };

  // Format wallet address (shortened)
  const formatAddress = (address: string) => {
    const start = address.slice(0, 8);
    const end = address.slice(-6);
    return `${start}....${end}`;
  };

  return (
    <div className="min-h-screen  p-4">
        <Navbar/>
      <h1 className="text-lg font-bold mb-4">Wallets Manager</h1>

      {loading ? (
        <p>Loading wallets...</p>
      ) : wallets.length === 0 ? (
        <p>No wallets found.</p>
      ) : (
        <div className="wallet-list space-y-4">
          {wallets.map((wallet, index) => (
            <div
              key={index}
              className="wallet-row flex justify-between items-center p-4 border-b cursor-pointer"
              onClick={() => handleWalletClick(wallet)}
            >
              <span className="wallet-address">{formatAddress(wallet.walletAddress)}</span>
            </div>
          ))}
        </div>
      )}

      <button
        className="create-wallet-button fixed bottom-4 left-4 right-4 bg-btn mt-4  rounded-md text-center px-4 py-2 font-semibold text-white"
        onClick={createWallet}
      >
        Create Wallet
      </button>
    <Footer/>
    </div>
  );
};

export default WalletManager;
