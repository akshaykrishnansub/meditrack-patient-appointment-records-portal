import type { StorageService } from "./storage.interface.js";
import type { Express } from "express";
import { DeleteObjectCommand, PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from 'fs/promises';
import path from "path";

const s3=new S3Client({
    region: process.env.AWS_REGION!,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export class S3StorageService implements StorageService{
    async upload(file: Express.Multer.File): Promise<string> {
        const fileBuffer=await fs.readFile(file.path);
        const key=`${Date.now()}-${file.originalname}`;
        const command=new PutObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME!,
            Key:key,
            Body:fileBuffer,
            ContentType:file.mimetype
        });
        await s3.send(command);
        await fs.unlink(file.path);
        return key;
    }

    async delete(filePath:string):Promise<void>{
        const command=new DeleteObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME!,
            Key:filePath,
        })
        await s3.send(command)
    }

    async getFileUrl(filePath: string): Promise<string> {
        const command=new GetObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME!,
            Key:filePath
        })

        const signedUrl=await getSignedUrl(s3,command,{
            expiresIn:300
        })
        return signedUrl;
    }
}