const express=require("express")
const {engine}=require("express-handlebars")
const path=require("path")
const router=require("./routes/renderPages")
const postRouter=require("./routes/postRequests")
const {testDatabaseConnection}=require("./DB/pool")
const createUsersTable =require("./queriesSQL/setup")
require("dotenv").config()







const app=express()
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars',engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname,'views'))
app.use(router)
app.use(postRouter)
const port=4000




// createUsersTable(pool)

try {
    testDatabaseConnection()
   app.listen(port)
   console.log("Listening on port " + port) 
} catch (error) {
    console.error("An error ocurred: " + error)
}
