import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, ThemeConfig, extendTheme } from '@chakra-ui/react'
import theme from '@/styles/theme'
import Footer from '@/components/Footer/Footer'
import dynamic from 'next/dynamic'
import Web3Network from '@/context/Web3Context'
import CircleAPIContext from '@/context/CircleAPIContext'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { avalancheFuji } from '@wagmi/core/chains'
import { publicProvider } from 'wagmi/providers/public'

const ClientNavbar = dynamic(() => import('../components/Navbar/Navbar'), {
    ssr: false,
})

export const { chains, provider } = configureChains(
    [avalancheFuji],
    [publicProvider()]
)

const client = createClient({
    autoConnect: true,
    provider,
})

export default function App({
    Component,
    pageProps,
}: AppProps<{ session: Session }>) {
    return (
        <ChakraProvider theme={theme}>
            <WagmiConfig client={client}>
                <SessionProvider
                    session={pageProps.session}
                    refetchInterval={0}
                >
                    <CircleAPIContext>
                        <ClientNavbar />
                        <Component {...pageProps} />
                        <Footer />
                    </CircleAPIContext>
                </SessionProvider>
            </WagmiConfig>
        </ChakraProvider>
    )
}
