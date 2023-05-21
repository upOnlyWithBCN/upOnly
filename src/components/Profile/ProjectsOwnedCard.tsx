import {
    signUpWithCircle,
    getUserBalance,
    getUserProjectsOwned,
} from '@/server/actions'
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
    Badge,
    LinkBox,
    LinkOverlay,
    Grid,
    GridItem,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { GetUserProjectsOwnedRes } from '@/pages/api/user/projectsOwned'

export type ProjectsOwnedCardProps = {}

const ProjectsOwnedCard = ({}: ProjectsOwnedCardProps) => {
    const [getUserProjectsOwnedRes, setGetUserProjectsOwned] =
        useState<GetUserProjectsOwnedRes>()

    useEffect(() => {
        const fetchData = async () => {
            const userProjectsOwnedRes = await getUserProjectsOwned({})
            console.log(userProjectsOwnedRes)
            setGetUserProjectsOwned(userProjectsOwnedRes)
        }
        fetchData()
    }, [])

    return (
        <Grid templateColumns="repeat(3, auto)" gap={1}>
            {getUserProjectsOwnedRes?.projects_owned?.map((project, index) => {
                return (
                    <GridItem key={index}>
                        <LinkBox
                            as="article"
                            maxW="sm"
                            p="5"
                            borderWidth="1px"
                            rounded="md"
                        >
                            <Card>
                                <CardHeader>
                                    <LinkOverlay
                                        href={
                                            '/projects/' +
                                            project.project_id.toString()
                                        }
                                    >
                                        <Heading size="md">
                                            {project.project_title}
                                        </Heading>
                                    </LinkOverlay>
                                    <Badge
                                        colorScheme={
                                            project.status ===
                                            'FUNDING_COMPLETE'
                                                ? 'green'
                                                : project.status ===
                                                  'FUNDING_FAILED'
                                                ? 'red'
                                                : 'yellow'
                                        }
                                    >
                                        {project.status === 'FUNDING_COMPLETE'
                                            ? 'Completed'
                                            : project.status ===
                                              'FUNDING_FAILED'
                                            ? 'Failed'
                                            : 'In Progress'}
                                    </Badge>
                                </CardHeader>
                                <CardBody>
                                    Raised Amount: $
                                    {project.raised_amount.toString()}
                                </CardBody>
                            </Card>
                        </LinkBox>
                    </GridItem>
                )
            })}
        </Grid>
    )
}

export default ProjectsOwnedCard
