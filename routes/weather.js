const express=require('express');
const router=express.Router();
const fetch = require('node-fetch');
const mongoose=require('mongoose');
const Device=require('../models/device');





router.get('/:zip_code',(req,res,next)=>{
  const url =process.env.WEATHER_API+`${req.params.zip_code}`;


  const get_data = async url => {
    try {
      const response = await fetch(url);
      const json = await response.json();

      console.log(json.location.name);
      res.status(200).json({
        city:json.location.name,
        condition:json.current.condition.text,
        icon:json.current.condition.icon
      })
    } catch (error) {
      console.log(error);
    }
  };


  get_data(url);
})

module.exports=router;
