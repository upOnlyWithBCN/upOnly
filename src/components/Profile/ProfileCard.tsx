import { CONNECTION_STATE } from '@/context/constants'
import { useWeb3Context } from '@/context/useWeb3Context'
import { signUpWithCircle } from '@/server/actions'
import {
    Card,
    CardHeader,
    Flex,
    Avatar,
    Heading,
    IconButton,
    CardBody,
    CardFooter,
    Button,
    Box,
    Text,
    Image,
    Divider,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StackDivider,
    Stack,
} from '@chakra-ui/react'
import { useState } from 'react'

export type ProfileCardProps = {}

const ProfileCard = ({}: ProfileCardProps) => {
    const { web3State, setDataFromWindowMM } = useWeb3Context()
    const { currentAccount, user } = web3State
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const onClick = async () => {
        setIsLoading(true)
        try {
            const { message } = await signUpWithCircle(currentAccount)
            console.log(message)
            setDataFromWindowMM(currentAccount)
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
                            <Heading size="sm">Welcome, user</Heading>
                            <Heading size="sm">Here are your details</Heading>
                        </Box>
                    </Flex>
                </Flex>
            </CardHeader>
            <CardBody>
                {user == null ? (
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
                )}
            </CardBody>
        </Card>
    )
}

export default ProfileCard
