
let MessageManger  = require("./MessageManger.js");
let  TetrisManager = require("./game/TetrisManager.js");
let  UserManager  = require("./UserManager.js");

class InsMgr {
    constructor() {
        this.MessageManger =new MessageManger(this);
        this.TetrisManager = new TetrisManager(this);
        this.UserManager = new UserManager();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new InsMgr();
        }
        return this.instance;
    }

    CloseClient(id){
        this.TetrisManager.exitTetris(id);
    }
}

module.exports = InsMgr;







