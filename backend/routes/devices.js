const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const http=require("http");
var url  = require('url');
const checkAuth=require('../middleware/check-auth');

const hosturl= "req.protocol + '://' + req.get('host') + req.originalUrl";

const Device=require('../models/device');



router.post('/',(req,res,next)=>{
  const device=new Device({
    _id:new mongoose.Types.ObjectId(),
    deviceName:req.body.deviceName,
    deviceZipCode:req.body.deviceZipCode, //this user id is supposed to come from the login session
    //the user id is supposed to be stored on the device after login and that will be the one used here

  });
  device.save()
  .then(result=>{
    console.log(result);
    res.status(201).json({
      message:'Device Added'
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  });
});


//delete build
router.delete('/:deviceName',checkAuth,(req,res,next)=>{
  Device.remove({deviceName:req.params.deviceName})
  .exec()
  .then(result=>{
    res.status(200).json({
        message:'Device deleted'
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  });
});

//update build
router.patch('/:deviceName',checkAuth,(req,res,next)=>{
  const name=req.params.deviceName;
  const updateOps={};
  for(const ops of req.body){
    updateOps[ops.propName]=ops.value;
  }
  Request.update({deviceName:name},{$set:updateOps}).exec().then(result=>{
    console.log(result);
    res.status(200).json({
      message:'Device updated',
      request:{
        type:'GET',
        url:encodeURI(`${eval(url)}` +id)
      }
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    });
  });
});

//get all builds
//for all the builds that will be on the wall
router.get('/',(req,res,next)=>{
  var url_parts = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(url_parts);
  console.log("Connected to get all builds route")
  Device.find().select('_id deviceName deviceZipCode').exec().then(docs=>{
      console.log(docs);
      const response={
        count:docs.length,
        builds:docs.map(doc=>{
          return{
            id:doc._id,
            deviceName:doc.deviceName,
            deviceZipCode:doc.deviceZipCode,
            requests:{
              type:'GET',
              url:encodeURI(`${eval(hosturl)}`+doc._id)
            }
          }
        })
      };
      if(docs.length >=0){
        res.status(200).json(response);
      }else{
        res.status(404).json({
          message:'No entries found'
        });
      }

    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({
        error:err
      });
    });
});

//get specif build
//used when checking a specific build browsing through build details and the images
router.get('/:deviceName',checkAuth,(req,res,next)=>{
  const name=req.params.deviceName;
  Build.findById({deviceName:name})
  .select('_id deviceName deviceZipCode')
  .exec()
  .then(doc=>{
    console.log("From Database",doc);
    if(doc){
    res.status(200).json({
      build:doc,
      request:{
        type:'GET',
        description:'Get all Devices',
        url:encodeURI(`${eval(url)}`)
      }
    });
  }else{
    res.status(404).json({
      message:"no valid name found"
    })
  }
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({error:err});
  });
});


module.exports=router;
