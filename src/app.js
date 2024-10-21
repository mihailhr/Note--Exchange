const express=require("express")

const app=express()

const port=4000

app.get("/",(req,res)=>{
    
    res.status(200).send("OK")
})

try {
   app.listen(port)
   console.log("Listening on port " + port) 
} catch (error) {
    console.error("An error ocurred: " + error)
}