import mongoose from "mongoose";

const resourcesSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
   
    },
    fileUrl:{
        type: String,
        required: true,
    },
    fileType: {
        type: String,
 
    },
    fileName:{
        type: String,
    },
    category:{
        type: String,
        required: true,
    },
    courseCode:{
        type:String,
        required: true,
    },
    YearLevel: {
        type: String,
        
    },
    resourceOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps:true
});


const Resources = mongoose.model("Resources", resourcesSchema);
export default Resources;