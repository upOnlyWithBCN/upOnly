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
import { useState } from 'react'
import { isUserConnected } from '@/context/utils'
export type navbarProps = {}

const Navbar = (props: navbarProps) => {
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
                                            connectMetaMask(e)
                                            onClose()
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

export default Navbar
