const express =require("express")
const { getAllMaterials, getUserSubmissions } = require("../queriesSQL/resourcesQueries")
const router=express.Router()
const {pool}=require("../DB/pool")
const { route } = require("./postRequests")
const { getUserInfo } = require("../queriesSQL/userQueries")


router.get("/",(req,res)=>{
    try {
        
        res.status(200).render("home",{loggedIn:req.userLoggedIn})
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
    
})

router.get("/register",(req,res)=>{
    try {
        if(!req.userLoggedIn){
        return res.render("register",{loggedIn:req.userLoggedIn})
        }
        return res.redirect("/myAccount")
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
})


router.get("/login",(req,res)=>{
    try {
        if(!req.userLoggedIn){
         return res.render("login",{loggedIn:req.userLoggedIn})
        }
        return res.redirect("/myAccount")

    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
})

router.get("/error",(req,res)=>{
    try {
        res.render("error",{loggedIn:req.userLoggedIn})
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
})
router.get("/myAccount",async (req,res)=>{
    try {
        if(req.userLoggedIn){
            console.log(req.user)
            const submissions=await getUserSubmissions(pool,req.user)
            return res.render("myAccount",{loggedIn:req.userLoggedIn,user:req.user,submissions})
        }
        
        return res.redirect("/notLoggedIn")
       
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
    
})
router.get("/postResource",(req,res)=>{
    try {
        if(req.userLoggedIn){
            return res.render("postResource",{loggedIn:req.userLoggedIn})
        }
        return res.redirect("/notLoggedIn")
        
    } catch (error) {
        console.error(error)
        res.status(500).send("An error ocurred while rendering this page.")
    }
})

router.get("/allResources",async (req,res)=>{
    try {
        const studyMaterials=await getAllMaterials(pool)
        res.render("allResources",{loggedIn:req.userLoggedIn,studyMaterials})
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page :"+error)
    }
})

router.get("/notLoggedIn",(req,res)=>{
    try {
        if(!req.userLoggedIn){
            return res.render("notLoggedIn",{loggedIn:req.userLoggedIn})
        }
        return res.redirect("/myAccount")
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
})

router.get("/users/:username",async(req,res)=>{
    const username=req.params.username
    console.log(username)
    try {
        if(req.userLoggedIn && req.user===username){
            return res.redirect("/myAccount")
        }
        const userInfo=await getUserInfo(pool,username)
        if(userInfo.length===0){
            return res.render("error",{errorMessage:`User ${username} doesn't exist.`,loggedIn:req.userLoggedIn})
        }
        res.render("specificUser",{loggedIn:req.userLoggedIn,userInfo})
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
    
    
    
})
module.exports=router