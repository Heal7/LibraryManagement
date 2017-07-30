$ = function(el) {
	return document.querySelector(el);
};

$$ = function(el) {
	return document.querySelectorAll(el);
};

var stuId = localStorage.getItem('stuId');
var stuName = localStorage.getItem('stuName');
$$('a')[0].innerHTML = stuName; //页面显示用户姓名

if (stuId == null || stuName == null) {
	window.location.href = "/pages/login.html";
}



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

function showTag() {
	var tagBox = $('.tag-box');
	if (tagBox.style.display == 'none' || tagBox.style.display == '') {
		tagBox.style.display = 'block';
	} else {
		tagBox.style.display = 'none';
	}
}

function showDefaultBooks() {
	var query = new AV.Query('Book'),
		bookBox = $('.book-box'),
		bookList, books = [],
		len;

	query.find().then(function(result) {
		bookBox.innerHTML = '';
		len = result.length > 7 ? 7 : result.length;
		for (let i = 0; i < len; i++) {
			books[i] = result[i].attributes;
			bookBox.innerHTML += renderBookList(books[i]);
			bookList = $$('.book-list');
		}
		for (let j in books) {
			addEventHandler(bookList[j], 'click', function(e) {
				showDetail(e, books[j]);
			})
		}
	})
}

function inputSearch() {
	var inputValue = $('.search-input').value,
		inputValueArr = inputValue.split(''),
		name = new RegExp(inputValueArr.join('.*')),
		query = new AV.Query('Book'),
		bookBox = $('.book-box'),
		bookList,
		books = [];

	query.matches('name', name);
	query.find().then(function(result) {
		if (result.length == 0) {
			bookBox.innerHTML = '<div>暂无该类书籍</div>';
			return;
		}
		bookBox.innerHTML = '';
		for (let i = 0; i < result.length; i++) {
			books[i] = result[i].attributes;
			bookBox.innerHTML += renderBookList(books[i]);
			bookList = $$('.book-list');
		}
		for (let j in books) {
			addEventHandler(bookList[j], 'click', function(e) {
				showDetail(e, books[j]);
			})
		}
	})
}

function tagSearch(e) {
	e = e || window.event;
	var target = e.target || e.srcElement,
		query = new AV.Query('Book'),
		bookBox = $('.book-box'),
		tagBox = $('.tag-box'),
		bookList,
		books = [],
		tag;

	if (target.tagName == 'LI') {
		tag = target.innerHTML;
		query.equalTo('tag', tag);
		query.find().then(function(result) {
			if (result.length == 0) {
				bookBox.innerHTML = '<div>暂无该类书籍</div>';
				return;
			}
			tagBox.style.display = 'none';
			bookBox.innerHTML = '';
			for (let i = 0; i < result.length; i++) {
				books[i] = result[i].attributes;
				bookBox.innerHTML += renderBookList(books[i]);
				bookList = $$('.book-list');
			}
			for (let j in books) {
				addEventHandler(bookList[j], 'click', function(e) {
					showDetail(e, books[j]);
				})
			}
		})
	}
}

function renderBookList(book) {
	var temp = '',
		status,
		anotherClass;

	switch (book.status) {
		case 0:
			status = '可借';
			anotherClass = 'cyan';
			break;
		case 1:
			status = '不可借';
			anotherClass = 'yellow';
			break;
		case 2:
			status = '不可借';
			anotherClass = 'yellow';
			break;
	}

	temp = '<li class="book-list"><div class="name">' + book.name + '</div><img src="/image/list_arrow.png"></img>' + '<div class="author">作者：' + book.info.author + '</div><div class="status ' + anotherClass + '">状态：' + status + '</div>'
	return temp;
}

function showDetail(e, book) {
	e = e || window.event;
	var target = e.target || e.srcElement;
	if (target.tagName == 'LI' || target.tagName == 'DIV' || target.tagName == 'IMG') {
		window.location.href = "/pages/detail.html";
		localStorage.setItem('book', JSON.stringify(book));
	}
}

function logout() {
	localStorage.clear();
	window.location.href = "/pages/login.html";
}

function init() {
	var logoutBtn = $$('li')[1],
		tagBtn = $('.tag'),
		hiddenTag = $('.up'),
		searchInput = $('.search-input'),
		tagBox = $('.tag-box');
	showDefaultBooks();
	addEventHandler(logoutBtn, 'click', logout);
	addEventHandler(tagBtn, 'click', showTag);
	addEventHandler(searchInput, 'input', inputSearch);
	addEventHandler(tagBox, 'click', function(e) {
		tagSearch(e);
	});
	addEventHandler(hiddenTag, 'click', function() {
		tagBox.style.display = 'none';
	})
}
init();