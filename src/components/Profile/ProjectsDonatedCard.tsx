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
    Badge,
    LinkBox,
    LinkOverlay,
} from '@chakra-ui/react'
import { getUserProjectsDonated } from '@/server/actions'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { GetUserProjectsDonatedRes } from '@/pages/api/user/projectsDonated'

export type ProjectsDonatedCardProps = {}

const ProjectsDonatedCard = ({}: ProjectsDonatedCardProps) => {
    const [getUserProjectsFundedRes, setGetUserProjectsFundedRes] =
        useState<GetUserProjectsDonatedRes>()

    useEffect(() => {
        const fetchData = async () => {
            const userProjectsFunded = await getUserProjectsDonated({})
            console.log(userProjectsFunded)
            setGetUserProjectsFundedRes(userProjectsFunded)
        }
        fetchData()
    }, [])

    return (
        <>
            {getUserProjectsFundedRes?.projects_donated?.map(
                (project, index) => {
                    return (
                        <LinkBox
                            key={index}
                            as="article"
                            maxW="sm"
                            p="5"
                            borderWidth="1px"
                            rounded="md"
                        >
                            <Card key={index}>
                                <CardHeader>
                                    <LinkOverlay
                                        href={
                                            '/projects/' +
                                            project.project_id.project_id.toString()
                                        }
                                    >
                                        <Heading size="md">
                                            {project.project_id.project_title}
                                        </Heading>
                                        <Badge
                                            colorScheme={
                                                project.project_id.status ===
                                                'FUNDING_COMPLETE'
                                                    ? 'green'
                                                    : project.project_id
                                                          .status ===
                                                      'FUNDING_FAILED'
                                                    ? 'red'
                                                    : 'yellow'
                                            }
                                        >
                                            {project.project_id.status ===
                                            'FUNDING_COMPLETE'
                                                ? 'Completed'
                                                : project.project_id.status ===
                                                  'FUNDING_FAILED'
                                                ? 'Failed'
                                                : 'In Progress'}
                                        </Badge>
                                    </LinkOverlay>
                                </CardHeader>
                                <CardBody>
                                    Funded: ${project.amount_donated.toString()}
                                </CardBody>
                            </Card>
                        </LinkBox>
                    )
                }
            )}
        </>
    )
}

export default ProjectsDonatedCard
