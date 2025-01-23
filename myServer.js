










// 引入ws库
const WebSocket = require("ws");
// import {InsMgr} from "./InsMgr.ts";
const InsMgr = require("./InsMgr.js");
// 创建一个WebSocket服务器，监听3000端口
const wss = new WebSocket.Server({ port: 3000 });
const ConnectDataBase = require("./ConnectDataBase.js");
// 当客户端连接时
wss.on("connection", (ws, req) => {
  console.log("客户端已连接");
  const ip = req.connection.remoteAddress;
  const port = req.connection._peername.port;
  const id = ip + port;
  console.log(`客户端 IP 地址: ${ip}`);

  // 当接收到客户端的消息时
  ws.on("message", (message) => {
    console.log(ip + "收到消息: %s", message);
    console.log("InsMgr",InsMgr);
    InsMgr.getInstance().MessageManger.message(ws,message,req);
  });
  // 当连接关闭时
  ws.on("close", (_ws, code, reason) => {
    console.log(`客户端已断开连接，关闭Id: ${id}, 关闭原因: ${reason}`);
    InsMgr.getInstance().TetrisManager.exitTetris(id);
  });
  ws.on('error', (error) => {
    console.error('WebSocket 错误:', error);
    InsMgr.getInstance().TetrisManager.exitTetris(id);
});
});


let connect =new ConnectDataBase()

console.log("WebSocket服务器正在监听3000端口...");