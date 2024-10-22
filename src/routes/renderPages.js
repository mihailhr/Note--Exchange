const express =require("express")
const router=express.Router()
const loggedIn=false


router.get("/",(req,res)=>{
    try {
        
        res.status(200).render("home",{loggedIn:req.userLoggedIn})
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
    
})

router.get("/register",(req,res)=>{
    try {
        res.render("register",{loggedIn:req.userLoggedIn})
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
})


router.get("/login",(req,res)=>{
    try {
        res.render("login",{loggedIn:req.userLoggedIn})
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
router.get("/myAccount",(req,res)=>{
    try {
        res.render("myAccount",{loggedIn:req.userLoggedIn,user:req.user})
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
    
})
router.get("/postResource",(req,res)=>{
    try {
        res.render("postResource",{loggedIn:req.userLoggedIn})
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
})

module.exports=router