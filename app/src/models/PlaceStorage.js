"use strict"

const db = require("../config/db");

class PlaceStorage {
    static async save(id, place_name) {
      return new Promise((resolve, reject) => {
        const query = "INSERT INTO places_visited(id, place_name) VALUES(?, ?);";
        db.query(query, [id, place_name], (err) => {
          if (err) reject(`${err}`);
          else resolve({ success: true });
        });
      });
    }
  }

module.exports = PlaceStorage;