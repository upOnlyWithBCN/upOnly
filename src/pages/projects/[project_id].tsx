import {
    endDonation,
    refundDonation,
    walletTransferToAddress,
} from '@/server/actions'
import {
    Badge,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    Heading,
    Image,
    NumberInput,
    NumberInputField,
    Stack,
    StackDivider,
    Stat,
    StatLabel,
    StatNumber,
    Text,
} from '@chakra-ui/react'
import { Prisma, User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getSingleProject } from '../api/projects/[project_id]'
import { WalletTransferToAddressReq } from '../api/wallet/transferToAddress'

type ProjectDetailPageProp = {
    project: {
        created_time: Date
        project_id: number
        smart_contract_address: string
        deposit_wallet_address: string
        deposit_wallet_id: string
        status: string
        project_details: string
        project_title: string
        completion_time: string
        goal_time: string
        targeted_amount: Prisma.Decimal
        raised_amount: Prisma.Decimal
        project_owners: Array<User>
    }
}
const displayDate = (createdDate: string) => {
    const date = new Date(createdDate)
    return date.toISOString()
}
export default function Page(props: ProjectDetailPageProp) {
    const router = useRouter()
    const { data: session } = useSession()
    const { project } = props
    const [donateAmount, setDonateAmount] = useState<string>('0')
    const [isEndDonationLoading, setIsEndDonationLoading] =
        useState<boolean>(false)
    const [isRefundDonationLoading, setIsRefundDonationLoading] =
        useState<boolean>(false)
    if (project === null) {
        return <></>
    }
    const {
        project_id,
        project_title,
        project_details,
        goal_time,
        completion_time,
        targeted_amount,
        raised_amount,
        status,
        deposit_wallet_address,
        smart_contract_address,
        project_owners,
    } = project

    let isOwner = false
    project_owners.forEach((user) => {
        if (user.id === parseInt(session?.userId ?? '0')) {
            isOwner = true
            return
        }
    })

    const handleEndDonation = async () => {
        setIsEndDonationLoading(true)
        try {
            await endDonation(project_id, smart_contract_address)
        } catch (err) {
            window.alert('failed to end')
        } finally {
            setIsEndDonationLoading(false)
        }
    }

    const handleRefundDonation = async () => {
        setIsRefundDonationLoading(true)
        try {
            await refundDonation(project_id, smart_contract_address)
        } catch (err) {
            window.alert('failed to refund')
        } finally {
            setIsRefundDonationLoading(false)
        }
    }

    const handleDonate = async () => {
        try {
            const req: WalletTransferToAddressReq = {
                amount: 0,
                blockchainAddress: '0xb933608c92Cc300F9B9248A905019cE8Aa9B4445',
            }
            await walletTransferToAddress(req)
        } catch (err) {
            window.alert('failed to donate')
        }
    }

    const donateButton = (
        <Button
            colorScheme="teal"
            variant="solid"
            onClick={(e) => {
                e.preventDefault()
                handleDonate()
            }}
        >
            Donate bro
        </Button>
    )

    const ownerButtons = (
        <ButtonGroup>
            <Button
                colorScheme="green"
                variant="solid"
                onClick={(e) => {
                    e.preventDefault()
                    handleEndDonation()
                }}
            >
                End Donation
            </Button>
            <Button
                colorScheme="red"
                variant="solid"
                onClick={(e) => {
                    e.preventDefault()
                    handleRefundDonation()
                }}
            >
                Refund Donation
            </Button>
        </ButtonGroup>
    )

    return (
        <Flex direction={'row'} justifyContent={'center'}>
            {' '}
            <Card maxW="lg" variant="filled">
                <CardHeader>
                    <Heading size="md">{project_title}</Heading>
                    <Badge
                        colorScheme={
                            project.status === 'FUNDING_COMPLETE'
                                ? 'green'
                                : project.status === 'FUNDING_FAILED'
                                ? 'red'
                                : 'yellow'
                        }
                    >
                        {project.status === 'FUNDING_COMPLETE'
                            ? 'Completed'
                            : project.status === 'FUNDING_FAILED'
                            ? 'Failed'
                            : 'In Progress'}
                    </Badge>
                </CardHeader>
                <CardBody>
                    <Stack divider={<StackDivider />} spacing="4">
                        <Image
                            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                            alt="Green double couch with wooden legs"
                            borderRadius="lg"
                        />

                        <Stat>
                            <StatLabel>Raised Amount</StatLabel>
                            <StatNumber>{raised_amount.toString()}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Goal Amount</StatLabel>
                            <StatNumber>
                                {targeted_amount.toString()}
                            </StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Goal time</StatLabel>
                            <StatNumber>{displayDate(goal_time)}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Completion Time</StatLabel>
                            <StatNumber>
                                {displayDate(completion_time)}
                            </StatNumber>
                        </Stat>
                        <Text>{project_details}</Text>
                        {isOwner ? (
                            <></>
                        ) : (
                            <>
                                <Stat>
                                    <StatLabel>
                                        Amount you are donating
                                    </StatLabel>
                                </Stat>
                                <NumberInput
                                    size="sm"
                                    defaultValue={0.1}
                                    min={0.1}
                                    value={donateAmount}
                                    precision={2}
                                    onChange={(value) => setDonateAmount(value)}
                                >
                                    <NumberInputField />
                                </NumberInput>
                            </>
                        )}
                    </Stack>
                </CardBody>
                <CardFooter>{isOwner ? ownerButtons : donateButton}</CardFooter>
            </Card>
        </Flex>
    )
}

export async function getServerSideProps({
    query: { project_id },
}: {
    query: { project_id: string }
}) {
    const projectData = await JSON.parse(
        JSON.stringify(await getSingleProject(parseInt(project_id)))
    )

    return {
        props: {
            project: {
                ...projectData,
            },
        },
    }
}
