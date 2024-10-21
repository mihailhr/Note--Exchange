async function createUsersTable(pool){
    try {
        const client=await pool.connect()
const result=await client.query(`CREATE TABLE IF NOT EXISTS users
     (user_id SERIAL PRIMARY KEY,
     username VARCHAR(16) UNIQUE NOT NULL,
     email VARCHAR(30) UNIQUE NOT NULL,
     hashed_pass TEXT NOT NULL,
     creation_date TIMESTAMP
     )`)
     console.log("Users table created")
     client.release()
    } catch (error) {
        console.error("An error ocurred: "+ error)
    }

}

module.exports=createUsersTable