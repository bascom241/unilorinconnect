import Event from "../model/eventModel.js";
const addEvent = async (req, res) => {
    try {
        const { Title, Description, Date:dateString, Time, Location, Category } = req.body;

        const eventOwner = req.user.userId

        const requiredFields = ["Title", "Date", "Time", "Location", "Category"];


        const missingFields = requiredFields.filter(f => !req.body[f]);
        if (missingFields.length > 0) {
            return res.status(401).json({ message: `${missingFields} is required` })
        };

        console.log(missingFields)

        const event = await Event.find({ Title });
        if (Title === event.Title) {
            return res.status(401).json({ message: `Event with this ${Title} alrady exits` });
        };

        console.log("Received date string:", dateString);

        const [day, month, year] = dateString.split("/");
        const formattedDate = new Date(`${year}-${month}-${day}`);
        if(isNaN(formattedDate.getTime())){
            return res.status(400).json({ message: "Invalid date format. Use DD/MM/YYYY" });
        }

        const newEvent = new Event({
            eventOwner,
            Title,
            Description,
            Date: formattedDate,
            Time,
            Location,
            Category
        });
        await newEvent.save();
        res.status(201).json({ success: true, newEvent, message: "New Event Created" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error });
    }
}

const fetchEvents = async (req,res) => {
    try {
        const { sort, page = 1, limit = 10, category, search } = req.query;
        const query = {

        };
        if (search) {
            query.$or = [
                {
                    Title: { $reqex: search, $options: "i" },
                    Description: { $reqex: search, $options: "i" }

                }
            ]
        }

        if (category) {
            query.category = category
        };

        const sortOption = { createdAt: -1 };

        if (sort === "newest") sortOption = {
            createdAt: -1
        }
        if (sort === "lowest") sortOption = {
            createdAt: 1
        }

        const skip = (Number(page - 1)) * Number(limit)
        const totalDocs = await Event.countDocuments(query);
        const events = await Event.find(query).sort(sortOption).skip(skip).limit(Number(limit)).populate("eventOwner", "fullName email");


    res.status(200).json({
        success:true,
        events,
        currentPage: Number(page),
        totalPages: Math.ceil(totalDocs / limit),
        totalDocs
    })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Internal Server Error",
           

        })
    }
}

const addAttendieToEvent = async(req,res) => {
    try {
        const {id} = req.params
        const event = await Event.findOne({_id:id ,attendees:{$ne:req.user.userId}}).populate("attendees")
        if(!event) {
            return res.status(401).json({message:"Event Not Found / You are already attending"})
        }
       
        const updateEvent = await Event.findOneAndUpdate({
            _id: id
        }, {$addToSet:{attendees:req.user.userId}}, {new:true,runValidators:true}).populate("attendees", "fullName email")
        res.status(200).json({success:true,updateEvent ,message:"Rsvp into Event Succesfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:error})
    }
}

const fetchSingleEvent = async (req,res) => {
    try {
        const {eventId} = req.params
        const event = await Event.findById(eventId).populate("eventOwner", "fullName email").populate("attendees", "fullName email");
        if(!event){
            return res.status(404).json({message:"Event Not Found"});
        }
        res.status(200).json({event})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:error}) 
    }
}


const fetchTopThreeEvents  = async (req,res) => {
    try {
        const events = await Event.find().sort({createdAt:-1}).limit(3).populate("eventOwner", "fullName email").populate("attendees", "fullName email");
        res.status(200).json({success:true, events})
    } catch (error) {
        console.log(error, "Something Went Wrong")
        res.status(500).json({message: error})
    }
}


export {addEvent, fetchEvents,addAttendieToEvent,fetchSingleEvent, fetchTopThreeEvents}