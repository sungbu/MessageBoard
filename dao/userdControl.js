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

//注册
function userSignUp (success,phone,username,psd){
    // console.log(111,phone,username,psd);
    var querySql = "insert into user(`phone`,`username`,`psd`) values (?,?,?);";
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[phone,username,psd],function (error,result){
        if(error){
            success({"code": 0,"error": error})
        }else{
            success({"code": 1})
        }
    })
    connection.end();
}

//登录验证
function userSignin (success,phone){
    var querySql = "SELECT * FROM messageBoard.user where phone = ?"
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[phone],function (error,result){
        if(error){
            //服务器错误
            success({"code": 0,"error": error})
        }else{
            if(result.length < 1){
                //未注册
                success({"code": 1})
            }else{
                //已查到
                success({"code": 2,"data": result})
            }
        }
    })
    connection.end();
}

//以id 找到用户信息
function idQueryUser(success,userId){
    var querySql = "SELECT * FROM messageBoard.user where id = ?;"
    var connection = createConnection();
    connection.connect();
    connection.query(querySql,[userId],function (error,result){
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

module.exports = {
    userSignUp : userSignUp,
    userSignin : userSignin,
    idQueryUser : idQueryUser
}
