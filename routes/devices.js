const express=require('express');
const router=express.Router();
const fetch = require('node-fetch');
const mongoose=require('mongoose');
const http=require("http");
var url  = require('url');
const checkAuth=require('../middleware/check-auth');

const hosturl= "req.protocol + '://' + req.get('host') + req.originalUrl";

const Device=require('../models/device');
const User=require('../models/user');


router.post('/',(req,res,next)=>{
  id=req.body.userID
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

  //update user with new device
  User.update({_id:id},{$push:{devices:req.body.deviceName}}).exec().then(result=>{
    console.log(result);
    res.status(200).json({
      message:'User updated with new device',
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
  console.log("Connected to get all devicess route")
  Device.find().select('_id deviceName deviceZipCode').exec().then(docs=>{
      console.log(docs);
      const response={
        count:docs.length,
        devicess:docs.map(doc=>{
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
let zip_code="";

router.get('/:deviceName',(req,res,next)=>{
  const name=req.params.deviceName;
  Device.find({deviceName:name})
  .select('_id deviceName deviceZipCode')
  .exec()
  .then(doc=>{

    console.log("From Database",doc);
    if(doc){
      //res.status(200).send(doc[0]["deviceZipCode"])
      zip_code=doc[0]["deviceZipCode"];
      //console.log(doc[0]["deviceZipCode"]);
    /*res.status(200).json({
      device:doc,
      request:{
        type:'GET',
        description:'Get all Devices',
        url:encodeURI(`${eval(url)}`)
      }
    });*/

get_data(zip_code);


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

  //const url =process.env.WEATHER_API+`${zip_code}`;


  const get_data = async zip_code => {
      const url =process.env.WEATHER_API+`${zip_code}`;
    try {
      const response = await fetch(url);
      const json = await response.json();

      console.log(url);
      res.status(200).json({
        city:json.location.name,
        condition:json.current.condition.text,
        icon:json.current.condition.icon
      })
    } catch (error) {
      console.log(error);
    }
  };


  //get_data(code);

});


module.exports=router;
