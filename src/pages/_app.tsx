import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, ThemeConfig, extendTheme } from '@chakra-ui/react'
import theme from '@/styles/theme'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'
import Web3Network from '@/context/Web3Context'
import CircleAPIContext from '@/context/CircleAPIContext'

const ClientNavbar = dynamic(() => import('../components/Navbar'), {
    ssr: false,
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <Web3Network>
                <CircleAPIContext>
                    <ClientNavbar />
                    <Component {...pageProps} />
                    <Footer />
                </CircleAPIContext>
            </Web3Network>
        </ChakraProvider>
    )
}
