import type{ StorageService } from "./storage.interface.js";
import type { Express } from "express";
import fs from 'fs/promises';

export class LocalStorageService implements StorageService{
    async upload(file: Express.Multer.File): Promise<string> {
        return file.path
    }

    async delete(filePath: string): Promise<void> {
        try{
            await fs.unlink(filePath);
        }catch(err){
            console.error("Error deleting local file:",err);
        }
    }

    async getFileUrl(filePath: string): Promise<string> {
        const normalizedPath=filePath.replace(/\\/g,"/");
        return `http://localhost:5000/${normalizedPath}`
    }
}