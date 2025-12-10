import { MariaDBConnectorBuilder } from "../../../../shared/contexts/infrastructure/mariadb/mariadb-connector";
import { housingRepositoryBuilder } from "../../../contexts/events/infrastructure/mariadb/housing.repository";
import { env } from "../../config/env";

const databaseConnector = new MariaDBConnectorBuilder({
    host: env.RDS_DB_HOST,
    port: env.RDS_DB_PORT,
    database: env.RDS_DB_NAME,
    user: env.RDS_DB_USER,
    password: env.RDS_DB_PASS,
});

export const housingRepository = housingRepositoryBuilder({ databaseConnector });
