import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider'

interface IUseMetaMask {
    connect: () => void
    account: string | null
}

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.INFURA_ID
        }
    }
}

const MetaMaskContext = createContext<IUseMetaMask | undefined>(undefined);

export const MetaMaskProvider: React.FC = ({children}) => {

    const [account, setAccount] = useState<string | null>(null);

    const connect = async () => {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: false,
            providerOptions,
        });

        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
    }

    useEffect(() => {
        if(account) {
            console.log('success', account);
        }
    }, [account])

    return (
        <MetaMaskContext.Provider value={{connect, account}}>
            {children}
        </MetaMaskContext.Provider>
    )

}

export const useMetaMask = () => {
    const context = useContext(MetaMaskContext);

    if(context === undefined) {
        throw new Error('useCount must be used within a CountProvider')
    }

    return context;
}