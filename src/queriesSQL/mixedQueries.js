// Functions for database operations related to  both users and submissions management.

async function deleteAccount(pool, username) {
  //Deletes both the account and all submissions posted by this user

  const client = await pool.connect();
  try {
    const deleteUserSubmissionsQuery = `
    DELETE FROM submissions
    WHERE creator_id=(
    SELECT user_id FROM users WHERE username=$1)`;
    await client.query(deleteUserSubmissionsQuery, [username]);

    const deleteUserAccountQuery = `
    DELETE FROM users
    WHERE username = $1`;
    await client.query(deleteUserAccountQuery, [username]);
  } catch (error) {
    console.error(
      "An error occurred when retrieving all study materials from the DB :" +
        error
    );
  } finally {
    client.release();
  }
}

module.exports = { deleteAccount };
