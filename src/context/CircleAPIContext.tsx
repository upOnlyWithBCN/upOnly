import { Circle } from '@circle-fin/circle-sdk'
import { createContext, ReactNode, useState } from 'react'
import { CircleAPIContext } from './constants'

export const CircleContext = createContext<CircleAPIContext>({
    circleInstance: null,
    setCircleInstance: () => {},
})

export default function CircleAPIContext({
    children,
}: {
    children: ReactNode
}) {
    const [circleInstance, setCircleInstance] = useState<Circle | null>(null)

    return (
        <CircleContext.Provider
            value={{
                circleInstance: circleInstance,
                setCircleInstance: setCircleInstance,
            }}
        >
            {children}
        </CircleContext.Provider>
    )
}
