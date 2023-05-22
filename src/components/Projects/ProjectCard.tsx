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

export type ProjectCardProps = {
    project: Project
}
const images = [
    'https://muslimaid-2022.storage.googleapis.com/upload/img_cache/file-28661-a4f05ddb0784ab691408e476706bcdfd.jpg',
    'https://sloanreview.mit.edu/wp-content/uploads/2021/12/GEN-Forman-Giving-Charity-1290x860-1.jpg',
    'https://www.giving.sg/image/logo?img_id=87689122',
    'https://www.giving.sg/image/logo?img_id=82261724',
    'https://www.giving.sg/image/logo?img_id=83786124',
    'https://www.giving.sg/image/logo?img_id=82261726',
    'https://www.giving.sg/image/logo?img_id=80980902',
    'https://www.giving.sg/image/logo?img_id=83495436',
]
const ProjectCard = ({
    project: { project_title, project_details, project_id },
}: ProjectCardProps) => {
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
            <Image
                src={images[Math.floor(Math.random() * 8)]}
                alt="Green double couch with wooden legs"
                borderRadius="lg"
            />
            <CardBody>{project_details.slice(0, 300)}</CardBody>
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

export default ProjectCard
