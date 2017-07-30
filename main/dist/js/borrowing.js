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

function searchBorrowing(){
	var main = $('.main'),
		query = new AV.Query('Book'),
		books = [],
		bookList;

	query.equalTo('nowOwner',stuName);
	query.find().then(function(result){
		if(result.length == 0){
			main.innerHTML = '<div>当前无借阅！<div>'
			return;
		}
		main.innerHTML = '';
		for(let i in result){
			books[i] = result[i].attributes;
			main.innerHTML += renderPage(books[i]);
			bookList = $$('.book-list');
		}
		for(let j in books){
			addEventHandler(bookList[j], 'click' , function(){
				showDetail(books[j]);
			})
		}
	})
}

function renderPage(book){
	var temp = '',
		borrowDate = book.borrowDate,
		nowDate = new Date(),
		days = parseInt(Math.abs(nowDate - borrowDate)/1000/60/60/24);

	temp = '<table class="book-list"><tr><td>书&ensp;&ensp;&ensp;&ensp;名</td><td>'+book.name+'</td></tr>'+
			'<tr><td>借阅日期</td><td>'+getFormatTime(borrowDate)+'</td></tr>'+
			'<tr><td>已借天数</td><td>'+ days +'天</td></tr>'+
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

function showDetail(book){
	localStorage.setItem('book',JSON.stringify(book));
	window.location.href = '/pages/detail.html';
}

searchBorrowing();


