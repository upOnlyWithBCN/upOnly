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
    Spacer,
    Stack,
    useColorMode,
    useDisclosure,
    ButtonGroup,
} from '@chakra-ui/react'
import { getUserBalance } from '@/server/actions'
import { SiweMessage } from 'siwe'
import styles from './navbar.module.css'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { getCsrfToken, useSession, signOut, signIn } from 'next-auth/react'
import {
    useAccount,
    useConnect,
    useDisconnect,
    useNetwork,
    useSignMessage,
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { avalanche, bsc, mainnet } from '@wagmi/core/chains'
import { CgHome, CgProfile } from 'react-icons/cg'
import NextLink from 'next/link'
import { useState, useEffect } from 'react'
import { Router } from 'next/router'

export type navbarProps = {}

const Navbar = (props: navbarProps) => {
    const { signMessageAsync } = useSignMessage()
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { chain, chains } = useNetwork()
    const { disconnect } = useDisconnect()
    const { data: session, status, update } = useSession()

    // const [isLoading, setIsLoading] = useState<boolean>(false)
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [userUsdBalance, setUserUsdBalance] = useState<Number>(0)

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                const userUsdBalanceRes = await getUserBalance()
                console.log('user request', userUsdBalanceRes)
                setUserUsdBalance(userUsdBalanceRes)
            }
        }
        fetchData()
    }, [session])

    const handleLogin = async () => {
        try {
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
                address: address,
                message: JSON.stringify(message),
                redirect: false,
                signature,
                callbackUrl,
            })
        } catch (error) {
            window.alert(error)
        }
    }

    //MetaMask does not support programmatic disconnect. This flag simulates the disconnect behavior by keeping track of connection status in storage.
    const disconnectButtonAndSignInButton = (
        <ButtonGroup>
            <Button colorScheme="red" onClick={() => disconnect()}>
                Disconnect Wallet
            </Button>
            <Button
                colorScheme="green"
                onClick={(e) => {
                    e.preventDefault()
                    // disconnect()
                    handleLogin()
                }}
            >
                Sign In
            </Button>
        </ButtonGroup>
    )

    const signoutButton = (
        <Button
            colorScheme="red"
            onClick={(e) => {
                e.preventDefault()
                signOut()
            }}
        >
            Sign Out
        </Button>
    )

    const connectionAccountBadge = isConnected ? (
        <Badge colorScheme={'green'}>
            {address?.substring(0, Math.min(6, address!.length))}
        </Badge>
    ) : (
        <Badge colorScheme={'red'}>{'Not Connected'}</Badge>
    )

    const chainBadge = (
        <Badge colorScheme={'green'}>
            {chain == undefined ? '' : chain!.name}
        </Badge>
    )

    const balanceBadge = !session ? (
        <Badge colorScheme={'red'}>Not Signed In</Badge>
    ) : (
        <Badge colorScheme={'green'}>{'$' + userUsdBalance?.toString()}</Badge>
    )

    return (
        <div className={styles.container}>
            <IconButton
                aria-label={'Color mode toggle'}
                icon={colorMode === 'dark' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
            />
            {isConnected ? (
                !session ? (
                    disconnectButtonAndSignInButton
                ) : (
                    signoutButton
                )
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
                                            connect()
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
            <Stack direction="column" justifyContent={'center'}>
                {chainBadge}
            </Stack>
            <Spacer></Spacer>
            <NextLink href="/" passHref>
                <IconButton aria-label="Home" icon={<CgHome size={28} />} />
            </NextLink>
            <Stack direction="column" justifyContent={'center'}>
                {balanceBadge}
            </Stack>
            <NextLink href="/projects/create" passHref>
                <Button colorScheme="green">Create Project</Button>
            </NextLink>
            <NextLink href="/profile" passHref>
                <IconButton
                    aria-label="Profile"
                    icon={<CgProfile size={28} />}
                />
            </NextLink>
        </div>
    )
}

export default Navbar
