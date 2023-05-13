import { getProject } from '@/server/actions'
import { Prisma, Project } from '@prisma/client'
import { useRouter } from 'next/router'
import { GetProjectData, getSingleProject } from '../api/projects/[project_id]'
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
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    FormLabel,
    FormControl,
    FormHelperText,
    Input,
} from '@chakra-ui/react'
import { useState } from 'react'
import dynamic from 'next/dynamic'

type ProjectCreatePageProp = {}

const ProjectCreateClient = dynamic(
    () => import('../../components/Projects/ProjectCreate'),
    {
        ssr: false,
    }
)

export default function Page(props: ProjectCreatePageProp) {
    return <ProjectCreateClient />
}
