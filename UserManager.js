


class UserManager {
  static instance;
  users;
  wss;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new UserManager();
    }
    return this.instance;
  }
  constructor() {
    this.users = new Map();
    this.wss=new Map();
  }

  setUser(id,user,ws) {
    this.users.set(id, user);
    this.wss.set(id, ws);
  }

  getUser(id) {
    return this.users.get(id);
  }

  getWs(id) {
    return this.wss.get(id);
  }

  // 曾删改查
  insert(id, user) {

  }

  delete(id) {

  }
  update(id, user) {
  }

  find(id) {
  }
}

module.exports = UserManager;
