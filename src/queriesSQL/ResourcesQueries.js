async function createPost(pool,formData,userId){
    const client=await pool.connect()
    try {        
        const query=`
        INSERT INTO submissions
        (title,url,topic,creator_id,creation_date,description)
        VALUES($1,$2,$3,$4,NOW(),$5)`
        const result=await client.query(query,[formData.title,formData.url,formData.topic,userId,formData.description])
        
    } catch (error) {
        console.error("An error occurred when creating a new study resource: " + error)
    }finally{
        client.release()
    }
}

async function getAllMaterials(pool){
const client =await pool.connect()
try {
    const query=`SELECT title,topic,url,username,TO_CHAR(submissions.creation_date, 'YYYY-MM-DD') AS creation_date  FROM submissions
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
    const query=`SELECT title,topic,url, TO_CHAR(submissions.creation_date, 'YYYY-MM-DD') AS creation_date  FROM submissions
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


async function getSearchResults(pool,criteria){
    const client=await pool.connect()
    try {
        const query=`
        SELECT title,topic,url,username,TO_CHAR(submissions.creation_date, 'YYYY-MM-DD') AS creation_date FROM submissions
    JOIN users ON submissions.creator_id=users.user_id
    WHERE title ILIKE $1 
        OR topic ILIKE $1 
        OR username ILIKE $1
        OR url ILIKE $1`
        const result=await client.query(query,[`%${criteria}%`])
        const matchingSubmissions=result.rows

        console.log(matchingSubmissions)
        return matchingSubmissions
    } catch (error) {
        console.error("An error occurred while searching the DB for a specific submissions: " + error)
    }finally{client.release()}
}


module.exports={createPost,getAllMaterials,getUserSubmissions,getSearchResults}