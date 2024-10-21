const jwt=require("jsonwebtoken")
const jwtSecret=process.env.SECRET
const cookieParser=require("cookie-parser")

function checkUserLoggedIn(req,res,next){
    
const allCookies=req.cookies
if(!allCookies){
    req.userLoggedIn=false
    return next()
}
const jwtToken=allCookies['note_exchange_verification']
if(!jwtToken){
    req.userLoggedIn=false
    return next()
}
try {
    const tokenIsValid= jwt.verify(jwtToken,jwtSecret)
    req.userLoggedIn=true
    req.user=tokenIsValid.user
    
} catch (error) {
    req.userLoggedIn=false
    console.error("An error occurred when decoding JWT: "+ error)
}
return next()
}


module.exports=checkUserLoggedIn