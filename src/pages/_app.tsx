import CircleAPIContext from '@/context/CircleAPIContext';
import '@/styles/globals.css';
import theme from '@/styles/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { avalancheFuji } from '@wagmi/core/chains';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const ClientNavbar = dynamic(() => import('../components/Navbar/Navbar'), {
    ssr: false,
});

export const { chains, provider } = configureChains(
    [avalancheFuji],
    [publicProvider()]
);

const client = createClient({
    autoConnect: true,
    provider,
});

export default function App({
    Component,
    pageProps,
}: AppProps<{ session: Session; }>) {
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
                    </CircleAPIContext>
                </SessionProvider>
            </WagmiConfig>
        </ChakraProvider>
    );
}
