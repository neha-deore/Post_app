import mongoose from 'mongoose'
const AddpostSchema = new mongoose.Schema({ 
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }, 
    comment:{
        type:Array,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
})
export default mongoose.model("addpost",AddpostSchema)