const express=require("express")
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken")
const {createNewUser,checkIfUserExists, checkLoginCredentials} = require("../queriesSQL/userQueries")
const {createPost}=require("../queriesSQL/ResourcesQueries")
const {pool}=require("../DB/pool")
const postRouter=express.Router()
const jwtSecret=process.env.SECRET

postRouter.post("/register",async (req,res)=>{
    try {
       const formData=await req.body
       if(formData.rePass!==formData.password){
        return res.render("error",{isLoggedIn:false,errorMessage:"Invalid password confirmation"})
       } 
       const hashedPass= await bcrypt.hash(formData.password,10)
       formData.hashedPass=hashedPass

       

       const userExists = await checkIfUserExists(pool,formData)
       if(userExists){
        return res.render("error",{isLoggedIn:false,errorMessage:"The username or email you provided is already used"})
       }
      
       await createNewUser(pool,formData)
       const token= jwt.sign({user:formData.username},jwtSecret,{expiresIn:'1d'})
       res.cookie('note_exchange_verification',token)
       res.redirect("/myAccount")
    } catch (error) {
        return res.render("error",{isLoggedIn:false,errorMessage:error})
    }
    
})
postRouter.post("/myAccount",async(req,res)=>{
    res.clearCookie('note_exchange_verification')
    res.redirect("/")
})
postRouter.post("/login",async (req,res)=>{
    const formData=await req.body
    try {
        const checkData=await checkLoginCredentials(pool,formData,bcrypt)
        if(!checkData){
            return res.render("error",{isLoggedIn:req.userLoggedIn,errorMessage:"Invalid credentials"})
        }
        const token= jwt.sign({user:formData.username},jwtSecret,{expiresIn:'1d'})
       return res.cookie('note_exchange_verification',token).redirect("/myAccount")

    } catch (error) {
        return res.render("error",{isLoggedIn:req.userLoggedIn,errorMessage:error})
    }
})

postRouter.post("/postResource", async(req,res)=>{
    const formData=await req.body
    try {
        await createPost(pool,formData)
        res.send("ok")
    } catch (error) {
        console.error("An error occurred: " + error)
        res.send(error)
    }
})


module.exports=postRouter