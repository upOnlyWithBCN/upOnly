import { CONNECTION_STATE } from '@/context/constants'
import { getCategories, signUpWithCircle } from '@/server/actions'
import {
    SimpleGrid,
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
    List,
    ListItem,
    ListIcon,
    Checkbox,
    useCheckboxGroup,
} from '@chakra-ui/react'

import { CheckCircleIcon } from '@chakra-ui/icons'

import { useEffect, useState } from 'react'

import Router, { useParams, useRouter } from 'next/navigation'
import { Project } from '@prisma/client'
import { getProjects } from '@/server/actions'
import ProjectCard from './ProjectCard'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { AggregatedCategory } from '@/pages/api/category'

export type ProfileCardProps = {}

const ProjectsView = ({}: ProfileCardProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()
    const params = useParams()
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [projects, setProjects] = useState<Array<Project>>([])
    const [totalProjects, setTotalProjects] = useState<number>(10)
    const [categories, setCategories] = useState<AggregatedCategory[]>([])
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
        new Set()
    )
    const { value, getCheckboxProps } = useCheckboxGroup({
        defaultValue: [],
    })
    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesFromAPI = await getCategories()
            setCategories(categoriesFromAPI.categories)
        }
        const fetchProjects = async () => {
            const projectsFromAPI = await getProjects(page, pageSize)
            setProjects(projectsFromAPI.projects)
            setTotalProjects(projectsFromAPI.total)
        }
        fetchCategories()
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

    const onCategoryClick = (category: string) => {
        console.log('click')
        if (selectedCategories.has(category)) {
            selectedCategories.delete(category)
        } else {
            selectedCategories.add(category)
        }
        setSelectedCategories(selectedCategories)
    }

    return (
        <Grid
            templateAreas={`
                  "nav main"
                `}
            maxWidth={1200}
            gridTemplateRows={'50px 1fr 30px'}
            gridTemplateColumns={'200px 1fr'}
            h="80vh"
            gap="1"
        >
            <GridItem pl="2" area={'nav'} marginLeft={16} marginTop={12}>
                <List>
                    {categories.map((cat, index) => {
                        return (
                            <ListItem key={index}>
                                <Checkbox
                                    {...getCheckboxProps({
                                        value: cat.category,
                                    })}
                                    size="sm"
                                    colorScheme="red"
                                    value={cat.category}
                                >
                                    {cat.category}
                                </Checkbox>
                            </ListItem>
                        )
                    })}
                </List>
            </GridItem>
            <GridItem pl="2" area={'main'}>
                <Stack direction="column" marginRight={24}>
                    <Heading>View Available Projects</Heading>
                    <SimpleGrid minChildWidth="200px" spacing="12px">
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
                    </SimpleGrid>
                    {totalProjects > 10 ? (
                        <Flex
                            flexDirection={'row'}
                            gap={12}
                            justifyContent={'center'}
                        >
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
                    ) : (
                        <></>
                    )}
                </Stack>
            </GridItem>
        </Grid>
    )
}

export default ProjectsView
