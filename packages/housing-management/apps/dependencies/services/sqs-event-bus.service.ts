import { AmazonSQSConnectorBuilder } from "../../../../shared/contexts/infrastructure/aws/sqs-connector";
import { env } from "../../config/env";

export const eventBus = new AmazonSQSConnectorBuilder(
    { region: env.SQS_REGION },
    env.SQS_ACCOUNT_ID,
    env.SQS_QUEUE_NAME
);
