// This function detects most providers injected at window.ethereum.
import detectEthereumProvider from '@metamask/detect-provider'
import { m } from 'framer-motion'

export async function detectProvider() {
    const provider = await detectEthereumProvider()
    if (provider !== window.ethereum) {
        console.log('Please install MetaMask!')
    }
}

export function isConnected() {
    return window.ethereum.isConnected()
}

export function isMetaMask() {
    return window.ethereum.isMetaMask()
}

export async function getChainID() {
    return await window.ethereum.request({
        method: 'eth_chainId',
    })
}

export async function disconnectWindowMM() {
    return await window.ethereum.request({
        method: 'eth_accounts',
        params: [
            {
                eth_accounts: {},
            },
        ],
    })
}

export async function getCurrentAccount() {
    try {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        })
        return accounts[0]
    } catch (e) {
        console.error(e)
        return ''
    }
}
// https://docs.metamask.io/wallet/how-to/sign-data#use-personal_sign
export async function personalSign(address: string) {
    try {
       const msg = `0x${Buffer.from('LOGIN TO UP ONLY', 'utf8').toString('hex')}`;
       const res = await window.ethereum.request({
        method: 'personal_sign',
        params: [
            msg,
            address,
            'This is a password'
         
        ],
       }) 
       return res;
    } catch (e)  {
        console.error(e);
        return '';
    }
}
