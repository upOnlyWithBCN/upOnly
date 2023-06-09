import { circleObject } from '@/server/constants';
import styles from '@/styles/Home.module.css';
import {
    Button
} from '@chakra-ui/react';
import { Ping, Rate } from '@circle-fin/circle-sdk';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const ProfileCard = dynamic(() => import('../components/Profile/ProfileCard'), {
    ssr: false,
});

const SignInCard = dynamic(() => import('../components/SignInCard'), {
    ssr: false,
});

const ProjectsView = dynamic(
    () => import('../components/Projects/ProjectsView'),
    {
        ssr: false,
    }
);

type HOMEProps = {
    rates: {
        ethUSD: Rate;
        btcUSD: Rate;
    };
};

export default function Home({ rates: { ethUSD, btcUSD } }: HOMEProps) {
    const { data: session, status, update } = useSession();
    const [response, setResponse] = useState<string>('');

    const onClick = async (event: React.MouseEvent) => {
        event.preventDefault();
        const response = (await (await fetch('./api/ping')).json()) as Ping;
        setResponse(response.message);
    };

    const test = (
        <Button onClick={onClick}>test circle sandbox connection</Button>
    );

    return (
        <>
            <main className={styles.main}>
                <ProjectsView />
            </main>
        </>
    );
}

async function fetchExchangeRate(pair: 'ETH-USD' | 'BTC-USD') {
    return await circleObject.cryptoExchangeRates.getExchangeRates(pair);
}

async function resolveBTCUSD() {
    const response = await fetchExchangeRate('BTC-USD');
    const { data } = response;
    return data.data;
}

async function resolveETHUSD() {
    const response = await fetchExchangeRate('ETH-USD');
    const { data } = response;
    return data.data;
}

export async function getServerSideProps({ }) {
    const [btcUSD, ethUSD] = await Promise.all([
        await resolveBTCUSD(),
        await resolveETHUSD(),
    ]);

    return {
        props: {
            rates: {
                btcUSD,
                ethUSD,
            },
        },
    };
}
