import mongoose from "mongoose";

const marketItemSchema = new mongoose.Schema({
    posterInformation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Title: {
        type:String,
        required:[true, "item Tittle is Required"]
    },
    Description:{
        type:String,
        required:false
    },
    price:{
        type:Number,
        required:[true, "Item Price is required"]
    },
    category:{
        type:String,
        required:[true, "Item Category is required"]
    },
    condition:{
        type:String,
        required:false
    },
    itemImage:String
}, {
   timestamps:true
});


export const MarketItem = mongoose.model("MarketItem", marketItemSchema);
