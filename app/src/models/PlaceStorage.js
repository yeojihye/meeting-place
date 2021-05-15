"use strict"

const db = require("../config/db");

class PlaceStorage {
    static async save(userInfo, userPlace) {
      return new Promise((resolve, reject) => {
        const query = "INSERT INTO places_visited(id, place_name, univ, gender, addr, lat, lng) VALUES(?, ?, ?, ?, ?, ?, ?);";
        db.query(query, [userInfo.id, userPlace.name, userInfo.univ, userInfo.gender, userPlace.addr.address_name, userPlace.lat, userPlace.lng], (err) => {
          if (err) reject(`${err}`);
          else resolve({ success: true });
        });
      });
    }

    static async getRecommendData(userInfo) {
      return new Promise((resolve, reject) => {
        // 실제 데이터 => FROM places_visited / 테스트 데이터 => FROM recommend_data
        const query = `SELECT COUNT(place_name), place_name, addr, lat, lng FROM recommend_data
                        WHERE univ = ? and gender = ?
                        GROUP BY place_name
                        ORDER BY COUNT(place_name) DESC;`;
        db.query(query, [userInfo.univ, userInfo.gender], (err, data) => {
          if (err) reject(`${err}`);
          else {
            resolve(data);
          }
        });
      });
    }
  }

module.exports = PlaceStorage;