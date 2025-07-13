import mongoose from "mongoose";

const lostAndFoundSchema = new mongoose.Schema({

    posterInformation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Poster Information Id is Required"]
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    location: { type: String, required: true },
    contactInfo: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lostItem: {type: Boolean, default: false},
    foundItem:{type: Boolean, default:false}
});

const LostAndFound = mongoose.model("LostAndFound", lostAndFoundSchema);

export default LostAndFound;
