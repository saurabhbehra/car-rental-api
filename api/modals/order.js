const mongoose=require('mongoose');

const orderSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    product:{type:mongoose.Schema.Types.ObjectId, ref: 'Car',required:true},
    issueDate:{type:Date,required:true},
    returnDate:{type:Date,required:true},
    bookingStatus:{type:Boolean,required:true,default:true}
   
});

module.exports =mongoose.model('Order',orderSchema);