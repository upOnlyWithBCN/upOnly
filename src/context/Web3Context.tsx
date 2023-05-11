import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import {
    Web3State,
    INITIAL_STATE,
    Web3Context,
    LOCAL_STATE_KEY,
} from './constants'
;('use client')

export const Web3CT = createContext<Web3Context>({
    web3State: INITIAL_STATE,
    setWeb3State: () => {},
})

// I think can remove
export default function Web3Network({
    children,
}: {
    children: React.ReactNode
}) {
    const getInitialState = useCallback(() => {
        if (typeof window !== 'undefined') {
            const userData = window.localStorage.getItem(LOCAL_STATE_KEY)
            if (userData !== null) {
                return JSON.parse(userData)
            }
        }
        return INITIAL_STATE
    }, [])

    const [web3State, setWeb3State] = useState<Web3State>(getInitialState)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(
                LOCAL_STATE_KEY,
                JSON.stringify(web3State)
            )
        }
    }, [web3State])

    return (
        <Web3CT.Provider
            value={{
                web3State: web3State,
                setWeb3State: setWeb3State,
            }}
        >
            {children}
        </Web3CT.Provider>
    )
}
