import {
    createWalletClient,
    http,
    Hex,
    createPublicClient,
    stringToHex,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { avalancheFuji } from 'viem/chains'
const viemPublicClientInstance = () => {
    return createPublicClient({
        chain: avalancheFuji,
        transport: http(),
    })
}

export const viemPublicObject = viemPublicClientInstance()

const viemWalletClientInstance = () => {
    const account = privateKeyToAccount(
        process.env.ADMIN_WALLET_PRIVATE_KEY as Hex
    )
    return createWalletClient({
        account,
        chain: avalancheFuji,
        transport: http(),
    })
}

export const viemWalletObject = viemWalletClientInstance()
