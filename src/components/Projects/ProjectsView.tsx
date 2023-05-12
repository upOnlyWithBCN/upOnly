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
    Spinner,
    Grid,
    GridItem,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import Router, { useParams, useRouter } from 'next/navigation'
import { Project } from '@prisma/client'
import { getProjects } from '@/server/actions'
import ProjectCard from './ProjectCard'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'

export type ProfileCardProps = {}

const ProjectsView = ({}: ProfileCardProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()
    const params = useParams()
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [projects, setProjects] = useState<Array<Project>>([])
    const [totalProjects, setTotalProjects] = useState<number>(10)
    useEffect(() => {
        const fetchProjects = async () => {
            const projectsFromAPI = await getProjects(page, pageSize)
            setProjects(projectsFromAPI.projects)
            setTotalProjects(projectsFromAPI.total)
        }
        fetchProjects()
    }, [page, pageSize])

    const handleForwardClick = () => {
        if (totalProjects < page * pageSize) {
            setPage(page + 1)
        }
    }

    const handleBackwordClick = () => {
        if (page > 1) {
            setPage(pageSize - 1)
        }
    }
    return (
        <Stack direction="column" marginRight={24} marginLeft={24}>
            <Heading>View Available Projects</Heading>
            <Grid
                templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                gap={6}
            >
                {isLoading ? (
                    <Spinner />
                ) : (
                    projects.map((project) => (
                        <GridItem w="100%">
                            <ProjectCard
                                project={project}
                                key={project.project_id}
                            />
                        </GridItem>
                    ))
                )}
            </Grid>
            <Flex flexDirection={'row'} gap={12} justifyContent={'center'}>
                <IconButton
                    colorScheme="teal"
                    aria-label=""
                    size="lg"
                    icon={<ArrowLeftIcon />}
                    onClick={handleBackwordClick}
                    disabled={page <= 1}
                />
                <IconButton
                    colorScheme="teal"
                    size="lg"
                    aria-label=""
                    icon={<ArrowRightIcon />}
                    onClick={handleForwardClick}
                    disabled={totalProjects < page * pageSize}
                />
            </Flex>
        </Stack>
    )
}

export default ProjectsView
