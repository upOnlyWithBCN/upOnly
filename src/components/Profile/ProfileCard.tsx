import { CONNECTION_STATE } from "@/context/constants";
import { useWeb3Context } from "@/context/useWeb3Context"
import { Card, CardHeader, Flex, Avatar, Heading, IconButton, CardBody, CardFooter, Button , Box, Text, Image} from "@chakra-ui/react"

export type ProfileCardProps = {

}

export const ProfileCard = ({}: ProfileCardProps) => {
  const { web3State } = useWeb3Context();
  const { connectionState, currentAccount } = web3State

  if (connectionState === CONNECTION_STATE.NOT_CONNECTED) {
    return <Card maxW='md'>
      <CardHeader>
    <Flex >
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Box>
          <Heading size='sm'>Looks like youre not connected</Heading>
          <Text>Click on Connect your wallet to sign in!</Text>
        </Box>
      </Flex>
    </Flex>
  </CardHeader>
    </Card>
  }

  return <Card maxW='md'>
  <CardHeader>
    <Flex >
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
        <Box>
          <Heading size='sm'>{currentAccount}</Heading>
        </Box>
      </Flex>
  
    </Flex>
  </CardHeader>
  <CardBody>
    <Text>
      Place holder text here. This will have the user deposit wallet and the current amount inside.
    </Text>
  </CardBody>
  <Image
    objectFit='cover'
    src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
    alt='Chakra UI'
  />

  <CardFooter
    justify='space-between'
    flexWrap='wrap'
    sx={{
      '& > button': {
        minW: '136px',
      },
    }}
  >
  </CardFooter>
</Card>
}