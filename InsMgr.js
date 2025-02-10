
let MessageManger  = require("./MessageManger.js");
let  TetrisManager = require("./game/TetrisManager.js");
let  UserManager  = require("./UserManager.js");
let DeepSeekAI= require("./DeepSeekAI.js");
class InsMgr {
    constructor() {
        this.MessageManger =new MessageManger(this);
        this.TetrisManager = new TetrisManager(this);
        this.UserManager = new UserManager();
        this.DeepSeekAI = new DeepSeekAI();
        
        // this.loadApi();
    }

   async loadApi(){

        let result=await this.DeepSeekAI.getChatResult("你知道我是谁吗？")
        console.log("DeepSeekAI result:",result);
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







