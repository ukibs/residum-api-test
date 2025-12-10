export interface ServiceConnector<ServiceConnection> {
    getConnection(): Promise<ServiceConnection> | ServiceConnection;
}
