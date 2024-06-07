import express from 'express'
import {connect} from './data/database.js'
import userRouter from './routes/user.js'
import subscriptionRouter from './routes/subscription.js'
import cookieParser from 'cookie-parser'

const app = express()
connect()

app.use(express.json())
app.use(cookieParser())
app.use("/api/v1",userRouter)
app.use("/api/v1",subscriptionRouter)
app.listen(5500,()=>{
    console.log("server started running");
})