import multer from 'multer'

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./public')
    },
    filename:(req,file,cb)=>{
        cb(null, file.fieldname+'-'+Date.now()+ file.originalname)
    }
})

export const uploads = multer({
    storage:storage,
    limits:{filesize:1000000}
})