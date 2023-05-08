import { CONNECTION_STATE } from '@/context/constants'
import { useWeb3Context } from '@/context/useWeb3Context'
import { signUpWithCircle } from '@/server/actions'
import { getCsrfToken, signIn, useSession, signOut } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import {
    useAccount,
    useConnect,
    useNetwork,
    useSignMessage,
    useDisconnect,
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import {
    Card,
    CardHeader,
    Flex,
    Heading,
    CardBody,
    Button,
    Box,
    Stack,
    Center,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from '@chakra-ui/react'
import { useState } from 'react'

export type SignInCardProps = {}

const SignInCard = ({}: SignInCardProps) => {
    const { signMessageAsync } = useSignMessage()
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { data: session, status } = useSession()
    const { isOpen, onOpen, onClose } = useDisclosure()
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
                message: JSON.stringify(message),
                redirect: false,
                signature,
                callbackUrl,
            })
        } catch (error) {
            window.alert(error)
        }
    }

    return (
        <Card maxW="md">
            <CardHeader>
                <Flex>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                        <Box>
                            {isConnected ? (
                                <Heading size="sm">
                                    Welcome,{' '}
                                    {address!.substring(
                                        0,
                                        Math.min(6, address!.length)
                                    )}{' '}
                                    sign in to UpOnly
                                </Heading>
                            ) : (
                                <Heading size="sm">
                                    Welcome Degen, connect your wallet to begin
                                </Heading>
                            )}
                        </Box>
                    </Flex>
                </Flex>
            </CardHeader>
            <CardBody>
                <Center>
                    {isConnected ? (
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
                </Center>
                {!session ? '' : <div>You are signed in</div>}
                {/* {user == null ? (
                    <>
                        <Text>
                            Looks like you havent signed up with up only
                        </Text>
                        <br />
                        <Button
                            isLoading={isLoading}
                            colorScheme="green"
                            onClick={onClick}
                        >
                            Create your upOnly wallet with us!
                        </Button>
                    </>
                ) : (
                    <Stack divider={<StackDivider />} spacing="4">
                        <Stat>
                            <StatLabel>Your Current Wallet address</StatLabel>
                            <StatHelpText>{currentAccount}</StatHelpText>
                        </Stat>
                        <Stat>
                            <StatLabel>Circle Wallet address</StatLabel>
                            <StatHelpText>
                                {user.deposit_wallet?.deposit_wallet_address}
                            </StatHelpText>
                        </Stat>
                        <Stat>
                            <StatLabel>Circle Wallet ID</StatLabel>
                            <StatHelpText>
                                {user.deposit_wallet?.deposit_wallet_id}
                            </StatHelpText>
                        </Stat>
                        <Stat>
                            <StatLabel>Circle User ID</StatLabel>
                            <StatHelpText>{user.id}</StatHelpText>
                        </Stat>
                        <Text></Text>
                    </Stack>
                )} */}
            </CardBody>
        </Card>
    )
}

export default SignInCard