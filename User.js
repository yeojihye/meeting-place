"use strict";

const UserStorage = require("./UserStorage");
const crypto = require('crypto');

class User {
  constructor(body) {
    this.body = body;
  }

  async login() {
    const client = this.body;
    try {
      const user = await UserStorage.getUserInfo(client.id);
      const dbsalt = user.salt;

      if (user) {
        crypto.pbkdf2(client.psword, user.salt, 99999, 64, 'sha512', (err, key) => {
          if(err) {
            console.log(err);
          }
          const clientHashPsword = key.toString('base64');
        })

        if (user.id === client.id && user.psword === clientHashPsword) {
          return { success: true };
        }
        return { success: false, msg: "비밀번호가 틀렸습니다." };
      }
      return { success: false, msg: "존재하지 않는 아이디입니다." };
    } catch (err) {
      return { success: false, err };
    }
  }

  async register() {
    const client = this.body;

    crypto.randomBytes(64, (err, buf) => {
      if(err) {
        console.log(err);
      }
      const salt = buf.toString('base64');
      crypto.pbkdf2(client.psword, salt, 99999, 64, 'sha512', (err, key) => {
        if(err) {
          console.log(err);
        }
        const hashPsword = key.toString('base64');
      });
    });

    try {
      const response = await UserStorage.save(client, salt);
      return response;
    } catch (err) {
      return { success: false, err };
    }
  }
}

module.exports = User;
