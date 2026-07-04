import multer from "multer";
import path from "path";

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        const uniqueName=Date.now()+"-"+Math.round(Math.random()*1e9)+path.extname(file.originalname);
        cb(null,uniqueName);
    }
})

const fileFilter=(req:any,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
    const allowedTypes=["application/pdf","image/jpeg","image/png"];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error("Only PDF, JPEG and PNG files allowed"));
    }
}

export const upload=multer({
    storage,
    fileFilter,
    limits:{
        fileSize:10*1024*1024
    }
})