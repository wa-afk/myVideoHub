import dotenv from 'dotenv';
import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
dotenv.config({ debug: false });

const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID! as string,
    process.env.AZURE_CLIENT_ID! as string,
    process.env.AZURE_CLIENT_SECRET! as string
);
const blobClient = new BlobServiceClient(process.env.AZURE_STORAGE_ACCOUNT_URL as string, credential);

export const container: ContainerClient = blobClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER as string);