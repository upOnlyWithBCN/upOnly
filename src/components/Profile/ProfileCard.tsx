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
} from '@chakra-ui/react'

export type ProfileCardProps = {}

const ProfileCard = ({}: ProfileCardProps) => {
    const { web3State, setDataFromWindowMM } = useWeb3Context()
    const { connectionState, currentAccount, user } = web3State

    const onClick = async () => {
        const { message } = await signUpWithCircle(currentAccount)
        console.log(message)
        setDataFromWindowMM(currentAccount)
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
                            <Heading size="sm">{currentAccount}</Heading>
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
                        <Button onClick={onClick}>
                            create deposit wallet with us!
                        </Button>
                    </>
                ) : (
                    <Text>Your circle wallet address: {user.address}</Text>
                )}
            </CardBody>
            <Image
                objectFit="cover"
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="Chakra UI"
            />

            <CardFooter
                justify="space-between"
                flexWrap="wrap"
                sx={{
                    '& > button': {
                        minW: '136px',
                    },
                }}
            ></CardFooter>
        </Card>
    )
}

export default ProfileCard
