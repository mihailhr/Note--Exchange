 async function deleteAccount(pool,username){
const client=await pool.connect()
try {
    const query1=`
    DELETE FROM submissions
    WHERE creator_id=(
    SELECT user_id FROM users WHERE username=$1)`
    await client.query(query1,[username])

    const query2=`
    DELETE FROM users
    WHERE username = $1`
    await client.query(query2,[username])


} catch (error) {
    console.error(
        "An error occurred when retrieving all study materials from the DB :" +
          error
      );
}finally{
client.release()
}

}

module.exports={deleteAccount}