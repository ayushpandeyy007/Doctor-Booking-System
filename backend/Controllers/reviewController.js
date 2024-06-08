import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";

//get all reviews

export const getAllReviews = async (req,res)=>{
    try{
        const reviews = await Review.find({})

        res.status(200).json({success:true, message:"Successful", data:reviews})
    } catch(err){
        res.status(404).json({success:false, message:"Not Found" })
    }
};

//create review function

export const createReview = async(erq,res)=>{
    if(!req.body.doctor)req.body.doctor = req.params.doctorId
    if(!req.body.user)req.body.user = req.params.userId


    const newReview = new Review(req.body)

    try{
        const savedReview = await newReview.save()

        await Doctor.findByIdAndUpdate(req.body.doctor, {
            $push:{reviews : savedReview,_id}
        });
        re.status(200).json({success:true, message:"Review submitted", data:savedReview})
        
    } catch(err){
        res.status(500).json({success:false, message: err.message})
    }



};