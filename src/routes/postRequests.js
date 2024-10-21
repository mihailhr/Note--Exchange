const express=require("express")
const createNewUser = require("../queriesSQL/userQueries")
const {pool}=require("../DB/pool")
const postRouter=express.Router()


postRouter.post("/register",async (req,res)=>{
    try {
       const formData=await req.body
       if(formData.rePass!==formData.password){
        return res.render("error",{isLoggedIn:false,errorMessage:"Invalid password confirmation"})
       } 
       createNewUser(pool,formData)
       res.send("User created")
    } catch (error) {
        return res.render("error",{isLoggedIn:false,errorMessage:error})
    }
    
})
module.exports=postRouter