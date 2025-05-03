const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'user',
  password: 'Gx000009',
  database: 'controle_acces',
  connectionLimit: 5
});

async function executeQuery(query, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(query, params);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

// 🔍 Requêtes PARTIELLES et INSENSIBLES à la casse
async function searchUsersByNom(nom) {
  return executeQuery("SELECT * FROM user WHERE LOWER(nom) LIKE LOWER(?)", [`%${nom}%`]);
}

async function searchUsersByPrenom(prenom) {
  return executeQuery("SELECT * FROM user WHERE LOWER(prenom) LIKE LOWER(?)", [`%${prenom}%`]);
}

async function searchUsersByFonction(fonction) {
  return executeQuery("SELECT * FROM user WHERE LOWER(fonction) LIKE LOWER(?)", [`%${fonction}%`]);
}

async function searchUsersById(id) {
  return executeQuery("SELECT * FROM user WHERE CAST(id AS CHAR) LIKE ?", [`%${id}%`]);
}

async function searchUsersByRfidBadge(rfid) {
  return executeQuery(`SELECT u.* FROM user u INNER JOIN badge b ON u.id = b.user_id WHERE LOWER(b.rfid) LIKE LOWER(?)`, [`%${rfid}%`]);
}

async function getUsersByNom(nom) {
  return executeQuery("SELECT * FROM user WHERE nom = ?", [nom]);
}

async function getUsersByPrenom(prenom) {
  return executeQuery("SELECT * FROM user WHERE prenom = ?", [prenom]);
}

async function getUsersByFonction(fonction) {
  return executeQuery("SELECT * FROM user WHERE fonction = ?", [fonction]);
}

async function getUsersById(id) {
  return executeQuery("SELECT * FROM user WHERE id = ?", [id]);
}

async function getUsersByRfidBadge(rfid) {
  return executeQuery(`SELECT u.* FROM user u INNER JOIN badge b ON u.id = b.user_id WHERE b.rfid = ?`, [rfid]);
}


async function searchBadgeByUser_id(user_id) {
  return executeQuery("SELECT * FROM badge WHERE CAST(user_id AS CHAR) LIKE ?", [`%${user_id}%`]);

}

async function searchBadgeByRfid(rfid) {
  return executeQuery("SELECT * FROM badge WHERE LOWER(rfid) LIKE LOWER(?)", [`%${rfid}%`]);
}

async function searchBadgeByActivityTime(activityTime) {
  return executeQuery("SELECT * FROM badge WHERE activityTime LIKE ?", [`%${activityTime}%`]);
}

async function searchBadgeById(id) {
  return executeQuery("SELECT * FROM badge WHERE CAST(id AS CHAR) LIKE ?", [`%${id}%`]);
}

async function getBadgeByUser_id(user_id) {
  return executeQuery("SELECT * FROM badge WHERE user_id = ?", [user_id]);

}

async function getBadgeByRfid(rfid) {
  return executeQuery("SELECT * FROM badge WHERE rfid = ?", [rfid]);
}

async function getBadgeByActivityTime(activityTime) {
  return executeQuery("SELECT * FROM badge WHERE activityTime = ?", [activityTime]);
}

async function getBadgeById(id) {
  return executeQuery("SELECT * FROM badge WHERE id  = ?", [id]);
}

async function addUsers(nom, prenom, fonction) {
  return executeQuery("INSERT INTO user(nom, prenom, fonction) VALUES (?, ?, ?)", [nom, prenom, fonction]);
}

async function addBadge(user_id, rfid, activityTime) {
  return executeQuery("INSERT INTO badge(user_id, rfid, activityTime) VALUES (?, ?, ?)", [user_id, rfid, activityTime]);
}

async function removeUsers(id) {
  return executeQuery("DELETE FROM user WHERE id = ?", [id]);
}

async function removeBadge(id) {
  return executeQuery("DELETE FROM badge WHERE id = ?", [id]);
}

let getDb = {
  searchUsersByNom,
  searchUsersByPrenom,
  searchUsersByFonction,
  searchUsersById,
  searchUsersByRfidBadge,
  getUsersByNom,
  getUsersByPrenom,
  getUsersByFonction,
  getUsersById,
  getUsersByRfidBadge,
  searchBadgeByUser_id,
  searchBadgeByRfid,
  searchBadgeByActivityTime,
  searchBadgeById,
  getBadgeByUser_id,
  getBadgeByRfid,
  getBadgeByActivityTime,
  getBadgeById,
  addUsers,
  addBadge,
  removeUsers,
  removeBadge
};

module.exports = getDb;
