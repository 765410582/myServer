const InsMgr = require("../InsMgr.js");

const TetrisStatus={
    Win:"win",
    Fail:"fail",
    White:"white",
    Block:"block"
}
class TetrisManager {
    tetris;
    waitGroup;
    static instance;
    constructor(insMgr) {
        this.tetris = [];
        this.waitGroup = [];
        this.InsMgr=insMgr;
    }
    addTetris(id) {
        this.waitGroup.push(id);
        if (this.waitGroup.length == 2) {
            this.tetris.push(new Tetris(this.waitGroup.pop(), this.waitGroup.pop(),this.InsMgr));
        }
    }

    exitTetris(id) {
        for (let i = 0; i < this.tetris.length; i++) {
            let group = this.tetris[i].group
            if(group.indexOf(id) != -1){
                for(let j=0;j<group.length;j++){
                    let itemID=group[j];
                    if(itemID==id){
                        this.fail(itemID);
                    }else{
                        this.win(itemID);
                    }
                    
                }
                this.tetris.splice(i, 1);
            }
        }
        this.waitGroup.includes(id) && this.waitGroup.splice(this.waitGroup.indexOf(id), 1);
    }

    // 走黑棋
    rowBlock(id){
        this.InsMgr.MessageManger.TetrisMessage(id, {state:TetrisStatus.Block,score:0});
    }
    // 走白棋
    rowWhite(id){
        this.InsMgr.MessageManger.TetrisMessage(id, {state:TetrisStatus.White,score:0});
    }
    // 胜利
    win(id){
        this.InsMgr.MessageManger.TetrisMessage(id, {state:TetrisStatus.Win,score:0});
    }
    // 失败
    fail(id){
        this.InsMgr.MessageManger.TetrisMessage(id, {state:TetrisStatus.Fail,score:0});
    }
}

class Tetris {
    group;
    row;
    type;


    constructor(id1, id2,insMgr) {
        this.group = [id1, id2]
        this.row = id1;
        this.type = id1;
        this.InsMgr=insMgr;
        this.matchSuccessful();
    }

    matchSuccessful() {
        for (let i = 0; i < this.group.length; i++) {
            let id1 = this.group[0];
            let id2 = this.group[1];
            console.log("this.group[i]", this.group[i])
            let obj={
                group: [id1, id2],
                type: this.type,
                row: this.row
            }
            this.InsMgr.MessageManger.TetrisRes(this.group[i],obj);

        }
    }


}

module.exports = TetrisManager;






