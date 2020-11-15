const express=require('express');
const app=express();
const cors=require('cors');
const bodyParser=require('body-parser');
const fetch=require('node-fetch');
const mongoose = require("mongoose");
const morgan=require('morgan');
const http=require("http");
var server = require('http').Server(app);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true})); // to support URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//import all external routes

const userRoutes=require('./routes/users');
const deviceRoutes=require('./routes/devices');
const apiRoutes=require('./routes/weather');

require('dotenv').config();
 port=process.env.PORT;
 host=process.env.HOST;

//create dtabase connection

const uri = process.env.DB_URI;

mongoose.connect(uri,{useCreateIndex: true,
  useNewUrlParser: true,useUnifiedTopology: true}
);
//DB connection
const connection=mongoose.connection;
connection.once('open',()=>{
  console.log("Database Connection has been established successfully!")
})



app.use(morgan('dev'));
// Routes
app.get('/',(req, res)=>res.json({message: 'Hello Farmer'}))



//imported routes

app.use('/user',userRoutes);
app.use('/device',deviceRoutes);
app.use('/api',apiRoutes);

//error routes
app.use((req,res,next)=>{
  const error=new Error('Not found');
  error.status=404;
  next(error);

});

app.use((error,req,res,next)=>{
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message,
    }
  });
});

//listen for connection
 app.listen(port,()=>{
   console.log(`Server running on ${host} port:${port}`)
 });

 var server=app;
 module.exports={
   server:server,
 };
