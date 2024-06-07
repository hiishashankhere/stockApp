import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    isSubscribed:{
        type:Boolean,
        default:false
    },
    discount:{
        type:Number,
        default:0
    },
    duration:{
        type:String,
        enum:["monthly","half-yearly","yearly"],
        default:"monthly"
    },
    plans:{
        type:String,
        enum:["short-term","long-term"],
        default:"short-term"
    },
    startDate:{
        type:Date,
        default:Date.now()
    },
    endDate:{
        type:Date
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Subscription = mongoose.model("Subscription",schema)