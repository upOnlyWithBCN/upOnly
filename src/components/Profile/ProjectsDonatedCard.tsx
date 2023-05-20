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
                        <Card key={index}>
                            <CardHeader>
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
            )}
        </>
    )
}

export default ProjectsDonatedCard
