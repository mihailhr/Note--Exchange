async function createPost(pool,formData){
    const client=await pool.connect()
    try {
        const query=`
        INSERT INTO submissions
        (title,url,topic,creator_id)
        VALUES($1,$2,$3,$4)`
        const result=await client.query(query,[formData.title,formData.url,formData.topic,6])
        
    } catch (error) {
        console.error("An error occurred when creating a new study resource: " + error)
    }finally{
        client.release()
    }
}

module.exports={createPost}