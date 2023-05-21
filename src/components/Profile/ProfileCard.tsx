import {
    signUpWithCircle,
    getUserBalance,
    createPaymentIntent,
} from '@/server/actions'
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
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Spacer,
    Input,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useState, useEffect, FormEvent } from 'react'
import { erc20ABI, useAccount, useContract, useNetwork, useToken } from 'wagmi'
import { useDebounce } from 'use-debounce'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import { utils } from 'ethers/lib/ethers'
import { Hex, parseGwei } from 'viem'

export type ProfileCardProps = {}

const ProfileCard = ({}: ProfileCardProps) => {
    const { address, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [userUsdBalance, setUserUsdBalance] = useState<Number>(0)

    const [topUpAmount, setTopUpAmount] = useState<string>('0')
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)

    const [debouncedAmount] = useDebounce(topUpAmount, 500)

    const { config } = usePrepareContractWrite({
        address: '0x5425890298aed601595a70AB815c96711a31Bc65',
        abi: erc20ABI,
        functionName: 'transfer',
        args: [
            session?.deposit_wallet.deposit_wallet_address as Hex,
            utils.parseUnits(debouncedAmount, 6),
        ],
    })

    const { write } = useContractWrite(config)

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

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsButtonLoading(true)
        try {
            write?.()
        } catch (err) {
            console.log(err)
        } finally {
            setIsButtonLoading(false)
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
                                USD: ${userUsdBalance?.toString()}
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
                        <form onSubmit={onSubmit}>
                            <NumberInput
                                min={0}
                                precision={2}
                                step={0.2}
                                value={topUpAmount}
                                onChange={(value) => {
                                    if (!value) {
                                        setTopUpAmount(value + '')
                                    } else {
                                        setTopUpAmount(value ?? 0)
                                    }
                                }}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <br />
                            <Stat>
                                <StatHelpText>
                                    Make sure the amount is less than your
                                    current USDC in wallet
                                </StatHelpText>
                            </Stat>
                            <Button
                                isLoading={isButtonLoading}
                                type="submit"
                                size="md"
                            >
                                Top up Circle wallet with USDC
                            </Button>
                        </form>
                    </Stack>
                )}
            </CardBody>
        </Card>
    )
}

export default ProfileCard
