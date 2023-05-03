import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { Circle, CircleEnvironments, Ping, Rate } from '@circle-fin/circle-sdk'
import React, { useEffect, useState } from 'react'
import { Button, SimpleGrid, Stack } from '@chakra-ui/react'
import { circleObject } from '@/server/constants'
import dynamic from 'next/dynamic'

const ProfileCard = dynamic(() => import('../components/Profile/ProfileCard'), {
    ssr: false,
})

type HOMEProps = {
    rates: {
        ethUSD: Rate
        btcUSD: Rate
    }
}

export default function Home({ rates: { ethUSD, btcUSD } }: HOMEProps) {
    const [response, setResponse] = useState<string>('')

    const onClick = async (event: React.MouseEvent) => {
        event.preventDefault()
        const response = (await (await fetch('./api/ping')).json()) as Ping
        setResponse(response.message)
    }

    const test = (
        <Button onClick={onClick}>test circle sandbox connection</Button>
    )

    return (
        <>
            <main className={styles.main}>
                <div className={styles.center}>
                    <Stack direction="column">
                        <ProfileCard />
                    </Stack>
                </div>
            </main>
        </>
    )
}

async function fetchExchangeRate(pair: 'ETH-USD' | 'BTC-USD') {
    return await circleObject.cryptoExchangeRates.getExchangeRates(pair)
}

async function resolveBTCUSD() {
    const response = await fetchExchangeRate('BTC-USD')
    const { data } = response
    return data.data
}

async function resolveETHUSD() {
    const response = await fetchExchangeRate('ETH-USD')
    const { data } = response
    return data.data
}

export async function getServerSideProps({}) {
    const [btcUSD, ethUSD] = await Promise.all([
        await resolveBTCUSD(),
        await resolveETHUSD(),
    ])

    return {
        props: {
            rates: {
                btcUSD,
                ethUSD,
            },
        },
    }
}
