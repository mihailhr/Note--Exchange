const express=require("express")
const {engine}=require("express-handlebars")
const path=require("path")
const router=require("./routes/renderPages")




const app=express()
app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars',engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname,'views'))
app.use(router)
const port=4000
const loggedIn=false




// app.get("/",(req,res)=>{
//     try {
//         console.log(loggedIn)
//         res.status(200).render("home",{loggedIn})
//     } catch (error) {
//         res.status(500).send("An error ocurred while rendering this page.")
//     }
    
// })

// app.get("/register",(req,res)=>{
//     try {
//         res.render("register",{loggedIn})
//     } catch (error) {
//         res.status(500).send("An error ocurred while rendering this page.")
//     }
// })


// app.get("/login",(req,res)=>{
//     try {
//         res.render("login",{loggedIn})
//     } catch (error) {
//         res.status(500).send("An error ocurred while rendering this page.")
//     }
// })


try {
   app.listen(port)
   console.log("Listening on port " + port) 
} catch (error) {
    console.error("An error ocurred: " + error)
}