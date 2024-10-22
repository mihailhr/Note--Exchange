async function createPost(pool,formData,userId){
    const client=await pool.connect()
    try {        
        const query=`
        INSERT INTO submissions
        (title,url,topic,creator_id)
        VALUES($1,$2,$3,$4)`
        const result=await client.query(query,[formData.title,formData.url,formData.topic,userId])
        
    } catch (error) {
        console.error("An error occurred when creating a new study resource: " + error)
    }finally{
        client.release()
    }
}

async function getAllMaterials(pool){
const client =await pool.connect()
try {
    const query=`SELECT title,topic,url,username FROM submissions
    JOIN users ON submissions.creator_id=users.user_id `
    const result=await client.query(query)
    const allSubmissions=result.rows
    console.log(allSubmissions)
    return allSubmissions
} catch (error) {
    console.error("An error occurred when retrieving all study materials from the DB :" +error)
}finally{
    client.release()
}
}

async function getUserSubmissions(pool,username){
    const client =await pool.connect()
try {
    const query=`SELECT title,topic,url FROM submissions
    JOIN users ON submissions.creator_id=users.user_id
    WHERE username= $1 `
    const result=await client.query(query,[username])
    const userSubmissions=result.rows
    console.log("test")
    console.log(userSubmissions)
    return userSubmissions
} catch (error) {
    console.error(`An error occurred when retrieving the study materials published by ${username} from the DB :` +error)
}finally{
    client.release()
}
}


module.exports={createPost,getAllMaterials,getUserSubmissions}