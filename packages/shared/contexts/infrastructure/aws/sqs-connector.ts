import AWS, { AWSError } from "aws-sdk";
import SQS, { SendMessageResult } from "aws-sdk/clients/sqs";
import { PromiseResult } from "aws-sdk/lib/request";
import { EventBus } from "../../domain/contracts/event-bus";
import { ServiceConnector } from "../../domain/contracts/service-connector";
import { DomainEvent } from "../../domain/events/domain-event";

type AmazonSQSConfiguration = {
    region: string;
};

export class AmazonSQSConnectorBuilder implements ServiceConnector<SQS>, EventBus {
    constructor(
        config: AmazonSQSConfiguration,
        private readonly accountId: string,
        private readonly queueName: string
    ) {
        AWS.config.update(config);
    }

    public getConnection(): SQS {
        return new SQS({ apiVersion: "2012-11-05" });
    }

    protected get queueUrl(): string {
        return `https://sqs.${AWS.config.region}.amazonaws.com/${this.accountId}/${this.queueName}`;
    }

    public async publish(event: DomainEvent): Promise<PromiseResult<SendMessageResult, AWSError>> {
        const sqs = this.getConnection();
        return await sqs.sendMessage({ QueueUrl: this.queueUrl, ...event.params }).promise();
    }
}
