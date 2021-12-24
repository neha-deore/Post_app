import express from 'express';
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import catSchema from '../db/userSchema.js'
const jwtSecret = "asd889asds5656asdas887";
const router = express.Router();

router.post("/addpost",(req,res)=>{
    console.log("Harsh")
    let ins = new catSchema({
        name:req.body.name,
        email:req.body.email,
        contact:req.body.contact,
        address:req.body.address,
        password:req.body.password,
        cpassword:req.body.cpassword
    })
    console.log(ins)
    console.log(req.body.name, 'line 17')
    ins.save((e)=>{
        if(e){
            res.send("Already added")
        }
        else{
            res.send("category added")
        }
    })
})

router.post("/validate", (req, res) => {
    let email=req.body.email;
    let password=req.body.password;
    catSchema.findOne({email:email,password:password},(err,data)=>{
        if(err){
            res.json({"err":1,"msg":"Email or password is not correct"})
        }
        else if(data==null)
        {
            res.json({"err":1,"msg":"Email or password is not correct"})
        }
        else {
            let payload={
                id:data._id,email:data.email,name:data.name, contact:data.contact
            }
            const token=jwt.sign(payload,jwtSecret,{expiresIn:360000})
            res.json({"err":0,"msg":"Login Success","token":token})
        }
    })
})

export default router
