import type { Express } from "express";

export interface StorageService{
    upload(file:Express.Multer.File):Promise<string>;
    delete(filePath:string):Promise<void>;
    getFileUrl(filePath:string):Promise<string>;
}