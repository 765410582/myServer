

const mysql2 = require('mysql2');
class ConnectDataBase {
  constructor() {

    this.client = mysql2.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'test',
      port: 3306,
      multipleStatements: true
    });
    this.client.connect((err) => {
      if (err) {
        console.log('数据库连接失败', err);
        return;
      }
      console.log('数据库连接成功');
      // this.createTable();
      this.getUsers();
      this.getUser({ name: 'John Doe' });
    });
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;
    this.client.query(sql, (err, results) => {
      if (err) throw err;
      console.log('表已创建或已存在');
      this.insert({
        name: 'John Doe',
        password: 'password'
      });
    });
  }
  // 曾删改查
  insert(data) {
    const sql = 'INSERT INTO users (name, password) VALUES (?, ?)';
    let { name, password } = data;
    this.client.query(sql, [name, password], (err, results) => {
      if (err) throw err;
      console.log('用户已插入', results.insertId, results);
    });
  }

  deleteUser(data) {
    let name = data.name;
    const sql = 'DELETE FROM users WHERE name = ?';
    this.client.query(sql, [name], (err, results) => {
      if (err) throw err;
      console.log('用户已删除', results.message);
    });
  }
  updateUser(data) {
    let { name, password } = data;
    const sql = 'UPDATE users SET  password = ? WHERE name = ?';
    this.client.query(sql, [password, name], (err, results) => {
      if (err) throw err;
      console.log('用户已更新', results.message);
    });
  }

  getUsers() {
    const sql = 'SELECT * FROM users';
    this.client.query(sql, (err, results) => {
      if (err) throw err;
      console.log('用户数据: ', results);
    });
  }

  getUser(data) {
    let name = data.name;
    const sql = 'SELECT * FROM users WHERE name = ?';
    this.client.query(sql, [name], (err, results) => {
      if (err) throw err;
      console.log('用户数据: ', results);
    });
  }

}

module.exports = ConnectDataBase;
