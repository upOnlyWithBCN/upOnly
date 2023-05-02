import { UserData } from '@/pages/api/user/[address]'
import { Circle } from '@circle-fin/circle-sdk'
import { Deposit_wallet, User } from '@prisma/client'
import { Dispatch, SetStateAction } from 'react'
export enum CONNECTION_STATE {
    CONNECTED = 'connected',
    NOT_CONNECTED = 'not connected',
}

export const LOCAL_STATE_KEY = 'localUserData'

export type Web3State = {
    connectionState: CONNECTION_STATE
    currentAccount: string
    chainID: number
    user:
        | (User & {
              deposit_wallet: Deposit_wallet | null
          })
        | null
}

export const INITIAL_STATE = {
    connectionState: CONNECTION_STATE.NOT_CONNECTED,
    chainID: 0,
    currentAccount: '',
    user: null,
}

export type Web3Context = {
    web3State: Web3State
    setWeb3State: Dispatch<SetStateAction<Web3State>>
}

/**
 * Circle
 */
export type CircleAPIContext = {
    circleInstance: Circle | null
    setCircleInstance: Dispatch<SetStateAction<Circle | null>>
}
