$ = function(el) {
    return document.querySelector(el);
};

$$ = function(el) {
    return document.querySelectorAll(el);
};

var adminName = localStorage.getItem('adminName');
$('.admin-name').innerHTML = adminName;


function books() {
    window.location.href = "/pages/adminBooks.html";
}

function users() {
    window.location.href = "/pages/adminUsers.html";
}

function scan() {
    window.location.href = "/pages/adminScan.html";
}

function moreInfo() {

}

function init() {
    var booksBtn = $('.books'),
        usersBtn = $('.users'),
        scanBtn = $('.scan'),
        moreInfoBtn = $('.more');

    utils.addEventHandler(booksBtn, 'click', books);
    utils.addEventHandler(usersBtn, 'click', users);
    utils.addEventHandler(scanBtn, 'click', scan);
    utils.addEventHandler(moreInfoBtn, 'click', moreInfo);
}

init();