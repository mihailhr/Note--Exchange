


async function createNewUser(pool,formData){
    try {
        const client=await pool.connect()
    const query=(`INSERT INTO users
    (username,email,hashed_pass,creation_date)
    VALUES($1,$2,$3,CURRENT_TIMESTAMP)`)
    console.log(formData.hashedPass)
    const values=[formData.username,formData.email,formData.hashedPass]
    const result=await client.query(query,values)
    client.release()
    } catch (error) {
        console.error("An error occurred:" + error)
    }
    
}
async function checkIfUserExists(pool,formData){
    const client=await pool.connect()
    try {
        
        const query=`SELECT * FROM users
        WHERE email = $1    
            OR username=$2`
        const values=[formData.email,formData.username]
        const result=await client.query(query,values)
        return result.rows.length>0
       
    } catch (error) {
        console.error("An error occurred when checking whether the username and email are already used: " + error)
        return true
    }finally{
        client.release()
    }
}
async function checkLoginCredentials(pool,formData,bcrypt){
    const client=await pool.connect()

    try {
        const query=`
        SELECT hashed_pass FROM users
            WHERE username=$1`
        const result=await client.query(query,[formData.username])
        if(result.rows.length<1){
            return false
        }
        const correctPassword=await bcrypt.compare(formData.password,result.rows[0].hashed_pass)    
        if(!correctPassword){
            return false
        }
        return true
    } catch (error) {
        console.error("AN error occurred when verifying user credentials: " + error)
        return false
    }
}

module.exports={createNewUser,checkIfUserExists,checkLoginCredentials}