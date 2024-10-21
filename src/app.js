const express=require("express")
const {engine}=require("express-handlebars")
const path=require("path")
const router=require("./routes/renderPages")
const postRouter=require("./routes/postRequests")
const {Pool}=require("pg")
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

const connection_string=process.env.CONNECTION_STRING
const pool=new Pool({
    connectionString:connection_string,
    ssl:{rejectUnauthorized:false}
})

async function testDatabaseConnection(){
    try {
        const client=await pool.connect()
    const result=await client.query('SELECT NOW()')
    console.log("Successful connection to DB; Here's the current time: " +result.rows[0].now)
    client.release()
    } catch (error) {
        console.error("Error occurred when connecting to the Database: " + error)
    }
    
}

try {
    testDatabaseConnection()
   app.listen(port)
   console.log("Listening on port " + port) 
} catch (error) {
    console.error("An error ocurred: " + error)
}