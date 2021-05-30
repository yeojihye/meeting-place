"use strict";

const db = require("../config/db");

class HistoryStorage {
  static async save(userInfo, userPlace) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO places_visited(id, place_name, addr, lat, lng, starting_position)
      VALUES(?, ?, ?, ?, ?, json_object(?, ?, ?, ?));
      `;
      db.query(query, [userInfo.id, userPlace.name, userPlace.addr, userPlace.lat, userPlace.lng, 
        "user1", userPlace.starting_position.user1, "user2", userPlace.starting_position.user2], (err) => {
        if (err) reject(`${err}`);
        else resolve({ success: true });
      });
    });
  }
}

module.exports = HistoryStorage;