$ = function(el){
	return document.querySelector(el);
};

$$ = function(el){
	return document.querySelectorAll(el);
};

var stuId = localStorage.getItem('stuId');
var stuName = localStorage.getItem('stuName');
$$('a')[0].innerHTML = stuName;//页面显示用户姓名
$('.greet').innerHTML += stuName;


// addEventHandler方法，跨浏览器实现事件绑定
function addEventHandler(ele,event,handler){
  if(ele.addEventListener){
    ele.addEventListener(event,handler,false);
  }else if(ele.attachEvent){
    ele.attachEvent("on"+event,handler);
  }else{
    ele["on"+event] = handler;
  }
}

function showInfo(e){
	e = e || window.event;
	var target = e.target || e.srcElement,
		liText = target.innerHTML.substring(0,4);

	switch(liText){
		case '正在借阅': window.location.href = '/pages/borrowing.html'; break;
		case '借阅记录': window.location.href = '/pages/records.html'; break;
		case '退出登录': logout(); break;
	}
}

function logout(){
	localStorage.clear();
	window.location.href = " /";
}

function init(){
	var info = $('.info');
	addEventHandler(info, 'click', function(e){
		showInfo(e);
	})
}

init();