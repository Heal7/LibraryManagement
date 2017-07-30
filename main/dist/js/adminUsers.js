$ = function(el) {
	return document.querySelector(el);
};

$$ = function(el) {
	return document.querySelectorAll(el);
};

var adminName = localStorage.getItem('adminName');
$('.admin-name').innerHTML = adminName;

function idSearch() {
	var inputValue = $('.id-input').value,
		inputValueArr = inputValue.split(''),
		stuId = new RegExp(inputValueArr.join('.*')),
		userBox = $('.user-box'),
		query = new AV.Query('Student'),
		users = [];

	query.matches('stuId', stuId);
	query.find().then(function(result) {
		if (result.length == 0) {
			userBox.innerHTML = '<div>暂无</div>';
			return;
		}
		userBox.innerHTML = '';
		for (let i = 0; i < result.length; i++) {
			users[i] = result[i].attributes;
			userBox.innerHTML += renderUserList(users[i]);
			userList = $$('.user-list');
		}
		for (let j in users) {
			utils.addEventHandler(userList[j], 'click', function() {
				showInfo(users[j]);
			})
		}
	})
}

function renderUserList(user) {
	var temp, borrowing;
	borrowing = user.borrowing ? '《' + user.borrowing + '》' : '无';
	temp = '<li class="user-list"><div class="id">学号：' + user.stuId + '</div><img src="/image/list_arrow.png"></img>' +
		'<div class="name">姓名：' + user.stuName + '</div><div class="borrowing">正在借阅：' + borrowing + '</div>'
	return temp;
}

function showInfo(user) {
	var infoBox = $('.info-box'),
		userInfo = $('.user-info'),
		record, temp, borrowing;
	borrowing = user.borrowing ? '《' + user.borrowing + '》' : '无';
	temp = '<div>学号：' + user.stuId + '</div><div>姓名：' + user.stuName + '</div><div>正在借阅：' + borrowing + '</div>';
	if (!user.records) {
		temp += '<span>无借阅记录</span>';
	} else {
		temp += '<h3>借阅记录</h3><table class="record-list"><tr><th>书名</th><th>借阅日期</th><th>归还日期</th></tr>';
		for (var i = 0; i < user.records.length; i++) {
			record = user.records[i];
			temp += '<tr><td>' + record[0] + '</td><td>' + record[1].slice(0, 10) + '</td><td>' + record[2].slice(0, 10) + '</td></tr>'
		}
		temp += '</table>';
	}

	userInfo.innerHTML = temp;
	infoBox.style.display = 'block';

	utils.addEventHandler(infoBox, 'click', function() {
		infoBox.style.display = 'none';
	})
	utils.addEventHandler(userInfo, 'click', function(e) {
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	})
}

function logout() {
	if (confirm('您确认退出登录吗？')) {
		window.location.href = "/pages/adminLogin.html";
	} else {
		return false;
	}
}

function init() {
	var idInput = $('.id-input'),
		logoutBtn = $('.logout');
	utils.addEventHandler(idInput, 'input', idSearch);
	utils.addEventHandler(logoutBtn, 'click', logout);
}
init();