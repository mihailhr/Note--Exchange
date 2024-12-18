// Functions related to changing the contents of the users table

async function createNewUser(pool, formData) {
  const client = await pool.connect();
  try {
    const createUserQuery = `INSERT INTO users
    (username,email,hashed_pass,creation_date)
    VALUES($1,$2,$3,CURRENT_TIMESTAMP)`;
    const values = [formData.username, formData.email, formData.hashedPass];
    const result = await client.query(createUserQuery, values);
  } catch (error) {
    console.error("An error occurred:" + error);
  } finally {
    client.release();
  }
}
async function checkIfUserExists(pool, formData) {
  const client = await pool.connect();
  try {
    const checkUserExistenceQuery = `SELECT * FROM users
        WHERE email = $1    
            OR username=$2`;
    const values = [formData.email, formData.username];
    const result = await client.query(checkUserExistenceQuery, values);
    return result.rows.length > 0;
  } catch (error) {
    console.error(
      "An error occurred when checking whether the username and email are already used: " +
        error
    );
    return true;
  } finally {
    client.release();
  }
}
async function checkLoginCredentials(pool, formData, bcrypt) {
  const client = await pool.connect();

  try {
    const getUserPasswordQuery = `
        SELECT hashed_pass FROM users
            WHERE username=$1`;
    const result = await client.query(getUserPasswordQuery, [
      formData.username,
    ]);
    if (result.rows.length < 1) {
      return false;
    }
    const correctPassword = await bcrypt.compare(
      formData.password,
      result.rows[0].hashed_pass
    );
    if (!correctPassword) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      "AN error occurred when verifying user credentials: " + error
    );
    return false;
  } finally {
    client.release();
  }
}

async function getUserId(req, pool) {
  const client = await pool.connect();
  try {
    const username = await req.user;
    const getUserIdQuery = `
        SELECT user_id FROM users
        WHERE username= $1`;
    const result = await client.query(getUserIdQuery, [username]);
    return result.rows[0].user_id;
  } catch (error) {
    console.error(
      "An error occurred when retrieving the user id from the DB: " + error
    );
  } finally {
    client.release();
  }
}
async function getUserInfo(pool, username) {
  const client = await pool.connect();
  try {
    const getUserInfoQuery = `
    SELECT username,email,TO_CHAR(creation_date, 'YYYY-MM-DD') AS creation_date FROM users
    WHERE username = $1`;
    const result = await client.query(getUserInfoQuery, [username]);
    return result.rows;
  } catch (error) {
    console.error(
      `An error occurred while fetching ${username}'s info: ${error} `
    );
  } finally {
    client.release();
  }
}

module.exports = {
  createNewUser,
  checkIfUserExists,
  checkLoginCredentials,
  getUserId,
  getUserInfo,
};
