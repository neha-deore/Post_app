import express from 'express';
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import catSchema from '../db/userSchema.js'
import AddpostSchema from '../db/postSchema.js'
const jwtSecret = "asd889asds5656asdas887";
const router = express.Router();

export function registration(body){
    let ins = new catSchema({
        name:body.name,
        email:body.email,
        contact:body.contact,
        address:body.address,
        password:body.password,
        cpassword:body.cpassword
    })
    console.log("in Socket Router",body)
    ins.save((e)=>{
        if(e){
            console.log("Error in Registration",e)
        }
        else{
            console.log("User Registered")
        }
    })
}
export function login(body){

    catSchema.findOne({email:body.email,password:body.password},(err,data)=>{
        if(err){
            console.log(err)
        }
        else if(data==null)
        {
            console.log('incorect data')
        }
        else {
            let payload={
                id:data._id,email:data.email,name:data.name, contact:data.contact 
            }
            console.log(payload,"in socket Routes",body)
            const token=jwt.sign(payload,jwtSecret,{expiresIn:360000})
            // r= "harsh"
        }
    })
}

export async function  postSocket(body){
    console.log(' in postSocket')
    let ins = new AddpostSchema({
        name:body.name,
        email:body.email,
        title:body.title,
        description:body.description,
        comment:body.comment,
    })
    console.log("in Socket Router",ins)
    await ins.save((e)=>{
        if(e){
            console.log("Error in AddPOst",e)
        }
        else{
            console.log("Post added")
        }
    })
}