$ = function(el) {
	return document.querySelector(el);
};

$$ = function(el) {
	return document.querySelectorAll(el);
};

// addEventHandler方法，跨浏览器实现事件绑定
function addEventHandler(ele, event, handler) {
	if (ele.addEventListener) {
		ele.addEventListener(event, handler, false);
	} else if (ele.attachEvent) {
		ele.attachEvent("on" + event, handler);
	} else {
		ele["on" + event] = handler;
	}
}

var input = $$('input'),
	input_1 = input[0],
	input_2 = input[1],
	stuBtn = $('.stu-login'),
	adminBtn = $('.admin-login');



//学生登录
function studentLogin() {
	var stuId = input[0].value,
		stuName = input[1].value,
		query = new AV.Query('Student');

	if (stuId == '' || stuName == '') {
		alert('请填写完整!');
		return;
	}

	//若后台有该学生信息，则更新数据
	query.equalTo('stuId', stuId);
	query.find().then(function(result) {
		if (result.length != 0) {
			student = result[0];
			student.set('stuId', stuId);
			student.set('stuName', stuName);
			student.save();
			//若后台无该学生信息，则添加至后台
		} else {
			var Student = AV.Object.extend('Student');
			student = new Student();
			student.set('stuId', stuId);
			student.set('stuName', stuName);
			student.save().then(function() {
				console.log('success')
			});
		}
	})

	localStorage.setItem('stuId', stuId);
	localStorage.setItem('stuName', stuName);
	window.location.href = "/";
}

function init() {
	if (localStorage.getItem('stuId') && localStorage.getItem('stuName')) {
		window.location.href = "/"
	} else {
		addEventHandler(stuBtn, 'click', studentLogin);
	}
}

init();