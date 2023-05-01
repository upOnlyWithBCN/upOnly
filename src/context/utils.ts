import { CONNECTION_STATE } from './constants'

export const isUserConnected = (status: CONNECTION_STATE) => {
    return status === CONNECTION_STATE.CONNECTED
}
