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
} from '@chakra-ui/react'
import { getUserProjectsDonated } from '@/server/actions'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { GetUserProjectsDonatedRes } from '@/pages/api/user/projectsDonated'

export type ProjectsOwnedCardProps = {}

const ProjectsOwnedCard = ({}: ProjectsOwnedCardProps) => {
    // const [getUserProjectsFundedRes, setGetUserProjectsFundedRes] =
    //     useState<GetUserProjectsDonatedRes>()

    useEffect(() => {
        const fetchData = async () => {
            const userProjectsOwned = await getUserProjectsOwned({})
            console.log(userProjectsOwned)
            // setGetUserProjectsFundedRes(userProjectsOwned)
        }
        fetchData()
    }, [])

    return (
        <>
            hello
            {/* {getUserProjectsFundedRes?.projects_donated?.map(
                (project, index) => {
                    return (
                        <Card key={index}>
                            <CardHeader>
                            i
                                <Heading size="md">
                                    {project.project_id.project_title}
                                </Heading>
                            </CardHeader>
                            <CardBody>
                                Funded: ${project.amount_donated.toString()}
                            </CardBody>
                        </Card>
                    )
                }
            )} */}
        </>
    )
}

export default ProjectsOwnedCard
