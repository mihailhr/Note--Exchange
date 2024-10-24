const express=require("express")
const {engine}=require("express-handlebars")
const path=require("path")
const router=require("./routes/renderPages")
const postRouter=require("./routes/postRequests")
const {testDatabaseConnection, pool}=require("./DB/pool")
const cookieParser = require("cookie-parser")
const checkUserLoggedIn = require("./middlewares/checkAuth")
require("dotenv").config()




const app=express()
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(checkUserLoggedIn)
app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars',engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname,'views'))
app.use(router)
app.use(postRouter)
const port=5000






try {
    testDatabaseConnection()
    
   app.listen(port)
   console.log("Listening on port " + port) 
} catch (error) {
    console.error("An error ocurred: " + error)
}
