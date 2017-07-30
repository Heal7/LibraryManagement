var express = require('express')
var app = express();//express将app初始化成一个函数处理器
var http = require('http').createServer(app);//将app提供给HTTP服务器
var path = require('path');
//var io = require('socket.io')(http);//传递http（HTTP Server）对象创建一个新的socket.io实例

app.use(express.static(path.join(__dirname,'dist')));

app.get('/',function(req,res){//路由处理器，访问主页时，处理器被调用
	res.sendFile(__dirname + '/index.html');
});


http.listen(7070,function(){//http服务器监听3000端口
	console.log('listening on *:7070');
});
