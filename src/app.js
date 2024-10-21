const express=require("express")
const {engine}=require("express-handlebars")
const path=require("path")





const app=express()
app.engine('handlebars',engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname,'views'))
const port=4000

app.get("/",(req,res)=>{
    try {
        res.status(200).render("home")
    } catch (error) {
        res.status(500).send("An error ocurred while rendering this page.")
    }
    
})

try {
   app.listen(port)
   console.log("Listening on port " + port) 
} catch (error) {
    console.error("An error ocurred: " + error)
}