import multer from 'multer'
import path from 'path'


const storage = multer.diskStorage({});


const filterImage = (req,file,cb) => {
    const ext = path.extname(file.originalname);

    if(ext !== ".jpg" || ext !=='.jpeg' && ext !== '.png' && ext !== ".pdf" && ext !== ".docx"){
        cb(new Error("Image Extention is not allowed"), false)
        return 
    }
    cb(null, true)
};

export const upload = multer({storage,filterImage});