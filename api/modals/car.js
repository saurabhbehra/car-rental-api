const mongoose=require('mongoose');

const carSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    vehicleName:{type:String, required:true},
    vehicleNumber:{type:Number,required:true},
    model:{type:Number,required:true},
    seatingCapacity:{type:Number,required:true},
    rentPerDay:{type:Number,required:true},
    bookingStatus:{type:Boolean,required:true,default:false}
});

module.exports =mongoose.model('Car',carSchema);