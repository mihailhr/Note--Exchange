async function createPost(pool, formData, userId) {
  const client = await pool.connect();
  try {
    const query = `
        INSERT INTO submissions
        (title,url,topic,creator_id,creation_date,description)
        VALUES($1,$2,$3,$4,NOW(),$5)`;
    const result = await client.query(query, [
      formData.title,
      formData.url,
      formData.topic,
      userId,
      formData.description,
    ]);
  } catch (error) {
    console.error(
      "An error occurred when creating a new study resource: " + error
    );
  } finally {
    client.release();
  }
}

async function getAllMaterials(pool) {
  const client = await pool.connect();
  try {
    const query = `SELECT title,topic,url,username,TO_CHAR(submissions.creation_date, 'YYYY-MM-DD') AS creation_date  FROM submissions
    JOIN users ON submissions.creator_id=users.user_id `;
    const result = await client.query(query);
    const allSubmissions = result.rows;
    return allSubmissions;
  } catch (error) {
    console.error(
      "An error occurred when retrieving all study materials from the DB :" +
        error
    );
  } finally {
    client.release();
  }
}

async function getUserSubmissions(pool, username) {
  const client = await pool.connect();
  try {
    const query = `SELECT title,topic,url, TO_CHAR(submissions.creation_date, 'YYYY-MM-DD') AS creation_date  FROM submissions
    JOIN users ON submissions.creator_id=users.user_id
    WHERE username= $1 `;
    const result = await client.query(query, [username]);
    const userSubmissions = result.rows;
    return userSubmissions;
  } catch (error) {
    console.error(
      `An error occurred when retrieving the study materials published by ${username} from the DB :` +
        error
    );
  } finally {
    client.release();
  }
}

async function getSearchResults(pool, criteria) {
  const client = await pool.connect();
  try {
    const query = `
        SELECT title,topic,url,username,TO_CHAR(submissions.creation_date, 'YYYY-MM-DD') AS creation_date FROM submissions
    JOIN users ON submissions.creator_id=users.user_id
    WHERE title ILIKE $1 
        OR topic ILIKE $1 
        OR username ILIKE $1
        OR url ILIKE $1`;
    const result = await client.query(query, [`%${criteria}%`]);
    const matchingSubmissions = result.rows;

    return matchingSubmissions;
  } catch (error) {
    console.error(
      "An error occurred while searching the DB for a specific submission: " +
        error
    );
  } finally {
    client.release();
  }
}

async function getSpecificPost(pool, postTitle) {
  const client = await pool.connect();
  try {
    const query = `
       SELECT title,url,topic,TO_CHAR(submissions.creation_date, 'YYYY-MM-DD') AS creation_date,description,username
       FROM submissions
       JOIN users ON submissions.creator_id=users.user_id
       WHERE title=$1; `;
    const result = await client.query(query, [postTitle]);
    return result.rows;
  } catch (error) {
    console.error(
      "An error occurred while searching the DB for a specific submissions: " +
        error
    );
  } finally {
    client.release();
  }
}

async function deletePost(pool, title) {
  const client = await pool.connect();

  try {
    const query = `
        DELETE FROM submissions
        WHERE title = $1`;
    const result = await client.query(query, [title]);
    if (!result) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(
      "An error occurred while trying to delete a specific submission: " + error
    );
  } finally {
    client.release();
  }
}

async function updatePost(pool, postTitle, formData) {
  const client = await pool.connect();

  try {
    const query = `
    UPDATE submissions
    SET title=$1, topic=$2, url=$3, description=$4
    WHERE title=$5`;
    const result = await client.query(query, [
      formData.title,
      formData.topic,
      formData.url,
      formData.description,
      postTitle,
    ]);
  } catch (error) {
    console.error(
      "An error occurred while editing a specific submissions: " + error
    );
  } finally {
    client.release();
  }
}

module.exports = {
  createPost,
  getAllMaterials,
  getUserSubmissions,
  getSearchResults,
  getSpecificPost,
  deletePost,
  updatePost,
};
