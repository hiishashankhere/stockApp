import mongoose from 'mongoose'


const schema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
       type: String
    },
    password:{
       type: String
    },
    mobile:{
        type:Number
    },
    image:{
        type:String
    },
    referalcode:{
       type: String,
       default:""
    },
    refereduser:{
        type:Array,
        default:[]
    },
    otp:{
        type:Number,
        default:0
    },
    block:{
        type:Array,
        default:[]
    },
    referdays:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }

},{timestamps:true})


export const User = mongoose.model("User",schema)