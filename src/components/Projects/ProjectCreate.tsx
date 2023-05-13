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
    Spinner,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import Router, { useParams, useRouter } from 'next/navigation'
import { Project } from '@prisma/client'
import { getProjects } from '@/server/actions'

export type ProjectCreateProps = {
    project: Project
}

const ProjectCreate = ({
    project: { project_title, project_details, project_id },
}: ProjectCreateProps) => {
    const router = useRouter()
    const onHandleViewProject = () => {
        router.push(`/projects/${project_id}`)
    }
    return (
        <Card maxW="md">
            <CardHeader>
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <Box>
                        <Heading size="sm">{project_title}</Heading>
                        <Heading size="sm">project id: {project_id}</Heading>
                    </Box>
                </Flex>
            </CardHeader>

            <CardBody>{project_details}</CardBody>
            <Divider />
            <CardFooter>
                <Button
                    variant="solid"
                    colorScheme="blue"
                    onClick={onHandleViewProject}
                >
                    View Project
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ProjectCreate
