const express=require('express');
const mongoose=require('mongoose');

const router=express.Router();
const Car=require('../modals/car');
const Order=require('../modals/order');
const checkAuth=require('../middleware/check-auth'); 


router.get('/available-car-list',(req,res,next)=>{
  Car.find({}).where('bookingStatus').equals(false)
    .exec()
    .then(docs=>{
        const response={
            count:docs.length,
            products:docs.map(doc=>{
                return{
                    bookingStatus:doc.bookingStatus,
                    vehicleName:doc.vehicleName,
                    vehicleNumber:doc.vehicleNumber,
                    model:doc.model,
                    seatingCapacity:doc.seatingCapacity,
                    rentPerDay:doc.rentPerDay,
                    _id:doc._id,
                    request:{
                        type:"GET",
                        url:"http://localhost:3000/single-car-info/"+doc._id
                    }
                }
            })
        };
        res.status(200).json(docs);
        })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});


router.post('/add-new-car',checkAuth,(req,res,next)=>{
    const product=new Car({
        _id:new mongoose.Types.ObjectId(),
        vehicleName:req.body.vehicleName,
        vehicleNumber:req.body.vehicleNumber,
        model:req.body.model,
        seatingCapacity:req.body.seatingCapacity,
        rentPerDay:req.body.rentPerDay
    })
    product.bookingStatus=false;
    product.save()                       
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:'created products successfully',
            createdProduct:product             //outputting the data (same in order page)
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });  
    })              
  
});


router.get('/single-car-info/:carId',(req,res,next)=>{
    const id=req.params.carId
    Car.findById(id)
    .exec()
    .then(doc=>{
        console.log(doc); 
        if(doc){
            res.status(200).json(doc); //if doc exist then show
        }
        else{
            res.status(404).json({message:'No valid entry found for provided Id'});
        }
             
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
})


router.patch('/update/:carId',checkAuth,(req,res,next)=>{
    const id=req.params.carId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Car.update({_id:id},{$set:updateOps})
    .exec()
    .then(result=>{
        console.log(result)
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
});


router.delete('/delete/:carId',checkAuth,(req,res,next)=>{
    const id=req.params.carId;
    Car.remove({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'product deleted',
            request:{
                type:'GET',
                url:'http://localhost:3000/available-car-list',
                data:{result}
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });

});

module.exports=router;