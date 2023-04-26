import {
    SimpleGrid,
    Card,
    CardHeader,
    Heading,
    CardBody,
    CardFooter,
    Button,
    Text,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
} from '@chakra-ui/react'
import { Rate } from '@circle-fin/circle-sdk'

export type ExchangeRateCardProps = {
    pair: string
    rate: Rate | undefined
}

const displayDate = (createdDate: string) => {
    const date = new Date(createdDate)
    return date.toISOString().substring(0, 10)
}

export const ExchangeRateCard = ({ pair, rate }: ExchangeRateCardProps) => {
    return (
        <Card>
            <CardHeader>
                <Heading size="md">{pair}</Heading>
            </CardHeader>
            <CardBody>
                <Stat>
                    <StatLabel>Buy</StatLabel>
                    <StatNumber>{rate?.buy}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Sell</StatLabel>
                    <StatNumber>{rate?.sell}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Time</StatLabel>
                    <StatNumber>
                        {displayDate(rate?.createDate ?? '0')}
                    </StatNumber>
                </Stat>
            </CardBody>
        </Card>
    )
}
