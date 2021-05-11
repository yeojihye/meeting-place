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

    static async getRecommendData(userInfo) {
      return new Promise((resolve, reject) => {
        const query = `SELECT place_name, COUNT(place_name) FROM recommend_data 
                        WHERE univ = ? and gender = ?
                        GROUP BY place_name
                        ORDER BY COUNT(place_name) DESC;`;
        db.query(query, [userInfo.univ, userInfo.gender], (err, data) => {
          if (err) reject(`${err}`);
          else {
            console.log(data);
            resolve(data);
          }
        });
      });
    }
  }

module.exports = PlaceStorage;