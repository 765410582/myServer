

const CodeEnum = {
    // 登录消息
    regiterReq: 101,
    regiterRes: 102,
    loginReq: 103,
    loginRes: 104,

    // 棋盘消息
    TetrisReq: 201,
    TetrisRes: 202,
    ExitTetrisReq: 203,
    ExitTetrisRes: 204,
    // 主动发送消息
    TetrisMessage: 301,

    DeepseekReq: 401,
    DeepseekRes: 402,
}

const StatusEnum = {
    LoginFail: 1,
}

const fs = require('fs');
const ConnectDataBase = require("./ConnectDataBase.js");

class MessageManger {
    constructor(insMgr) {
        this.InsMgr = insMgr;

    }
    message(ws, message, req) {
        let data = JSON.parse(message)
        if (!data || !data.hasOwnProperty('Code')) {
            console.error("数据格式错误", message)
            return;
        }
        this.cmdMessage(ws, data, req);
    }


    async cmdMessage(ws, data, req) {
        const ip = req.connection.remoteAddress;
        const port = req.connection._peername.port;
        let id = ip + port;
        let user = this.InsMgr.UserManager.getUser(id)
        switch (data.Code) {
            case CodeEnum.regiterReq:
                if (!this.dataBase) {
                    this.dataBase = await new ConnectDataBase()
                }
                await this.dataBase.insert(data)
                if (!user) {
                    this.InsMgr.UserManager.setUser(id, user, ws)
                }
                this.RegisterSuccessRes(id, { id: id })
                break;
            case CodeEnum.loginReq:
                if (!this.dataBase) {
                    this.dataBase = await new ConnectDataBase()
                }
                await this.dataBase.getUsers();
                let results = await this.dataBase.getUser(data)
                if (!user) {
                    this.InsMgr.UserManager.setUser(id, user, ws)
                }
                if (results.length > 0) {
                    this.LoginSuccessRes(id, { id: id })
                } else {
                    this.LoginSuccessRes(id, { id: id }, StatusEnum.LoginFail)
                }
                break;
            case CodeEnum.TetrisReq:
                this.InsMgr.TetrisManager.addTetris(id);
                break;

            case CodeEnum.ExitTetrisReq:
                this.InsMgr.TetrisManager.exitTetris(id);
                break;
            case CodeEnum.DeepseekReq:
                console.log("DeepseekAI 请求中:", data.Data)
                let result = await this.InsMgr.DeepSeekAI.getChatResult(data.Data)
                if (result) {
                    this.sendMessage(id, CodeEnum.DeepseekRes, result)
                    this.writeTxt(result);
                } else {
                    //请求失败后重新请求
                    this.cmdMessage(ws, data, req);
                }

                break;
            default:
                console.error("未知的命令", data.Code)
                break;
        }
    }

    writeTxt(content) {
        try {
            // 同步写入文件，文件名为 example.txt
            fs.appendFileSync('example.txt', content);
            console.log('文件写入成功!');
        } catch (err) {
            console.error('写入文件时发生错误:', err);
        }
    }
    sendMessage(id, Code, Data = null, Status = 0, Msg = "") {
        let tdata = { Status: Status, Code: Code, Data: Data, Msg: Msg }
        let ws = this.InsMgr.UserManager.getWs(id)
        console.log("发送消息", tdata)
        if (ws) {
            ws.send(JSON.stringify(tdata));
        }

    }

    //===================================================================
    // 注册成功
    RegisterSuccessRes(id, Data, Status = 0, Msg = "") {
        this.sendMessage(id, CodeEnum.regiterRes, Data, Status, Msg)
    }
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
        console.log("发送消息", Data, id)
        this.sendMessage(id, CodeEnum.TetrisMessage, Data, Status, Msg)
    }
    // Deepseek消息
    DeepseekRes(id, Data, Status = 0, Msg = "") {
        this.sendMessage(id, CodeEnum.DeepseekRes, Data, Status, Msg)
    }
    DeepseekReq(id, Data, Status = 0, Msg = "") {
        this.sendMessage(id, CodeEnum.DeepseekReq, Data, Status, Msg)
    }
}

module.exports = MessageManger;






