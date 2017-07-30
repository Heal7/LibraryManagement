$ = function(el) {
	return document.querySelector(el);
};

$$ = function(el) {
	return document.querySelectorAll(el);
};

var adminName = localStorage.getItem('adminName');
$('.admin-name').innerHTML = adminName;


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
			utils.addEventHandler(bookList[j], 'click', function() {
				showInfo(books[j]);
			})
		}
	})
}

function showTags() {
	var tagBox = $('.tag-box'),
		activeTags = $$('.active');

	if (tagBox.style.display == 'none' || tagBox.style.display == '') {
		tagBox.style.display = 'block';
		if (activeTags != undefined) {
			for (let i = 0; i < activeTags.length; i++) {
				activeTags[i].setAttribute('class', '');
			}
		}
	} else {
		tagBox.style.display = 'none';
	}
}

function chooseTag(e) {
	e = e || window.event;
	var target = e.target || e.srcElement,
		tags = $('.tags').children,
		prompts = $('.prompt').children;

	if (target.tagName == 'LI') {
		if (target.innerHTML == '所有' || target.innerHTML == '可借' || target.innerHTML == '待还' || target.innerHTML == '丢失') {
			for (let j in prompts) {
				prompts[j].className = '';
			}
			target.setAttribute('class', 'active');
		} else {
			for (let i in tags) {
				tags[i].className = '';
			}
			target.setAttribute('class', 'active');
		}
	}
}

function inputSearch() {
	var inputValue = $('.search-input').value,
		inputValueArr = inputValue.split(''),
		name = new RegExp(inputValueArr.join('.*')),
		query = new AV.Query('Book'),
		bookBox = $('.book-box'),
		bookInfo = $('.book-info'),
		bookList,
		books = [];

	bookInfo.innerHTML = '';
	query.matches('name', name);
	query.find().then(function(result) {
		if (result.length == 0) {
			bookBox.innerHTML = '<div>暂无</div>';
			return;
		}
		bookBox.innerHTML = '';
		for (let i = 0; i < result.length; i++) {
			books[i] = result[i].attributes;
			bookBox.innerHTML += renderBookList(books[i]);
			bookList = $$('.book-list');
		}
		for (let j in books) {
			utils.addEventHandler(bookList[j], 'click', function() {
				showInfo(books[j]);
			})
		}
	})
}

function tagSearch() {
	var tags = $$('.active'),
		tag,
		status,
		query = new AV.Query('Book'),
		tagBox = $('.tag-box'),
		bookBox = $('.book-box'),
		books = [];

	if (tags.length < 2) {
		return;
	}
	tag = tags[0].innerHTML;
	switch (tags[1].innerHTML) {
		case '所有':
			break;
		case '可借':
			status = 0;
			break;
		case '待还':
			status = 1;
			break;
		case '不可借':
			status = 2;
			break;
	}
	setTimeout(function() {
		tagBox.style.display = 'none';
	}, 500)
	if (status == undefined) {
		query.equalTo('tag', tag);
	} else {
		var tagQuery = new AV.Query('Book');
		tagQuery.equalTo('tag', tag);
		var statusQuery = new AV.Query('Book');
		statusQuery.equalTo('status', status);
		query = AV.Query.and(tagQuery, statusQuery);
	}

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
			utils.addEventHandler(bookList[j], 'click', function() {
				showInfo(books[j]);
			})
		}
	})
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

function showInfo(book) {
	var bookBox = $('.book-box'),
		bookInfo = $('.book-info'),
		status, anotherClass, btnClass = '',
		infoBox = $('.info-box'),
		summary = book.info.summary.substring(0, 120) + '...';

	// bookBox.innerHTML = '';
	switch (book.status) {
		case 0:
			status = '可借';
			anotherClass = 'cyan';
			break;
		case 1:
			status = book.nowOwner + '借阅中';
			anotherClass = 'yellow';
			btnClass = 'grey';
			break;
		case 2:
			status = '不可借';
			anotherClass = 'yellow';
			break;
	}

	bookInfo.innerHTML = '<h3>' + book.name + '</h3><div class="author">作者：' + book.info.author + '</diV><div class="info-status ' + anotherClass + '">状态：' + status +
		'</div><div>内容简介：</div><div class="summary">' + summary + '</div>' +
		'<button class="modify ' + btnClass + '">修改状态</button><button class="delete ' + btnClass + '">删除该书</button>';
	infoBox.style.display = 'block';

	utils.addEventHandler(infoBox, 'click', function() {
		infoBox.style.display = 'none';
	})
	utils.addEventHandler(bookInfo, 'click', function(e) {
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	})
	var modifyBtn = $('.modify');
	utils.addEventHandler(modifyBtn, 'click', function(e) {
		modifyBook(book);
	});
	var deleteBtn = $('.delete');
	utils.addEventHandler(deleteBtn, 'click', function(e) {
		deleteBook(book);
		infoBox.style.display = 'none';
	});
}


function modifyBook(book) {
	var modifyBtn = $('.modify'),
		infoStatus = $('.info-status'),
		modifyStatus, anotherClass,
		query = new AV.Query('Book'),
		oldBook, statusNum,
		inputValue = $('.search-input').value,
		activeBtn = $$('.active');

	switch (infoStatus.innerHTML) {
		case '状态：可借':
			modifyStatus = '状态：不可借';
			anotherClass = 'yellow';
			statusNum = 2;
			break;
		case '状态：不可借':
			modifyStatus = '状态：可借';
			anotherClass = 'cyan';
			statusNum = 0;
			break;
	}

	infoStatus.innerHTML = modifyStatus;
	infoStatus.setAttribute('class', 'status ' + anotherClass);
	query.equalTo('name', book.name);
	query.find().then(function(result) {
		oldBook = result[0];
		oldBook.set('status', statusNum);
		oldBook.save();
	})

	if (inputValue != '') {
		inputSearch();
	} else if (activeBtn.length > 0) {
		tagSearch();

	} else {
		showDefaultBooks()
	}
}

function deleteBook(book) {
	var query = new AV.Query('Book'),
		oldBook, objectId;

	if (confirm('删除不可恢复，您确认删除该书籍？')) {
		query.equalTo('name', book.name);
		query.find().then(function(result) {
			oldBook = result[0];
			objectId = oldBook.id;

			var delBook = AV.Object.createWithoutData('Book', objectId);
			delBook.destroy().then(function(success) {
				console.log('success');
				showDefaultBooks();
			}, function(error) {});
		})
	} else {
		return false;
	}

}

function logout() {
	if (confirm('您确认退出登录吗？')) {
		window.location.href = "/pages/adminLogin.html";
	} else {
		return false;
	}
}


function init() {
	var tagBtn = $('.tag'),
		tagBox = $('.tag-box'),
		searchInput = $('.search-input'),
		bookInfo = $('.book-info'),
		hiddenTag = $('.up'),
		logoutBtn = $('.logout');

	showDefaultBooks();
	utils.addEventHandler(tagBtn, 'click', showTags);
	utils.addEventHandler(tagBox, 'click', function(e) {
		chooseTag(e);
		tagSearch();
	})
	utils.addEventHandler(searchInput, 'input', inputSearch);
	utils.addEventHandler(hiddenTag, 'click', function() {
		tagBox.style.display = 'none';
	})
	utils.addEventHandler(logoutBtn, 'click', logout);
}

init();