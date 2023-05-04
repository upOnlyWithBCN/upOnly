import {
    Badge,
    Button,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    useColorMode,
    useDisclosure,
} from '@chakra-ui/react'
import styles from './navbar.module.css'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useWeb3Context } from '@/context/useWeb3Context'
import { useState, useEffect } from 'react'
import { isUserConnected } from '@/context/utils'
import { getCsrfToken, signIn, useSession } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export type navbarProps = {}

const Navbar = (props: navbarProps) => {
    const { signMessageAsync } = useSignMessage()
    const { chain } = useNetwork()
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { data: session, status } = useSession()
    const handleLogin = async () => {
        try {
            console.log('testint')
            const callbackUrl = '/protected'
            const message = new SiweMessage({
                domain: window.location.host,
                address: address,
                statement: 'Sign in with Ethereum to the app.',
                uri: window.location.origin,
                version: '1',
            })
            const signature = await signMessageAsync({
                message: message.prepareMessage(),
            })
            signIn('credentials', {
                message: JSON.stringify(message),
                redirect: false,
                signature,
                callbackUrl,
            })
        } catch (error) {
            window.alert(error)
        }
    }

    useEffect(() => {
        console.log(isConnected)
        if (isConnected && !session) {
            handleLogin()
        }
    }, [isConnected])

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { web3State, connectFromWindowMM, disconnectFromWindowMM } =
        useWeb3Context()
    const { connectionState, currentAccount, chainID } = web3State

    const connectMetaMask = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            await connectFromWindowMM()
        } catch (e) {
            console.error(e)
            //TODO: handle error gracefully
        } finally {
            setIsLoading(false)
        }
    }

    const disconnectMetamask = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        await disconnectFromWindowMM()
    }

    const disconnectButton = (
        <Button colorScheme="red" onClick={disconnectMetamask}>
            Disconnect Wallet
        </Button>
    )

    const connectionAccountBadge = isUserConnected(connectionState) ? (
        <Badge colorScheme={'green'}>
            {currentAccount.substring(0, Math.min(4, currentAccount.length))}
        </Badge>
    ) : (
        <Badge colorScheme={'red'}>{'Not Connected'}</Badge>
    )

    return (
        <div className={styles.container}>
            <IconButton
                aria-label={'Color mode toggle'}
                icon={colorMode === 'dark' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
            />

            {isUserConnected(connectionState) ? (
                disconnectButton
            ) : (
                <>
                    <Button colorScheme="purple" onClick={onOpen}>
                        Connect Wallet
                    </Button>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Choose wallet</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Stack spacing={3}>
                                    <Button
                                        colorScheme="purple"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (!isConnected) {
                                                connect()
                                            } else {
                                                handleLogin()
                                            }
                                        }}
                                    >
                                        Metamask
                                    </Button>
                                </Stack>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    colorScheme="blue"
                                    mr={3}
                                    onClick={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            )}
            <Stack direction="column" justifyContent={'center'}>
                {connectionAccountBadge}
            </Stack>
        </div>
    )
}

// not needed?
export async function getServerSideProps(context: any) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}

export default Navbar
