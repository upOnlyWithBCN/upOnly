import detectEthereumProvider from '@metamask/detect-provider'
import { useContext, useEffect, useState } from 'react'
import { CONNECTION_STATE, INITIAL_STATE, LOCAL_STATE_KEY } from './constants'
import {
    getChainID,
    disconnectWindowMM,
    personalSign,
    getCurrentAccount,
} from './metamask'
import { Web3CT } from './Web3Context'
import { fetchUserDataFromPrisma } from '@/server/actions'
import { watchAccount } from '@wagmi/core'
import { getCsrfToken, useSession, signOut } from 'next-auth/react'

// I think can remove, not sure what to do with managing change in chain / account
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

    const setDataFromWindowMM = async (currentAccount: string) => {
        const newAccount = await getCurrentAccount()
        const chainID = await getChainID()
        const { user } = await fetchUserDataFromPrisma(currentAccount)
        setWeb3State({
            chainID: chainID,
            connectionState: CONNECTION_STATE.CONNECTED,
            currentAccount: newAccount,
            user,
        })
    }

    const signInUsingMM = async () => {
        const currentAccount = await getCurrentAccount()
        const resultHash = await personalSign(currentAccount)
        //TODO: we need to authenticate this with our backend ?
        await setDataFromWindowMM(currentAccount)
    }

    /**
     * Expose functions here
     */

    const connectFromWindowMM = async () => {
        const provider = await detectEthereumProvider()
        if (provider) {
            // sign in
            await signInUsingMM()
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
        setDataFromWindowMM,
    }
}
