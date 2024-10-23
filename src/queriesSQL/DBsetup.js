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

async function addPostCreationDate(pool){
    const client=await pool.connect()
    try {
        const query=`ALTER TABLE submissions
        ADD COLUMN creation_date TIMESTAMP NOT NULL DEFAULT NOW()
        `
        const result=client.query(query)
        console.log("Creation date column added successfully")
    } catch (error) {
        console.error("An error ocurred: "+ error)
    }finally{
        client.release()
    }
}

async function addPostsDescription(pool){
    const client=await pool.connect()
    try {
        const query=`
        ALTER TABLE submissions
        ADD COLUMN description VARCHAR(200) NOT NULL DEFAULT 'No description provided'`
        const result=await client.query(query)
        console.log("Description column added to table submissions")
    } catch (error) {
        console.error("An error ocurred: "+ error)
    }finally{
        client.release()
    }
}



module.exports={createUsersTable,createSubmissionsTable,addPostCreationDate,addPostsDescription}