var mysql = require("mysql");

function createConnection () {
    var connection = mysql.createConnection({
        host: "106.13.111.39",
        port: "3306",
        user: "messageBoard",
        password: "messageBoard20010623",
        database: "messageBoard"
    })
    return connection
}

//获取广场留言板 获取最热的3条留言板
function queryMessage (success,page,num){
    var querySql = "SELECT * FROM messageBoard.write order by pickNum desc limit " + page + "," + num + ";";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[page,num],function (error,result){
        if(error){
            console.log(error);
        }else{
            success(result)
        }
    })
    connection.end();
}

//以userid 寻找他所有的留言板 限制  
function userIdQueryMessage(success,userId,page,num){
    var querySql = "SELECT * FROM messageBoard.write where userId=? order by ctime desc limit " + page + "," + num + ";";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[userId],function (error,result){
        if(error){
            success({"code": 0,"error": error});
        }else{
            if(result.length < 1){
                //没有留言
                success({"code": 1})
            }else{
                //已查到
                success({"code": 2,"data": result})
            }
        }
    })
    connection.end();
}

//以tabid 找到精确的留言
function tabIdQueryMessage(success,tabId){
    var querySql = "SELECT * FROM messageBoard.write where id = ?;"
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[tabId],function (error,result){
        if(error){
            success({"code": 0,"error": error});
        }else{
            if(result.length < 1){
                //未找到
                success({"code": 1})
            }else{
                //已查到
                success({"code": 2,"data": result})
            }
        }
    })
    connection.end();
}

//user数据总赞数自增
function UserPickNumAdd(success,userId){
    var querySql = "update user set pickNum=pickNum+1 where id = ?;";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[userId],function (error,result){
        if(error){
            success({"code": 0,"error" : error})
        }else{
            success({"code": 1})
        }
    })
    connection.end();
}

//单条留言的赞数自增
function tabPickNumAdd(success,tabId){
    var querySql = "update messageBoard.write set pickNum=pickNum+1 where id = ?;";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[tabId],function (error,result){
        if(error){
            success({"code": 0,"error" : error})
        }else{
            success({"code": 1})
        }
    })
    connection.end();
}

//user数据总赞数自增
function UserReplayNumAdd(success,userId){
    var querySql = "update user set messageNum=messageNum+1 where id = ?;";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[userId],function (error,result){
        if(error){
            success({"code": 0,"error" : error})
        }else{
            success({"code": 1})
        }
    })
    connection.end();
}

//单条留言的回复自增
function tabReplayNumAdd(success,tabId){
    var querySql = "update messageBoard.write set messageNum=messageNum+1 where id = ?;";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[tabId],function (error,result){
        if(error){
            success({"code": 0,"error" : error})
        }else{
            success({"code": 1})
        }
    })
    connection.end();
}

//点赞
function pickMessage (success,tabId,userId,messId) {
    var querySql = "insert into replay(`tabId`,`userId`,`messId`,`isPick`) values (?,?,?,1);";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[tabId,userId,messId],function (error,result){
        if(error){
            success({"code": 0,"error" : error})
        }else{
            UserPickNumAdd(function (data) {
                // success(data)
            },userId)
            tabPickNumAdd(function(data){
                success(data)
            },tabId)
        }
    })
    connection.end();
}

//回复
function replayMessage(success,tabId,userId,messId,message){
    var querySql = "insert into replay(`tabId`,`userId`,`messId`,`isPick`,`message`) values (?,?,?,0,?);";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[tabId,userId,messId,message],function (error,result){
        if(error){
            success({"code": 0,"error" : error})
        }else{
            UserReplayNumAdd(function (data) {
                // success(data)
            },userId)
            tabReplayNumAdd(function(data){
                success(data)
            },tabId)
        }
    })
    connection.end();
}

//userid获取点赞回复 按日期降序 限制
function userIdGetPickRelayNum (success,userId,page,num) {
    var querySql = "SELECT * FROM messageBoard.replay where userId = ? order by ctime desc limit " + page + "," + num + ";";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[userId],function (error,result){
        if(error){
            //服务器错误
            success({"code": 0,"error": error})
        }else{
            success({"code": 1,"data": result})
        }
    })
    connection.end();
}

//tabId 获取回复
function tabIdGetPickRelayNum(success,tabId){
    var querySql = "SELECT * FROM messageBoard.replay where tabId = ? and isPick = 0 order by ctime desc;";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[tabId],function (error,result){
        if(error){
            //服务器错误
            success({"code": 0,"error": error})
        }else{
            success({"code": 1,"data": result})
        }
    })
    connection.end();
}

//添加留言
function addMessage (success,userId,content) {
    var querySql = "insert into messageBoard.write(`userId`,`content`) values (?,?);";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[userId,content],function (error,result){
        if(error){
            success({"code": 0,"error" : error})
        }else{
           success({"code": 1})
        }
    })
    connection.end();
}

//userId 获取留言总个数
function UserIdGetMessNum(success,userId) {
    var querySql = "select count(1) from messageBoard.write where userId = ?;";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[userId],function (error,result){
        if(error){
            //服务器错误
            success({"code": 0,"error": error})
        }else{
            success({"code": 1,"data": result})
        }
    })
    connection.end();
}

function userIdRemoveAllReplay(success,tabId) {
    var querySql = "delete from messageBoard.replay where tabId = ?;";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[tabId],function (error,result){
        if(error){
            //服务器错误
            success({"code": 0,"error": error})
        }else{
            userIdRemoveAllReplay(function () {
                success({"code": 1,})
            },tabId)
        }
    })
    connection.end();
}
//删除留言
function userIdRemoveMess(success,tabId){
    var querySql = "delete from messageBoard.write where id = ?;";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[tabId],function (error,result){
        if(error){
            //服务器错误
            success({"code": 0,"error": error})
        }else{
            userIdRemoveAllReplay(function () {

            },tabId)
            success({"code": 1,});
        }
    })
    connection.end();
}


module.exports = {
    queryMessage : queryMessage,
    userIdQueryMessage: userIdQueryMessage,
    tabIdQueryMessage: tabIdQueryMessage,
    pickMessage: pickMessage,
    replayMessage: replayMessage,
    userIdGetPickRelayNum: userIdGetPickRelayNum,
    tabIdGetPickRelayNum: tabIdGetPickRelayNum,
    addMessage: addMessage,
    UserIdGetMessNum: UserIdGetMessNum,
    userIdRemoveMess: userIdRemoveMess
}
