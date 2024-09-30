import mongoose from 'mongoose';
const uri = "mongodb://signupUser:userPassword@127.0.0.1/signup";



const connectDB = async() => {
  try{
  await mongoose.connect(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology:true
  }

  );
  console.log("MongoDB connect");
}
 catch(err){
    console.error(err);
    process.exit(1);
    
  }
}

export default connectDB;
