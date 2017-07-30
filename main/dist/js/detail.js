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

var stuId = localStorage.getItem('stuId'),
	stuName = localStorage.getItem('stuName'),
	book = JSON.parse(localStorage.getItem('book'));
$$('a')[0].innerHTML = stuName;//页面显示用户姓名

function renderPage(){
	var book = JSON.parse(localStorage.getItem('book')),
		info = $('.info'),
		btn = $('button'),
		status,anotherClass,btnClass,btnValue,
		summary = book.info.summary.substring(0,120) + '...';

	switch(book.status){
		case 0 : status = '可借';
				 anotherClass = 'cyan'; 
				 btnClass = 'borrow'; 
				 btnValue = '借书'; 
				 break;
		case 1 : status = book.nowOwner+'借阅中'; 
				 anotherClass = 'yellow'; 
				 btnClass = book.nowOwner == stuName ? 'back':'wait'; 
				 btnValue = book.nowOwner == stuName ? '还书':'等待归还'
				 break;
		case 2 : status = '不可借'; 
				 anotherClass = 'yellow'; 
				 btnClass = 'wait'; 
				 btnValue = '不可借';
				 break;
	}
	btn.setAttribute('class',btnClass);
	btn.innerHTML = btnValue;
	info.innerHTML = '<h3>'+book.name+'</h3><div class="author">作者：'+book.info.author+'</diV><div class="status '+anotherClass+'">状态：'+status+
	'</div><div>内容简介：</div><div class="summary">'+summary+'</div>';
}




//借书后更新数据(目前假设每个书名只有一本书，暂时根据书名查询)
function borrowSave(){
	var query = new AV.Query('Book'),
		student = new AV.Query('Student'),
		oldBook;
	query.equalTo('name',book.name);
	query.find().then(function(result){
		oldBook = result[0];
		borrowers = oldBook.borrowers;
		if(borrowers == undefined){
			borrowers = [];
		}
		borrowers.push([stuId,stuName]);
		//更新状态、现借书人、借阅时间
		oldBook.set('status',1);
		oldBook.set('nowOwner',stuName);
		oldBook.set('borrowDate',new Date());
		oldBook.set('borrowers',borrowers);
		oldBook.save();

		student.equalTo('stuId',stuId);
		student.find().then(function(result){
			oldStudent = result[0];
			//更新学生的正在借阅
			oldStudent.set('borrowing',book.name);
			oldStudent.save();
		})
	})
}

//还书时更新数据
function backSave(){
	var query = new AV.Query('Book'),
		student = new AV.Query('Student'),
		oldBook,oldStudent,record = [],records,borrowDate;
	query.equalTo('name',book.name);
	query.find().then(function(result){
		oldBook = result[0];
		borrowDate = oldBook.attributes.borrowDate;
		//更新状态、现借书人、借阅时间
		oldBook.set('status',0);
		oldBook.set('nowOwner','');
		oldBook.set('borrowDate',null);
		oldBook.save();

		student.equalTo('stuId',stuId);
		student.find().then(function(result){
			oldStudent = result[0];
			records = oldStudent.attributes.records;
			record.push(book.name);
			record.push(getFormatTime(borrowDate));
			record.push(getFormatTime(new Date()));
			if(records == undefined || records == null){
				records = [];
				records.push(record);
			}else{
				records.push(record);
			}
			//更新学生的借阅记录
			oldStudent.set('records',records);
			oldStudent.save();
		})
	})
}

//按钮事件
function btnEvent(){
	var btn = $('button'),
		status = $('.status');
	if(btn.innerHTML == '借书'){
		btn.innerHTML = '还书';
		btn.setAttribute('class','back');
		status.innerHTML = '状态：' + stuName + '借阅中';
		status.setAttribute('class','status yellow');
		alert('借书成功！');
		borrowSave();
		return;
	}
	if(btn.innerHTML == '还书'){
		btn.innerHTML = '借书';
		btn.setAttribute('class','borrow');
		status.innerHTML = '状态：可借';
		status.setAttribute('class','status cyan');
		alert('还书成功！');
		backSave();
		return;
	}
}

//点击简介
function bindSummary(){
	var summary = $('.summary'),
		book = JSON.parse(localStorage.getItem('book'));

	if(summary.innerHTML.length <= 130){
		summary.innerHTML = book.info.summary;
	}else{
		summary.innerHTML = book.info.summary.substring(0,120) + '...';
	}
}

function getFormatTime(date){
	var year = date.getFullYear(),
        month = date.getMonth()+1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();

    month   = month < 10 ? '0'+month : month;
    day     = day < 10 ? '0' + day : day;
    hour    = hour < 10 ? '0' + hour : hour;
    minute  = minute < 10 ? '0' + minute : minute;
    second  = second < 10 ? '0' + second : second;
    var newDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return newDate;
}

function init(){
	var btn = $('button'),
		summary;

	renderPage();
	addEventHandler(btn, 'click', btnEvent);

	summary = $('.summary');
	addEventHandler(summary, 'click', bindSummary);
}

init();

