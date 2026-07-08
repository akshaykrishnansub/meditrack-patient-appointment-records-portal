import { LocalStorageService } from "./local.storage.js";
import { S3StorageService } from "./s3.storage.js";
import type { StorageService } from "./storage.interface.js";

let storage: StorageService;

switch(process.env.STORAGE_PROVIDER){
    case "S3":
        storage=new S3StorageService();
        break;

    case "LOCAL":
    default:
        storage=new LocalStorageService();
        break;

}

export default storage;