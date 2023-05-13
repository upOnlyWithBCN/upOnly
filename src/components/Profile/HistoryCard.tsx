import { signUpWithCircle, getUserBalance } from '@/server/actions'
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
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export type fundedProject = {
    projectTitle: string
    projectImages: Array<String>
    amountDonated: Number
}

const mockFundedProjects: Array<fundedProject> = [
    {
        projectTitle: 'Test Project',
        projectImages: [
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffujifilm-x.com%2Fglobal%2Fproducts%2Fcameras%2Fgfx100s%2Fsample-images%2F&psig=AOvVaw2pD2w8rMXJC8Rg0lGlVM0b&ust=1683996266702000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKDsg4yd8P4CFQAAAAAdAAAAABAE',
        ],
        amountDonated: 100,
    },
    {
        projectTitle: 'Test Project',
        projectImages: [
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffujifilm-x.com%2Fglobal%2Fproducts%2Fcameras%2Fgfx100s%2Fsample-images%2F&psig=AOvVaw2pD2w8rMXJC8Rg0lGlVM0b&ust=1683996266702000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKDsg4yd8P4CFQAAAAAdAAAAABAE',
        ],
        amountDonated: 100,
    },
    {
        projectTitle: 'Test Project',
        projectImages: [
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffujifilm-x.com%2Fglobal%2Fproducts%2Fcameras%2Fgfx100s%2Fsample-images%2F&psig=AOvVaw2pD2w8rMXJC8Rg0lGlVM0b&ust=1683996266702000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKDsg4yd8P4CFQAAAAAdAAAAABAE',
        ],
        amountDonated: 100,
    },
    {
        projectTitle: 'Test Project',
        projectImages: [
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffujifilm-x.com%2Fglobal%2Fproducts%2Fcameras%2Fgfx100s%2Fsample-images%2F&psig=AOvVaw2pD2w8rMXJC8Rg0lGlVM0b&ust=1683996266702000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKDsg4yd8P4CFQAAAAAdAAAAABAE',
        ],
        amountDonated: 100,
    },
    {
        projectTitle: 'Test Project',
        projectImages: [
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffujifilm-x.com%2Fglobal%2Fproducts%2Fcameras%2Fgfx100s%2Fsample-images%2F&psig=AOvVaw2pD2w8rMXJC8Rg0lGlVM0b&ust=1683996266702000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKDsg4yd8P4CFQAAAAAdAAAAABAE',
        ],
        amountDonated: 100,
    },
    {
        projectTitle: 'Test Project',
        projectImages: [
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffujifilm-x.com%2Fglobal%2Fproducts%2Fcameras%2Fgfx100s%2Fsample-images%2F&psig=AOvVaw2pD2w8rMXJC8Rg0lGlVM0b&ust=1683996266702000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKDsg4yd8P4CFQAAAAAdAAAAABAE',
        ],
        amountDonated: 100,
    },
    {
        projectTitle: 'Test Project',
        projectImages: [
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffujifilm-x.com%2Fglobal%2Fproducts%2Fcameras%2Fgfx100s%2Fsample-images%2F&psig=AOvVaw2pD2w8rMXJC8Rg0lGlVM0b&ust=1683996266702000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKDsg4yd8P4CFQAAAAAdAAAAABAE',
        ],
        amountDonated: 100,
    },
    {
        projectTitle: 'Test Project',
        projectImages: [
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffujifilm-x.com%2Fglobal%2Fproducts%2Fcameras%2Fgfx100s%2Fsample-images%2F&psig=AOvVaw2pD2w8rMXJC8Rg0lGlVM0b&ust=1683996266702000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKDsg4yd8P4CFQAAAAAdAAAAABAE',
        ],
        amountDonated: 100,
    },
]

export type HistoryCardProps = {}

const HistoryCard = ({}: HistoryCardProps) => {
    const { data: session, status } = useSession()
    const [projectsFunded, setProjectsFunded] = useState<Array<fundedProject>>()

    useEffect(() => {
        const fetchData = async () => {
            setProjectsFunded(mockFundedProjects)
        }
        fetchData()
    }, [])

    return (
        <>
            {projectsFunded?.map((project) => {
                return (
                    <Card>
                        <CardHeader>
                            <Heading size="md">{project.projectTitle}</Heading>
                        </CardHeader>
                        <CardBody>
                            Funded: ${project.amountDonated.toString()}
                            {/* Add the smart contract address here? Avascan link*/}
                        </CardBody>
                    </Card>
                )
            })}
        </>
    )
}

export default HistoryCard
