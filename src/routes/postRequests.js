const express=require("express")
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken")
const {createNewUser,checkIfUserExists, checkLoginCredentials, getUserId} = require("../queriesSQL/userQueries")
const {createPost, getSearchResults, deletePost,getSpecificPost}=require("../queriesSQL/resourcesQueries")
const {pool}=require("../DB/pool")
const postRouter=express.Router()
const jwtSecret=process.env.SECRET

postRouter.post("/register",async (req,res)=>{
    try {
        if(req.userLoggedIn){
            return res.send("You are already logged in. If you want to create a new account, you have to log out first")
        }
       const formData=await req.body
       if(formData.rePass!==formData.password){
        return res.render("error",{loggedIn:req.userLoggedIn,errorMessage:"Invalid password confirmation"})
       } 
       const hashedPass= await bcrypt.hash(formData.password,10)
       formData.hashedPass=hashedPass

       

       const userExists = await checkIfUserExists(pool,formData)
       if(userExists){
        return res.render("error",{loggedIn:req.userLoggedIn,errorMessage:"The username or email you provided is already used"})
       }
      
       await createNewUser(pool,formData)
       const token= jwt.sign({user:formData.username},jwtSecret,{expiresIn:'1d'})
       res.cookie('note_exchange_verification',token)
       res.redirect("/myAccount")
    } catch (error) {
        return res.render("error",{loggedIn:req.userLoggedIn,errorMessage:error})
    }
    
})
postRouter.post("/myAccount",async(req,res)=>{
    if(!req.userLoggedIn){
        return res.send("You are not currently logged in.")
    }


    res.clearCookie('note_exchange_verification')
    res.redirect("/")
})
postRouter.post("/login",async (req,res)=>{
    const formData=await req.body
    try {
        if(req.userLoggedIn){
            return res.send("You are already logged in.")
        }
        const checkData=await checkLoginCredentials(pool,formData,bcrypt)
        if(!checkData){
            return res.render("error",{loggedIn:req.userLoggedIn,errorMessage:"Invalid credentials"})
        }
        const token= jwt.sign({user:formData.username},jwtSecret,{expiresIn:'1d'})
       return res.cookie('note_exchange_verification',token).redirect("/myAccount")

    } catch (error) {
        return res.render("error",{loggedIn:req.userLoggedIn,errorMessage:error})
    }
})

postRouter.post("/postResource", async(req,res)=>{
    const formData=await req.body
    try {
        if(!req.userLoggedIn){
            return res.send("You need to be logged in to post new study materials.")
        }
        const userId=await getUserId(req,pool)
        await createPost(pool,formData,userId)
        
        res.redirect("/allResources")
    } catch (error) {
        console.error("An error occurred: " + error)
        res.send(error)
    }
})
postRouter.post("/search",async (req,res)=>{
    const criteria=await req.body.searchCriteria
    try {
        const searchResults=await getSearchResults(pool,criteria)
        res.render("allResources",{loggedIn:req.userLoggedIn,showingSearch:true,searchResults})
    } catch (error) {
        console.error(error)
        res.send(error)
    }
})
postRouter.post("/posts/:id/delete",async(req,res)=>{
    if (!req.userLoggedIn) {
        return res.render("notLoggedIn");
      }
      try {
        const postInfo = await getSpecificPost(pool, req.params.id);
        const postCreator = postInfo[0].username;
        if (postCreator !== req.user) {
          return res.render("error", {
            loggedIn: req.userLoggedIn,
            errorMessage:
              "You are not the creator of this post, so you are not allowed to modify it.",
          });
        }
        await deletePost(pool,req.params.id)
        return res.redirect("/myAccount")
      } catch (error) {res
        .status(500)
        .send("An error ocurred while rendering this page :" + error);
    }
    
     
})

module.exports=postRouter