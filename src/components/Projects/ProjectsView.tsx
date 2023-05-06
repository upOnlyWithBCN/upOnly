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

const ProjectsView = ({}: ProfileCardProps) => {
    const { web3State, setDataFromWindowMM } = useWeb3Context()
    const { currentAccount, user } = web3State
    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (
        <Card maxW="md">
            <CardHeader>
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <Box>
                        <Heading size="sm">Projects</Heading>
                        <Heading size="sm">View all ongoing projects</Heading>
                    </Box>
                </Flex>
            </CardHeader>
            <CardBody>{}</CardBody>
        </Card>
    )
}

export default ProjectsView
