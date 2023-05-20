import ProfileCard from '../components/Profile/ProfileCard'
import ProjectsDonatedCard from '@/components/Profile/ProjectsDonatedCard'
import ProjectsOwnedCard from '@/components/Profile/ProjectsOwnedCard'
import styles from '@/styles/Profile.module.css'
import {
    Button,
    SimpleGrid,
    Stack,
    Grid,
    GridItem,
    Card,
    Heading,
    CardHeader,
} from '@chakra-ui/react'
import { useSession, getSession } from 'next-auth/react'
import SignInCard from '@/components/SignInCard'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

export default function Profile() {
    const { data: session, status } = useSession()
    // We can protect all routes using this https://next-auth.js.org/tutorials/securing-pages-and-api-routes#nextjs-middleware
    if (status === 'loading') {
        return <p>Loading...</p>
    }
    // Build profile
    return (
        <>
            <main className={styles.main}>
                {status === 'unauthenticated' ? (
                    <SignInCard />
                ) : (
                    <Grid
                        templateAreas={`"nav main"`}
                        gridTemplateColumns={'300px 1fr'}
                        // h="200px"
                        gap="1"
                        color="blackAlpha.700"
                        fontWeight="bold"
                        width="70%"
                    >
                        <GridItem pl="2" area={'nav'}>
                            <Stack direction="column">
                                <ProfileCard />
                            </Stack>
                        </GridItem>
                        <GridItem pl="2" gap="1" area={'main'}>
                            <Tabs>
                                <Card>
                                    <CardHeader>
                                        <Heading as="h3" size="lg">
                                            Projects
                                        </Heading>
                                    </CardHeader>
                                    <TabList>
                                        <Tab>Funded</Tab>
                                        <Tab>Owned</Tab>
                                    </TabList>
                                </Card>

                                <TabPanels>
                                    <TabPanel>
                                        <ProjectsDonatedCard />
                                    </TabPanel>
                                    <TabPanel>
                                        <ProjectsOwnedCard />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </GridItem>
                    </Grid>
                )}
            </main>
        </>
    )
}
