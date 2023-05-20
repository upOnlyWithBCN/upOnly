import { signUpWithCircle, getUserBalance } from '@/server/actions'
import styles from '@/styles/Profile.module.css'
import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    Stack,
    StackDivider,
    Stat,
    StatHelpText,
    StatLabel,
    Text,
    IconButton,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { MdModeEditOutline } from 'react-icons/md'

export type ProfileCardProps = {}

const ProfileCard = ({}: ProfileCardProps) => {
    const { address, isConnected } = useAccount()
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [userUsdBalance, setUserUsdBalance] = useState<Number>(0)

    useEffect(() => {
        const fetchData = async () => {
            const userUsdBalanceRes = await getUserBalance()
            setUserUsdBalance(userUsdBalanceRes)
        }
        fetchData()
    }, [])

    const onClick = async () => {
        setIsLoading(true)
        try {
            await signUpWithCircle(address!)
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Card maxW="md">
            <CardHeader>
                <Flex>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                        <Avatar
                            name="Segun Adebayo"
                            src="https://bit.ly/sage-adebayo"
                        />
                        <Box>
                            <Heading size="sm">
                                Welcome,
                                {' ' +
                                    session?.name.substring(
                                        0,
                                        Math.min(6, address!.length)
                                    )}
                            </Heading>
                        </Box>
                    </Flex>
                </Flex>
            </CardHeader>
            <CardBody>
                {session?.deposit_wallet == null ? (
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
                            <StatLabel>Balances</StatLabel>
                            <StatHelpText>
                                USD: ${userUsdBalance.toString()}
                            </StatHelpText>
                        </Stat>
                        <Stat>
                            <StatLabel>Blockchain Address</StatLabel>
                            <StatHelpText>{session.address}</StatHelpText>
                        </Stat>
                        <Stat>
                            <StatLabel>Circle Wallet Address</StatLabel>
                            <StatHelpText>
                                {session.deposit_wallet?.deposit_wallet_address}
                            </StatHelpText>
                        </Stat>
                        <Stat>
                            <StatLabel>Circle Wallet ID</StatLabel>
                            <StatHelpText>
                                {session.deposit_wallet?.deposit_wallet_id}
                            </StatHelpText>
                        </Stat>
                        <Text></Text>
                    </Stack>
                )}
            </CardBody>
        </Card>
    )
}

export default ProfileCard
