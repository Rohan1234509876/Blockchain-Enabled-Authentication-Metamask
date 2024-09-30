import crypto from  'crypto';
import connectDB from '@/utils/connectDB';
import User from '@/models/schema';
connectDB();

async function handler(req,res) {
  if(req.method==='POST'){
    const {address} = req.body;
    const stringAddress = await address.toString();
    try {
      const addressExists = await User.findOne({blockchainAddress : stringAddress});
      if(!addressExists){
        res.status(404).json({
          message: 'Please register first'
        });
      }

      const nonce = await crypto.randomBytes(32).toString('hex');
      res.status(200).json({
        message: nonce,
        
      });
      
    } catch (error) {

      console.log(error);
      res.status(500).json({
        message: 'Server Error'
      });
      
      
    }
    }
    else{
      res.status(405).json({
        message: 'Method Not Allowed'
      });
    }
}

export default handler;