$ = function(el){
	return document.querySelector(el);
};

$$ = function(el){
	return document.querySelectorAll(el);
};

var stuId = localStorage.getItem('stuId');
var stuName = localStorage.getItem('stuName');
$$('a')[0].innerHTML = stuName;//页面显示用户姓名


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

function searchRecords(){
	var main = $('.main'),
		query = new AV.Query('Student'),
		student,records,recordList;

	query.equalTo('stuId',stuId);
	query.find().then(function(result){
		student = result[0].attributes;
		records = student.records;
		if(records == undefined || records.length == 0){
			main.innerHTML = '<div>当前无借阅记录！</div>';
			return;
		}
		main.innerHTML = '';
		for(let i = 0 ,len = records.length; i < len ; i++){
			main.innerHTML += renderPage(records[i]);
			recordList = $$('.record-list');
		}
		for(let j = 0 , len = records.length; j < len ; j++){
			addEventHandler(recordList[j], 'click' , function(){
				showDetail(records[j][0]);
			})
		}
	})
}

function renderPage(record){
	var temp = '',

	temp = '<table class="record-list"><tr><td>书&ensp;&ensp;&ensp;&ensp;名</td><td>'+record[0]+'</td></tr>'+
			'<tr><td>借阅日期</td><td>'+record[1]+'</td></tr>'+
			'<tr><td>归还日期</td><td>'+record[2]+'</td></tr>'+
			'<tr><td></td><td class="detail">详细信息></td>'+'</table>';
	return temp;
}

function getFormatTime(date){
	var year = date.getFullYear(),
        month = date.getMonth()+1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();
    month = month < 10 ? '0'+month : month;
    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    var newDate = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
    return newDate;
}

function showDetail(bookName){
	var query = new AV.Query('Book'),
		bookObj; 
	query.equalTo('name',bookName);
	query.find().then(function(result){
		bookObj = result[0].attributes;
		localStorage.setItem('book',JSON.stringify(bookObj));
		window.location.href = '/pages/detail.html';
	})	
}

searchRecords();

