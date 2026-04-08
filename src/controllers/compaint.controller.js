import Complaint from "../models/complaint.model.js";

export const allComplaint = async (req,res,next) => {
    try {
    const complaints = await Complaint.find().sort({ timestamp: -1 });
    res.json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints'
    });
  }
}

export const registerComplaint = async (req,res,next) => {
    try {
    console.log('📥 Received complaint from chatbot:', req.body);
    
    // Create new complaint
    const complaint = new Complaint(req.body);
    
    // Save to MongoDB
    await complaint.save();
    
    console.log('✅ Complaint saved to database:', complaint.complaintId);
    
    // Send success response
    res.status(201).json({
      success: true,
      message: 'Complaint saved successfully',
      complaintId: complaint.complaintId
    });
    
  } catch (error) {
    console.error('❌ Error saving complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save complaint',
      error: error.message
    });
  }

}

export const updateComplaint = async (req,res,next) => {
    try{
        const {complaintId} = req.params;
        const complaint = Complaint.findOneAndUpdate(
            {_id: complaintId},
            {$set:{status:'Solved'}},
            {new: true}
        );

    if(!complaint){
        return res.status(404).json({success: false, message: "Complaint not found"});
    }
    }catch (err) {
        return res.status(500).json({success: false, message: "Internal Server Error", err: err.message});
    }
}

export const complaintDetails = async (req,res,next) => {
    try {
    const complaint = await Complaint.findOne({ 
      complaintId: req.params.complaintId 
    });
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaint'
    });
  }
}