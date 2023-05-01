import { useContext } from 'react'
import { CircleContext } from './CircleAPIContext'

export default function useCircleAPIContext() {
    const { circleInstance, setCircleInstance } = useContext(CircleContext)

    return {
        circleInstance,
        setCircleInstance,
    }
}
