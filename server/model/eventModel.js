import mongoose from "mongoose";
import validator from "validator"
const eventSchema = new mongoose.Schema({
    eventOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: [true, "Event Owner Id is Required"]
    },
    Title:{
        type:String,
        required:[true, "Event tittle is Required"]
    },
    Description:{
        type:String,
        required:false
    },
    Date:{
        type:Date,
        required:[true, "Event Date is Required"],
        default:Date.now
    },
    Time:{
        type:String,
        required:[true, "Event Time is Required"],
        validate: {
            validator: function(v){
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: props => `${props.value} is not a valid time format! Use HH:MM (24-hour format).`
        }
    },
    Location:{
        type:String,
        required:[true, "Event Location is Required"]
    },
    Category:{
        type:String,
        required:[true, "Event Category is Required"],

    },
    attendees:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

},{
    timestamps:true
});




eventSchema.pre("save", async function(next){
    const event = this;

    const startOfDay = new Date(event.Date);
    startOfDay.setHours(0,0,0,0);

    const endOfDay = new Date(event.Date);
    endOfDay.setHours(23,59,59,999);

    try {
        const eventCounts = await mongoose.model("Event").countDocuments({
            eventOwner:event.eventOwner,
            Date:{$gte:startOfDay, $lte:endOfDay}
        });

        if(eventCounts >= 5){
            throw new Error("You cannot create more than 5 events in a single day.")
        }
        next();
    } catch (error) {
        next(error)
    }

})
const Event = mongoose.model("Event", eventSchema);
export default Event