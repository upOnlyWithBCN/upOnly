import { Circle, CircleEnvironments } from '@circle-fin/circle-sdk'
import { PrismaClient } from '@prisma/client'

const circleInstance = () => {
    const API_KEY = process.env.API_KEY ?? ''
    return new Circle(API_KEY, CircleEnvironments.sandbox)
}

export const circleObject = circleInstance()

export const isValidExchangePair = (pair: string): boolean => {
    switch (pair) {
        case 'ETH-USD':
        case 'BTC-USD':
        case 'FLOW-USD':
            return true
        default:
            return false
    }
}

export const returnExchangePair = (
    pair: string
): 'ETH-USD' | 'BTC-USD' | 'FLOW-USD' => {
    switch (pair) {
        case 'ETH-USD':
            return 'ETH-USD'
        case 'BTC-USD':
            return 'BTC-USD'
        case 'FLOW-USD':
            return 'FLOW-USD'
        default:
            return 'BTC-USD'
    }
}


const primsaInstance = () => {
    const client = new PrismaClient();
    return client;
}

export const prismaClient = primsaInstance();