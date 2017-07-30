$ = function(el){
	return document.querySelector(el);
};

$$ = function(el){
	return document.querySelectorAll(el);
};

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


function adminLogin(){
	var adminName = $('#adminName').value,
		adminPwd = $('#adminPwd').value;
	if(adminName == ''){
		$('#adminName').placeholder = '请输入管理员账号';
		return;
	}
	if(adminPwd == ''){
		$('#adminPwd').placeholder = '请输入管理员密码';
		return;
	}
	AV.User.logIn(adminName,adminPwd).then(
    function(res){
      console.log(res);
      localStorage.setItem('adminName',adminName);
      window.location.href='/pages/adminIndex.html'
    },function(req){
      if(req.message === 'Could not find user.'){
        $('#adminName').placeholder = '管理员不存在'
      }
      if(req.message === 'The username and password mismatch.'){
        $('#adminPwd').placeholder = '密码错误'
      }
  })
}

function init(){
	var adminLoginBtn = $('.admin-login');
	addEventHandler(adminLoginBtn, 'click', adminLogin);
}

init()