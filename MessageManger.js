

const CodeEnum = {
    loginReq: 1,
    loginRes: 2,
    QuitReq: 3,
    QuitRes: 4,
    TetrisReq: 5,
    TetrisRes: 6,
    TetrisMessage: 7,
    ExitTetrisReq: 8,
    ExitTetrisRes: 9,

}




class MessageManger {
    constructor(insMgr){
        this.InsMgr=insMgr;
    }
    message(ws, message, req) {
        let data = JSON.parse(message)
        if (!data || !data.hasOwnProperty('Code')) {
            console.error("数据格式错误", message)
            return;
        }
        this.cmdMessage(ws, data, req);
    }


    cmdMessage(ws, data, req) {
        const ip = req.connection.remoteAddress;
        const port = req.connection._peername.port;
        let id = ip + port;
        switch (data.Code) {
            case CodeEnum.loginReq:
                console.log("登录请求")
                let user =    this.InsMgr.UserManager.getUser(id)
                if (!user) {
                    this.InsMgr .UserManager.setUser(id, user, ws)
                }
                this.LoginSuccessRes(id,{id:id})
                break;
            case CodeEnum.TetrisReq:
                this.InsMgr.TetrisManager.addTetris(id);
                break;

            case CodeEnum.ExitTetrisReq:
                this.InsMgr.TetrisManager.exitTetris(id);
                break;
            default:
                console.error("未知的命令", data.Code)
                break;
        }
    }

    sendMessage(id, Code, Data = null, Status = 0, Msg = "") {
        let tdata = { Status: Status, Code: Code, Data: Data, Msg: Msg }
        let ws =    this.InsMgr.UserManager.getWs(id)
        console.log("发送消息", tdata)
        if(ws){
            ws.send(JSON.stringify(tdata));
        }
        
    }

    //===================================================================
    //登录成功
     LoginSuccessRes(id, Data, Status = 0, Msg = "") {
        this.sendMessage(id, CodeEnum.loginRes, Data, Status, Msg)
    }

    // 通知围棋消息
     TetrisRes(id, Data, Status = 0, Msg = "") {
        this.sendMessage(id, CodeEnum.TetrisRes, Data, Status, Msg)
    }
    // 主动通知围棋消息
     TetrisMessage(id, Data, Status = 0, Msg = "") {
        console.log("发送消息", Data,id)
        this.sendMessage(id, CodeEnum.TetrisMessage, Data, Status, Msg)
    }
}

module.exports = MessageManger;






