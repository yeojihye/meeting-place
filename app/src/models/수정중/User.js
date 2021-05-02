"use strict";

const UserStorage = require("./UserStorage");
const crypto = require('crypto');

class User {
  constructor(body) {
    this.body = body;
  }

  //crypto암호화에 필요한 salt 생성 
  createSalt() {
    new Promise((resolve, reject) => {
      crypto.randomBytes(64, (err, buf) => {
        if (err) reject(err);
        resolve(buf.toString('hex'));
      });
    });
  }
  //const salt = await createSalt();

  async register() {
    const client = this.body;
    const salt = await createSalt();
    //비밀번호 암호화
    const hashPsword = crypto.pbkdf2(client.psword, salt, 99, 64, 'sha512').toString('hex');
    client.psword = hashPsword;

    try {
      const response = await UserStorage.save(client, salt);
      return response;
    } catch (err) {
      return { success: false, err };
    }
  }

  async login() {
    const client = this.body;
    try {
      const user = await UserStorage.getUserInfo(client.id);
      const dbsalt = user.salt;

      if (user) {
        //DB에 저장된 사용자 salt로 입력 받은 비밀번호 암호화
        //암호화한 비밀번호와 DB에 저장된 비밀번호 비교
        const clientHashPword = crypto.pbkdf2(client.psword, user.salt, 9999, 64, 'sha512').tostring('hex');
        if (user.id === client.id && user.psword === clientHashPword) {
          return { success: true };
        }
        return { success: false, msg: "비밀번호가 틀렸습니다." };
      }
      return { success: false, msg: "존재하지 않는 아이디입니다." };
    } catch (err) {
      return { success: false, err };
    }
  }

}

module.exports = User;