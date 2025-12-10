import { Connection, createConnection } from "mariadb";
import { ServiceConnector } from "../../domain/contracts/service-connector";
import { DatabaseError } from "../../domain/errors";

type MariaDBConfiguration = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
};

export class MariaDBConnectorBuilder implements ServiceConnector<Connection> {
    private readonly config: MariaDBConfiguration;

    constructor(config: MariaDBConfiguration) {
        this.config = config;
    }

    // getConnection(): Promise<Connection> {
    //     return createConnection(this.config);
    // }

    async getConnection(): Promise<Connection> {
        let retries = 0;
        while (retries < 3) {
            // console.debug("BBDD conection attemp: ", retries);
            try {
                const connection = await createConnection(this.config);
                return connection;
            } catch (e) {
                console.debug("Error creationg connection: ", e, " - retry: ", retries);
                retries++;
            }
        }
        throw new DatabaseError("There was an error creating the connection");
    }
}
