var adminName = localStorage.getItem('adminName');
$('.admin-name').html(adminName);

function scanFile() {
    $("#scanner-container button").on("click", function(e) {
        var input = document.querySelector("#scanner-container input[type=file]");
        if (input.files && input.files.length) {
            Quagga.decodeSingle({
                inputStream: {
                    size: 800 // 这里指定图片的大小，需要自己测试一下
                },
                locator: {
                    patchSize: "medium",
                    halfSample: false
                },
                numOfWorkers: 1,
                decoder: {
                    readers: [{
                        format: "ean_reader", // 这里指定ean条形码，就是国际13位的条形码
                        config: {}
                    }]
                },
                locate: true,
                src: URL.createObjectURL(input.files[0])
            }, function(result) {
                showBookData(result.codeResult.code);
            });
        } else {
            showBookData();
        }
    });
}

var jsonp = function(url, callback) {
    if (typeof url === 'undefined') {
        throw 'the 1st param "url" missing';
    }

    if (typeof callback === 'undefined') {
        throw 'the 2nd param "callback" missing';
    }

    var jsonpcallback = 'callback' + new Date().valueOf();
    if (typeof callback !== 'string') {
        window[jsonpcallback] = callback;
        callback = jsonpcallback;
    } else {
        window[jsonpcallback] = function(data) {
            eval(callback).call(window, data);
        }
    }

    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url + (url.indexOf('?') == -1 ? '?' : '&') + 'callback=' + jsonpcallback);
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
};

function showBookData(isbn) {
    var name, tag, info = {},
        tagArr = [],
        addBookBox = $('.add-book-box'),
        addBookBtn = $('.add-book-btn');
    addBookBox.css('display', 'block');

    if (isbn) {
        jsonp('https://api.douban.com/v2/book/isbn/' + isbn, function(bookData) {
            name = bookData.title;
            for (var i = 0; i < bookData.tags.length; i++) {
                var tagTemp = bookData.tags[i];
                tagArr.push(tagTemp.name);
            }
            tag = tagArr.join(',');
            author = bookData.author[0];
            publisher = bookData.publisher;
            pubdate = bookData.pubdate;
            summary = bookData.summary;


            $('.isbn').val(isbn);
            $('.name').val(name);
            $('.author').val(author);
            $('.summary').val(summary);
            $('.publisher').val(publisher);
            $('.pubdate').val(pubdate);
            $('.tag').val(tag);

            addBookBtn.on("click", addBook);
        });
    } else {
        addBookBtn.on("click", addBook);
    }

}

function addBook() {
    var isbn, name, tag, info = {},
        status = 0;
    isbn = $('.isbn').val();
    name = $('.name').val();
    info.author = $('.author').val();
    info.summary = $('.summary').val();
    info.publisher = $('.publisher').val();
    info.pubdate = $('.pubdate').val();
    tag = $('.tag').val();

    //将该书籍添加至后台
    var Book = AV.Object.extend('Book');
    var book = new Book();
    book.set('isbn', isbn);
    book.set('name', name);
    book.set('tag', tag);
    book.set('info', info);
    book.set('status', status);
    book.save().then(function() {
        alert('入库成功！');
        window.location = '/pages/adminScan.html';
    });

}

function logout() {
    if (confirm('您确认退出登录吗？')) {
        window.location.href = "/pages/adminLogin.html";
    } else {
        return false;
    }
}

function init() {
    var logoutBtn = $('.logout');
    scanFile();
    utils.addEventHandler(logoutBtn, 'click', logout);
}

init();