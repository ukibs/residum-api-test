import { S3Client } from "@aws-sdk/client-s3";
import { ServiceConnector } from "../../domain/contracts/service-connector";

type AmazonS3Configuration = {
    region: string;
};

export class AmazonS3ConnectorV2Builder implements ServiceConnector<S3Client> {
    private readonly config: AmazonS3Configuration;
    private client: S3Client | null = null;

    constructor(config: AmazonS3Configuration) {
        this.config = config;
    }

    public getConnection(): S3Client {
        if (!this.client) {
            this.client = new S3Client({ region: this.config.region });
        }
        return this.client;
    }
}
