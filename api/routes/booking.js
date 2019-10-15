const express=require('express');
const mongoose=require('mongoose');
const Order=require('../modals/order');
const Product=require('../modals/car');
const checkAuth=require('../middleware/check-auth');
const router=express.Router();

router.get('/product-Details',checkAuth,(req,res,next)=>{
    Order.find()
    .exec()
    .then(docs=>{
        console.log(docs);
        res.status(200).json({
            count:docs.length,
            orders:docs.map(doc=>{
                return{
                    _id:doc._id,
                    product:doc.product,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/booking/single-product/'+doc._id
                    }
                }
            })
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});

router.post('/place-order',checkAuth,(req,res,next)=>{
    Product.findById(req.body.productId)
    .then(product=>{
        if(!product){
            return res.status(404).json({
                message:'product not found'
            });
        }
        product.bookingStatus=true;
        product.save();
        const order=new Order({
            _id:mongoose.Types.ObjectId(),
            product:req.body.productId,
            issueDate:req.body.issueDate,
            returnDate:req.body.returnDate
        });
        return order.save()
        
        .then(result=>{
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});

router.get('/single-product/:bookingId',checkAuth,(req,res,next)=>{
    Order.findById(req.params.bookingId)
    .exec()
    .then(order=>{
        res.status(200).json({
            order:order,
            request:{
                type:'GET',
                url:'http://localhost:3000/booking/product-Details'
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});


router.delete('/delete/:bookingId',checkAuth,(req,res,next)=>{
    Product.updateOne({_id:req.params.bookingId},{$set:{bookingStatus:"false"}})
    Order.remove({_id:req.params.bookingId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'order deleted',
            product:result,
            request:{
                type:'GET',
                url:'http://localhost:3000/booking/product-Details'
            }
        })
    })
     .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
    
});

module.exports=router;