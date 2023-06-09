import ProjectsDonatedCard from '@/components/Profile/ProjectsDonatedCard';
import ProjectsOwnedCard from '@/components/Profile/ProjectsOwnedCard';
import SignInCard from '@/components/SignInCard';
import styles from '@/styles/Profile.module.css';
import {
    Card,
    CardHeader,
    Grid,
    GridItem,
    Heading,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import ProfileCard from '../components/Profile/ProfileCard';

export default function Profile() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // We can protect all routes using this https://next-auth.js.org/tutorials/securing-pages-and-api-routes#nextjs-middleware

    // Build profile
    return (
        <>
            <main className={styles.main}>
                {status === 'unauthenticated' || status === 'loading' ? (
                    <SignInCard />
                ) : (
                    <Grid
                        templateAreas={`"nav main"`}
                        gridTemplateColumns={'300px 1fr'}
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
                                    <TabPanel maxH="50vh">
                                        <ProjectsOwnedCard />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </GridItem>
                    </Grid>
                )}
            </main>
        </>
    );
}
