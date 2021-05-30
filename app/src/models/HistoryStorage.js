"use strict";

const db = require("../config/db");

class HistoryStorage {
  static async save(userInfo, userPlace, starting_position) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO places_visited(id, place_name, addr, lat, lng, starting_position)
      VALUES(?, ?, ?, ?, ?, ?);`;
      db.query(query, [userInfo.id, userPlace.name, userPlace.addr, userPlace.lat, userPlace.lng, starting_position], (err) => {
        if (err) reject(`${err}`);
        else resolve({ success: true });
      });
    });
  }

  static async get(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM places_visited WHERE id = ? ORDER BY cnt DESC;`;
      db.query(query, [id], (err, data) => {
        if (err) reject(`${err}`);
        else {
          resolve(data);
        }
      });
    });
  }
}

module.exports = HistoryStorage;
