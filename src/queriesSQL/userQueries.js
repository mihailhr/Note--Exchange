async function createNewUser(pool,formData){
    try {
        const client=await pool.connect()
    const query=(`INSERT INTO users
    (username,email,hashed_pass,creation_date)
    VALUES($1,$2,'adsjioadshasdasd',CURRENT_TIMESTAMP)`)
    const values=[formData.username,formData.email]
    const result=await client.query(query,values)
    console.log("User created")
    client.release()
    } catch (error) {
        console.error("An error occurred:" + error)
    }
    
}

module.exports=createNewUser