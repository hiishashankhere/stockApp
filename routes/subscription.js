import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js'
import { createPlan, renewPlan } from '../controllers/subscription.js'
const router = express.Router()

router.post("/subscribe",isAuthenticated,createPlan)
router.post("/addplan",isAuthenticated,renewPlan)
export default router