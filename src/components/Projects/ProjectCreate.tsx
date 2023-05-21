import { createProject, getProject } from '@/server/actions'
import { Prisma, Project } from '@prisma/client'
import { useRouter } from 'next/router'
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
    Textarea,
    Spacer,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'

import { FormEvent, useState } from 'react'

type ProjectCreatePageProp = {}

const displayDate = (createdDate: string) => {
    const date = new Date(createdDate)
    return date.toISOString()
}

export default function ProjectCreate(props: ProjectCreatePageProp) {
    const router = useRouter()
    const { data: session } = useSession()
    // const { project } = props
    const [project_title, setProjectTitle] = useState<string>('')
    const [project_details, setProjectDetails] = useState<string>('')
    const [project_categories, setProjectCategories] = useState<string>('')
    const [goal_time, setGoalTime] = useState<Date>(new Date())
    const [completion_time, setCompletionTime] = useState<Date>(new Date())

    const [targeted_amount, setTargetedAmount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    if (session === null) {
        return <p>Please sign in</p>
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const projectData = {
            project_title,
            project_details,
            goal_time: goal_time.getTime(),
            completion_time: completion_time.getTime(),
            targeted_amount,
            category: project_categories.split(','),
        }
        console.log(projectData)
        setIsLoading(true)
        try {
            const { project_id } = await createProject({
                project_owner_id: parseInt(session.userId),
                project_data: projectData,
            })
            router.push(`/projects/${project_id}`)
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Flex direction={'row'} justifyContent={'center'}>
            <form onSubmit={onSubmit}>
                <FormControl>
                    <Card maxW="lg" variant="filled">
                        <CardHeader>
                            <Stack>
                                <FormLabel>
                                    Create a fund raising project
                                </FormLabel>
                                <Input
                                    variant="filled"
                                    value={project_title}
                                    placeholder="Title of your project"
                                    onChange={(event) =>
                                        setProjectTitle(event.target.value)
                                    }
                                />
                                <FormHelperText>
                                    Title of your project
                                </FormHelperText>
                            </Stack>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <Image
                                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                                    alt="Green double couch with wooden legs"
                                    borderRadius="lg"
                                />

                                <Stat>
                                    <StatLabel>
                                        Target Amount (in USD)
                                    </StatLabel>
                                    <StatNumber>
                                        <NumberInput
                                            variant="filled"
                                            min={0}
                                            value={targeted_amount}
                                            onChange={(value) => {
                                                if (!value) {
                                                    setTargetedAmount(0)
                                                } else {
                                                    setTargetedAmount(
                                                        parseInt(value ?? '0')
                                                    )
                                                }
                                            }}
                                        >
                                            <NumberInputField />
                                        </NumberInput>
                                    </StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Goal time</StatLabel>
                                    <StatNumber>
                                        <Input
                                            type="date"
                                            value={goal_time.toLocaleDateString(
                                                'en-CA'
                                            )}
                                            onChange={(event) =>
                                                setGoalTime(
                                                    new Date(event.target.value)
                                                )
                                            }
                                        />
                                    </StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Completion Time</StatLabel>
                                    <StatNumber>
                                        <Input
                                            type="date"
                                            value={completion_time.toLocaleDateString(
                                                'en-CA'
                                            )}
                                            onChange={(event) =>
                                                setCompletionTime(
                                                    new Date(event.target.value)
                                                )
                                            }
                                        />
                                    </StatNumber>
                                </Stat>
                                <Stack>
                                    <Textarea
                                        variant="filled"
                                        value={project_details}
                                        placeholder="Details of your project"
                                        onChange={(event) =>
                                            setProjectDetails(
                                                event.target.value
                                            )
                                        }
                                    />
                                    <FormHelperText>
                                        Details of your project
                                    </FormHelperText>
                                </Stack>

                                <Stack>
                                    <Textarea
                                        variant="filled"
                                        value={project_categories}
                                        placeholder="Categories of your project"
                                        onChange={(event) =>
                                            setProjectCategories(
                                                event.target.value
                                            )
                                        }
                                    />
                                    <FormHelperText>
                                        Categories your project should fall
                                        under. Please input comma separated
                                        values
                                    </FormHelperText>
                                </Stack>
                            </Stack>
                        </CardBody>
                        <CardFooter>
                            <Flex width={'100%'}>
                                <Spacer />
                                <Button
                                    isLoading={isLoading}
                                    colorScheme="teal"
                                    variant="solid"
                                    type="submit"
                                >
                                    Create Project
                                </Button>
                            </Flex>
                        </CardFooter>
                    </Card>
                </FormControl>
            </form>
        </Flex>
    )
}
