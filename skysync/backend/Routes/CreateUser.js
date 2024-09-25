const express =require('express')
const router = express.Router()
const User = require('../model/User') 

router.post("/createuser",async(req,res)=>{
    try{
        await User.create({
            name: "Mrunmai",
            email: "mrunmaikandharkar@gmail.com",
            contact: 7276851715
        })
        res.json({success: true});
    }
    catch(error){
        console.error(error)
        res.json({success: false});
    }
})
module.exports = router;