// This function detects most providers injected at window.ethereum.
import detectEthereumProvider from '@metamask/detect-provider'

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

export async function getAccounts() {
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
