'use client'

import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    Flex,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    useDisclosure,
    Text,
} from '@chakra-ui/react'
import { signIn, useSession } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useConnect, useSignMessage } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useState } from 'react'
import ClientOnly from './Utils/ClientOnly'

export type SignInCardProps = {}

const SignInCard = ({}: SignInCardProps) => {
    const { signMessageAsync } = useSignMessage()
    const { address, isConnected } = useAccount()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { data: session, status } = useSession()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleLogin = async () => {
        setIsLoading(true)
        try {
            console.log('test')
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
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ClientOnly>
            <Card maxW="md">
                <CardHeader>
                    <Flex>
                        <Flex
                            flex="1"
                            gap="4"
                            alignItems="center"
                            flexWrap="wrap"
                        >
                            <Box>
                                {isConnected ? (
                                    <Heading size="sm">
                                        Welcome,{' '}
                                        {address!.substring(
                                            0,
                                            Math.min(6, address!.length)
                                        )}
                                    </Heading>
                                ) : (
                                    <Heading size="sm">
                                        Welcome Degen, connect your wallet to
                                        begin
                                    </Heading>
                                )}
                            </Box>
                        </Flex>
                    </Flex>
                </CardHeader>
                <CardBody>
                    <Center>
                        <Stack>
                            {isConnected ? (
                                <>
                                    <Text>
                                        UpOnly is a secure, transparent and
                                        accessible donation platform built on
                                        top of Circle and USDC.
                                    </Text>
                                    <br></br>
                                    <Text>
                                        Sign in or create an account with UpOnly
                                        to begin karma farming now.
                                    </Text>
                                    <br></br>
                                    <Button
                                        isLoading={isLoading}
                                        colorScheme="green"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleLogin()
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        colorScheme="purple"
                                        onClick={onOpen}
                                    >
                                        Connect Wallet
                                    </Button>
                                    <Modal isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>
                                                Choose wallet
                                            </ModalHeader>
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
                        </Stack>
                    </Center>
                    {!session ? <></> : <div>You are signed in</div>}
                </CardBody>
            </Card>
        </ClientOnly>
    )
}

export default SignInCard
