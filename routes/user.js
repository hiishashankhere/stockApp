import express from 'express'
import { getUserDetails, login, logout, register, userUpdate } from '../controllers/user.js'
import { isAuthenticated } from '../middlewares/auth.js'
import {validation} from '../middlewares/validation.js'
import { uploads } from '../utils/userProfile.js'


const router = express.Router()

router.post("/register",uploads.single('image'),validation,register)
router.post("/login",login)
router.get("/logout",isAuthenticated,logout)
router.put("/update/:id",uploads.single('image'),validation,isAuthenticated,userUpdate)
router.get("/getuser/:id",isAuthenticated,getUserDetails)

export default router