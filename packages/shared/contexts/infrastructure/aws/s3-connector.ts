import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import { ServiceConnector } from "../../domain/contracts/service-connector";

type AmazonS3Configuration = {
    region: string;
};

export class AmazonS3ConnectorBuilder implements ServiceConnector<S3> {
    constructor(config: AmazonS3Configuration) {
        AWS.config.update(config);
    }

    public getConnection(): S3 {
        return new S3({ apiVersion: "2006-03-01" });
    }
}
