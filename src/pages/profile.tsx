import ProfileCard from '../components/Profile/ProfileCard'
import HistoryCard from '@/components/Profile/HistoryCard'
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

export default function Profile() {
    const { data: session, status } = useSession()
    // We can protect all routes using this https://next-auth.js.org/tutorials/securing-pages-and-api-routes#nextjs-middleware
    if (status === 'loading') {
        return <p>Loading...</p>
    }

    if (status === 'unauthenticated') {
        return <p>Access Denied</p>
    }
    // Build profile
    return (
        <>
            <main className={styles.main}>
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
                        <Stack gap="1">
                            <Card>
                                <CardHeader>
                                    <Heading as="h3" size="lg">
                                        Projects You Have Funded
                                    </Heading>
                                </CardHeader>
                            </Card>
                            <HistoryCard />
                        </Stack>
                    </GridItem>
                </Grid>
            </main>
        </>
    )
}
