

const mysql2 = require('mysql2');
class ConnectDataBase {
  constructor() {
    this.createConnection();
  }

  async createConnection() {
    const con = await mysql2.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'test',
      port: 3306,
      multipleStatements: true
    });
    this.client = con.promise();
  }
  async createTable() {
    try {
      const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `;
      const [results] = await this.client.query(sql);
      return results;
    } catch (error) {
      console.error("创建表 error:", error);
    }
    return null;
  }
  // 曾删改查
  async insert(data) {
    try {
      const sql = 'INSERT INTO users (name, password) VALUES (?, ?)';
      let { name, password } = data;
      const [results] = await this.client.query(sql, [name, password]);
      console.log("插入用户 result:", results);
      return results;
    } catch (error) {
      console.error("插入用户 error:", error);
    }
    return null;
  }

  async deleteUser(data) {
    try {
      let name = data.name;
      const sql = 'DELETE FROM users WHERE name = ?';
      const [results] = await this.client.query(sql, [name]);
      return results;
    } catch (error) {
      console.error("删除用户 error:", error);
    }
    return null;
  }
  async deleteUsers() {
    try {
      const sql = 'DELETE FROM users';
      const [results] = await this.client.query(sql);
      console.log("删除所有用户 result:", results);
      return results;
    } catch (error) {
      console.error("删除所有用户 error:", error);
    }
    return null;

  }
  async updateUser(data) {
    try {
      let { name, password } = data;
      const sql = 'UPDATE users SET  password = ? WHERE name = ?';
      let [results] = await this.client.query(sql, [password, name]);
      console.log("修改用户 result:", results);
      return results;
    } catch (error) {
      console.log("修改用户 error:", error);
    }
    return null;
  }

  async getUsers() {
    try {
      const sql = 'SELECT * FROM users';
      let [results, fields] = await this.client.query(sql);
      console.log("查询所有数据 results:", results);
      return results;
    } catch (error) {
      console.log("查询所有数据 error:", error);
    }
    return null;
  }

  async getUser(data) {
    let {name,password} = data;
    const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';
    let [result, fields] = await this.client.query(sql, [name,password]);

    console.log("获取用户 result:", result,data);
    return result;
  }

}

module.exports = ConnectDataBase;
