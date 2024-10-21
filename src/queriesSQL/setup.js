async function createUsersTable(pool){
    const client=await pool.connect()
    try {
        
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
    }finally{
        client.release()
    }

}

async function createSubmissionsTable(pool){
    const client=await pool.connect()
    try {
        const result=await client.query(`
            CREATE TABLE IF NOT EXISTS submissions
            (sub_id SERIAL PRIMARY KEY,
            title VARCHAR(30) NOT NULL,
            url TEXT UNIQUE NOT NULL,
            topic VARCHAR(15) NOT NULL,
            creator_id INTEGER REFERENCES users(user_id))`) 
    } catch (error) {
        console.error("An error ocurred: "+ error)
    }finally{
        client.release()
    }
}



module.exports={createUsersTable,createSubmissionsTable}