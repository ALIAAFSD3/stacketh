import {
  BadgeDelta,
  Card,
  CategoryBar,
  Flex,
  Metric,
  ProgressBar,
  Text,
} from "@tremor/react";
import React from "react";

type Props = {
  name: string;
  amount: number;
  edge: number
};

const DataCard = (props: Props) => {
  const { name, amount , edge} = props;
  return (
    <div>
      <Card className="mx-auto max-w-lg">
        <Flex alignItems="start">
          <div>
            <Text>{name}</Text>
            <Metric>{amount}</Metric>
          </div>
          <BadgeDelta deltaType="moderateIncrease">{edge}</BadgeDelta>
        </Flex>
        <Flex className="mt-4">
          <Text className="truncate">Low</Text>
          <Text>High</Text>
        </Flex>
        {/* <ProgressBar value={(amount/100)*100*3} className="mt-2" /> */}
        <CategoryBar
            values={[ 10, 10, 20]}
            colors={['emerald', 'yellow', 'rose']}
            markerValue={amount}
            className="mt-2"
            showAnimation={true}
          />

      </Card>
    </div>
  );
};

export default DataCard;
