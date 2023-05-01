import detectEthereumProvider from '@metamask/detect-provider'
import { useContext, useEffect, useState } from 'react'
import { CONNECTION_STATE, INITIAL_STATE, LOCAL_STATE_KEY } from './constants'
import { getChainID, disconnectWindowMM, personalSign, getCurrentAccount } from './metamask'
import { Web3CT } from './Web3Context'

export function useWeb3Context() {
    //TODO: implement read from cache
    const { web3State, setWeb3State } = useContext(Web3CT)

    useEffect(() => {
        const handleChainChanged = () => {
            return window.location.reload()
        }
        // register listeners
        window.ethereum.on('chainChanged', handleChainChanged)
        return () => {
            window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
    }, [])

    useEffect(() => {
        const handleAccountsChanged = (accounts: Array<string>) => {
            if (accounts.length === 0) {
                console.log('Please connect to MetaMask.')
            }
            if (accounts[0] !== web3State.currentAccount) {
                setWeb3State({
                    ...web3State,
                    currentAccount: accounts[0],
                })
            }
        }

        // register listeners
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        return () => {
            window.ethereum.removeListener(
                'chainChanged',
                handleAccountsChanged
            )
        }
    }, [setWeb3State, web3State])

    const setDataFromWindowMM = async () => {
        const newAccount = await getCurrentAccount()
        const chainID = await getChainID()
        setWeb3State({
            chainID: chainID,
            connectionState: CONNECTION_STATE.CONNECTED,
            currentAccount: newAccount,
        })
    }

    const signInUsingMM = async () => {
        const currentAccount = await getCurrentAccount()
        const resultHash =  await personalSign(currentAccount);
        //TODO: we need to authenticate this with our backend ?
        await setDataFromWindowMM();
    }

    /**
     * Expose functions here
     */

    const connectFromWindowMM = async () => {
        const provider = await detectEthereumProvider()
        if (provider) {
            // sign in 
            await signInUsingMM();
        } else {
            console.error('metamask not installed')
        }
    }

    const disconnectFromWindowMM = async () => {
        await disconnectWindowMM()
        setWeb3State(INITIAL_STATE)
    }

    return {
        web3State,
        connectFromWindowMM,
        disconnectFromWindowMM,
    }
}
