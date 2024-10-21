const express=require("express")

const postRouter=express.Router()


postRouter.post("/register",async (req,res)=>{
    const userInfo=await req.body
    console.log(userInfo)
    res.send("ok")
})
module.exports=postRouter