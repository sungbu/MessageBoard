var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");


var messageControl = require("./dao/messageControl");
var userControl = require("./dao/userdControl");

var app = express();


var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static(path.join(__dirname, 'src')));


app.get("/",function (req,res){
    res.sendFile(path.resolve(__dirname,'./src/index.html'))
})

//13个请求

//注册 /api/signUp?phone=122&&username=hurry&&psd=kdd  返回{code = 1 || 0} 0为错误  1为成功
app.post("/api/signUp",urlencodedParser,function (req,res) {
    // console.log(req.body);
    userControl.userSignUp(function (data) {
        res.send(data)
    },req.body.phone,req.body.username,req.body.psd);
})

//登录验证 /api/signIn?phone=1234?psd="ddff" code:0服务器错误 1 未注册  2密码正确  3 密码错误
app.post("/api/signIn",urlencodedParser,function (req,res) {
    userControl.userSignin(function (data) {
        if(data.code == 2){
            if(data.data[0].psd == req.body.psd){
                // console.log("密码正确");
                res.send(data);
            }else if(data.data[0].psd != req.body.psd){
                //密码错误
                res.send({"code": 3})
            }
        }else{
            res.send(data);
        }
    },req.body.phone);
})

//获取总赞数和总回复数
app.post("/api/getAllReplayNum",function (req,res) {
    
})

//以userid 寻找他所有的留言板 限制  
app.post("/api/allMess",urlencodedParser,function (req,res) {
    messageControl.userIdQueryMessage(function (data) {
        res.send(data)
    },req.body.userId,(req.body.page - 1)*req.body.num,req.body.num);
})

//以tabid 找到精确的留言 code= 0(服务器错误)  1(未找到)  2 (已找到)
app.post("/api/queryMess",urlencodedParser,function (req,res) {
    messageControl.tabIdQueryMessage(function (data) {
        res.send(data)
    },req.body.tabId)
})


//以id 找到用户信息
app.post("/api/getUserDes",urlencodedParser,function (req,res){
    userControl.idQueryUser(function (data) {
        res.send(data)
    },req.body.userId)
})


//获取广场留言板 获取最热的3条留言板
app.post("/api/message",urlencodedParser,function (req,res) {
    // console.log(req.body);
    // res.send(req.body)
    messageControl.queryMessage(function (data){
        res.send(data);
    },(req.body.page - 1)*req.body.num,req.body.num);
})


//增加点赞或回复 replay = 0 点赞  replay = 1 回复  
//点赞:/api/addReplay?replay=0&&tabId=1&&userId=1&&messId=2  回复：/api/addReplay?replay=1&&tabId=1&&userId=1&&messId=2&&message=sdddss
app.post("/api/addReplay",urlencodedParser,function (req,res) {
    if(req.body.replay == 0){
        //点赞
        messageControl.pickMessage(function (data) {
            res.send(data)
        },req.body.tabId,req.body.userId,req.body.messId)
    }else{
        //回复
        messageControl.replayMessage(function (data) {
            res.send(data)
        },req.body.tabId,req.body.userId,req.body.messId,req.body.message)
    }
})

//userid获取点赞回复 按日期降序 /api/getReplayNum?userId=1&&page=1&&num=3
app.post("/api/userIdGetReplayNum",urlencodedParser,function (req,res){
    messageControl.userIdGetPickRelayNum(function (data){
        res.send(data)
    },req.body.userId,(req.body.page - 1)*req.body.num,req.body.num)
})

//tabId 获取回复
app.post("/api/tabIdGetReplayNum",urlencodedParser,function (req,res){
    messageControl.tabIdGetPickRelayNum(function (data){
        res.send(data)
    },req.body.tabId)
})

//添加留言
app.post("/api/addMess",urlencodedParser,function (req,res) {
    messageControl.addMessage(function (data) {
        res.send(data)
    },req.body.userId,req.body.content)
})

//userId 获取留言总个数
app.post("/api/messNum",urlencodedParser,function (req,res) {
    messageControl.UserIdGetMessNum(function (data) {
        res.send(data)
    },req.body.userId)
})

//删除留言
app.post("/api/remMess",urlencodedParser,function (req,res){
    messageControl.userIdRemoveMess(function (data) {
        res.send(data)
    },req.body.tabId)
})

//以userid 获取所有的回复
app.listen(40003,function () {
    console.log("server is run port is " + 40003);
})