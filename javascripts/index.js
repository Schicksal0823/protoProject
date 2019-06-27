// 给element绑定一个针对event事件的响应，响应函数为listener
function addFuc(ele, event, listener) {
    if (ele.addEventListener) {
        ele.addEventListener(event, listener, false);
    } else if (ele.attachEvent) {
        ele.attachEvent("on" + event, listener);
    } else {
        ele["on" + event] = listener;
    }
}
// 判断element是否有className
function hasClass(ele, className) {
    var list = ele.className.split(/\s+/);
    for (var i = 0; i < list.length; i++) {
        if (list[i] == className) {
            return true;
        }
    }
    return false;
}
// 为element增加一个className
function addClass(ele, className) {
    var list = ele.className.split(/\s+/);
    if (!list[0]) {
        ele.className = className;
    } else {
        ele.className += ' ' + className;
    }
};
// 移除element中的className
function removeClass(ele, className) {
    var list = ele.className.split(/\s+/);
    if (!list[0]) return;
    for (var i = 0; i < list.length; i++) {
        if (list[i] == className) {
            list.splice(i, 1);
            ele.className = list.join(' ');
        }
    }
};

//通过class获取节点
// function getElementsByClassName(className) {
//     var classArr = [];
//     var tags = document.getElementsByTagName('*');
//     for (var i = 0; i < tags.length; i++) {
//         if (tags[i].nodeType == 1) {
//             if (tags[i].getAttribute('class') == className) {
//                 classArr.push(tags[i]);
//             }
//         }
//     }
//     return classArr; //返回
// }

// addLoadEvent函数
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}

//获取id
function getElementById$(id) {
    return document.getElementById(id);
}

//////////////////////////////////////////////////
//Ajax封装
function ajax(obj) {
    //创建xhr对象
    //var xhr = (function(){...})(); 自调用
    var xhr = (function () {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    })();

    //添加一个唯一的ID，
    obj.url = obj.url + '?rand=' + Math.random();

    //添加转义字符
    obj.data = (function (data) {
        var arr = [];
        for (var i in data) {
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
        }
        return arr.join('&');
    })(obj.data);

    //判断使用的是否是get请求
    if (obj.method === 'get') {
        obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
    }

    //异步
    if (obj.async === true) {
        //异步时需要触发onreadystatechange事件
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                callback();
            }
        };
    }

    xhr.open(obj.method, obj.url, obj.async);

    //判断使用的是否是post请求
    if (obj.method === 'post') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(obj.data);
    } else {
        xhr.send(null);
    }

    //同步
    if (obj.async === false) {
        callBack();
    }

    //返回数据
    function callback() {
        if (xhr.status == 200) {
            obj.success(xhr.responseText);
        } else {
            obj.error("获取数据失败，错误代号为：" + xhr.status + "错误信息为：" + xhr.statusText);
        }
    }
}

//////////////////////////////////////////////////
//通知
//检查cookie
function checkCookie() {
    //如果通知条tipCookie已设置，则不再显示通知条
    if (getCookie("tipCookie") === "tipCookieValue") {
        hideTip();
    }
}
addFuc(window, "onbeforeunload", checkCookie());

//添加tipClose点击事件，并设置cookie
function closeTip() {
    var tipClose = document.getElementById("tipClose");
    addFuc(tipClose, "click", function () {
        hideTip();
        setCookie("tipCookie", "tipCookieValue", 30);
    });
}
addLoadEvent(closeTip);

//隐藏通知条
function hideTip() {
    var tip = document.getElementById("tip");
    tip.style.display = "none";
}
//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取cookie值
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}
//////////////////////////////////////////////////
//关注

//////////////////////////////////////////////////
//登入

//////////////////////////////////////////////////
//轮播图
function carousel() {
    //获取各元素，方便操作
    var banner = getElementById$("banner");
    var list = banner.children[0];
    var img = list.children;
    var buttons = banner.children[1];
    var liObj = buttons.children;
    var imgWidth = 1652;
    var len = img.length;
    var pic = 0;
    var arrowP = getElementById$("arrowP");
    var arrowN = getElementById$("arrowN");
    var oldleft = list.offsetLeft;

    //拷贝第一个图到尾部作为过渡元素
    list.appendChild(list.children[0].cloneNode(true));

    for (var i = 0; i < len; i++) {
        //设置属性id=1,2,3 ...
        liObj[i].id = i;
        //为按钮注册mouseover事件
        liObj[i].onmouseover = function () {
            //清除所有按钮的class
            for (var j = 0; j < len; j++) {
                liObj[j].removeAttribute("class");
            }
            //当前按钮class=”on"
            this.className = "on";
            pic = this.id;
            animate(list, -pic * imgWidth);
        }
    }


    //实现图片轮播动画
    function animate(element, target) {
        clearInterval(element.timeId);
        //定时器的id值存储到对象的一个属性中
        element.timeId = setInterval(function () {
            //获取元素的当前的位置,数字类型
            var current = element.offsetLeft;
            //每次移动的距离
            var step = 20;
            step = current < target ? step : -step;
            //当前移动到位置
            current += step;
            if (Math.abs(current - target) > Math.abs(step)) {
                element.style.left = current + "px";
            } else {
                //清理定时器
                clearInterval(element.timeId);
                //直接到达目标
                element.style.left = target + "px";
            }
        }, 10);
    }

    //点击切换上一张图片
    arrowP.onclick = onclickPre;
    function onclickPre() {
        if (pic == 0) {
            pic = img.length - 1;
            list.style.left = -pic * imgWidth + "px";
        }
        pic--;
        animate(list, -pic * imgWidth);
        for (var i = 0; i < len; i++) {
            liObj[i].removeAttribute("class");
        }
        liObj[pic].className = "on";
    }

    //点击切换下一张图片
    arrowN.onclick = onclickNext;
    function onclickNext() {
        //由最后一张代替第一张的位置
        //再把位置拉到第一张位置
        //然后再滑动，这样就成了无缝滑动
        if (pic == img.length - 1) {
            pic = 0;
            list.style.left = 0 + "px";;
        }
        pic++;
        animate(list, -pic * imgWidth + oldleft);
        if (pic == img.length - 1) {
            //最后一张图实际显示的是第一张图的内容所以点亮第一个按钮
            liObj[liObj.length - 1].className = "";
            liObj[0].className = "on";
        } else {
            //清除所有按钮的class
            for (var i = 0; i < len; i++) {
                liObj[i].removeAttribute("class");
            }
            liObj[pic].className = "on";
        }
    }

    //设置轮播定时器
    var timeID = setInterval(onclickNext, 5000);

    //箭头显示 轮播暂停
    banner.onmouseover = function () {
        arrowP.style.display = "block";
        arrowN.style.display = "block";
        clearInterval(timeID);
    }
    //箭头隐藏 轮播开始
    banner.onmouseout = function () {
        arrowP.style.display = "none";
        arrowN.style.display = "none";
        timeID = setInterval(onclickNext, 5000);
    }
}
addLoadEvent(carousel);

//banner宽度
function bannerWidth() {
    //根据窗口大小，做动态改变banner宽度
    addFuc(window, "resize", function () {
        var banner = getElementById$("banner");
        var oldWidth = banner.offsetWidth;
        var newWidth = document.documentElement.clientWidth;
        var otherWidth = 1205;
        var imgWidth = 1652;
        if (newWidth > oldWidth && newWidth <= imgWidth) {
            banner.style.width = newWidth + "px";
        } else if (newWidth < otherWidth) {
            banner.style.width = otherWidth + "px";
        }
    });

}
addLoadEvent(bannerWidth);
//////////////////////////////////////////////////
//视频弹窗
function videoPlay() {
    var videoimg = getElementById$("videoimg")
    var close = getElementById$("close");

    //显示视频
    addFuc(videoimg, "click", function showVideo() {
        getElementById$("mask").style.display = "block";
        getElementById$("providervideo").style.display = "block";
    });
    //隐藏视频
    addFuc(close, "click", function hideVideo() {
        getElementById$("mask").style.display = "none";
        getElementById$("providervideo").style.display = "none";
        getElementById$("video").pause();
    });
}
addLoadEvent(videoPlay);
//////////////////////////////////////////////////
//最热排行
function hotList() {
    var rdata = null;

    function createLilist(rdata) {
        var elementUl = getElementById$("ulist");
        var elementLi = document.createElement("li");
        var elementImg = document.createElement("img");
        var elementH5 = document.createElement("h5");
        var elementSpan = document.createElement("span");
        elementUl.appendChild(elementLi);

        elementImg.setAttribute("class", "hotlistPic");
        elementImg.setAttribute("src", rdata.smallPhotoUrl);

        elementH5.setAttribute("class", "hotlistTitle");
        elementH5.innerHTML = rdata.name;

        elementSpan.setAttribute("class", "hotlistUserCount");
        elementSpan.innerHTML = rdata.learnerCount;

        elementLi.appendChild(elementImg);
        elementLi.appendChild(elementH5);
        elementLi.appendChild(elementSpan);

    }

    ajax({
        method: 'get',
        url: 'http://localhost:8282/qm/webDev/hotcouresByCategory.htm',
        data: {},
        success: function (data) {
            rdata = JSON.parse(data);

            for (var i = 0; i < 10; i++) {
                createLilist(rdata[i]);
            }
        },
        async: true,
        error: function (text) {
            alert(text);
        }


    });

    //每5秒更新一门课
    var i = 10;
    setInterval(update, 5000);
    function update() {
        var elementUl = getElementById$("ulist");
        elementUl.removeChild(elementUl.childNodes[3]);
        createLilist(rdata[i]);
        i == 19 ? i = 0 : i++;
    }

}
addLoadEvent(hotList);
/*
function hotList() {
    var rdata = null;
    var elementLi = '';
    var elementUl = document.getElementById("ulist");
    //构造热门课程模板
    function createNode(opt) {
        return '<img src="' + opt.smallPhotoUrl + '" alt="' + opt.name + '" class="hotlistPic">\
                <div>\
                    <p class="hotlistTitle">' + opt.name + '</p>\
                    <span class="hotlistUserCount">' + opt.learnerCount + '</span>\
                </div>';
    }

    ajax({
        method: 'get',
        url: 'http://localhost:8282/qm/webDev/hotcouresByCategory.htm',
        data: {},
        success : function(data) {      
            rdata = JSON.parse(data);
            for (var i=0; i<10; i++) {
              elementLi += '<li class="hotlistLi">' + createNode(rdata[i]) + '</li>';
            }
            elementUl.innerHTML = elementLi;
        },
        async: true,
        error: function (text) {
            alert(text);
        }

    });

    //每5秒更新一门课
    var num = 10;
    var updateCourse = setInterval(function func() {
        elementUl.removeChild(elementUl.childNodes[0]);
        var liNode = document.createElement('li');
        liNode.setAttribute('class', 'hotListLi');
        liNode.innerHTML = createNode(rdata[num]);
        elementUl.appendChild(liNode);
        num == 19 ? num = 0 : num++;
    }, 5000);

}
*/

//////////////////////////////////////////////////
//左侧内容
//产品设计和编程语言的切换
function tabSwitch(psize) {
    var product = document.getElementsByClassName('product')[0];
    var program = document.getElementsByClassName('program')[0];
    var type = 10;

    //初始化默认加载pageNo=1, psize=20 or 15, type=10 课程
    pagination(psize);


    //切换点击事件
    addFuc(product, "click", function () {
        if (hasClass(program, 'on')) {
            removeClass(program, 'on');
            addClass(product, 'on');
            type = 10;
            pagination(psize);
        }
    });

    addFuc(program, "click", function () {
        if (hasClass(product, 'on')) {
            removeClass(product, 'on');
            addClass(program, 'on');
            type = 20;
            pagination(psize);
        }
    });
}

//页码导航
function pagination(psize) {
    var elementLi = document.getElementsByClassName('ele');
    var product = document.getElementsByClassName('product')[0];
    var program = document.getElementsByClassName('program')[0];
    var pageNo = 1;
    //var psize = 20;
    var ptype = 10;
    //上下页元素
    pre = elementLi[0];
    next = elementLi[elementLi.length - 1];

    //初始化页码样式
    for (var i = 1; i < elementLi.length - 1; i++) {
        removeClass(elementLi[i], 'on');
    }
    addClass(elementLi[pageNo], 'on');

    //初始化课程数据
    if(product.className === "product on" ){
        ptype ==10
        initCourse(pageNo, psize, ptype);
    }else if(program.className === "program on" ){
        ptype =20
        initCourse(pageNo, psize, ptype);
    }
    
    //注册页码数字点击事件
    for (var i = 1; i < elementLi.length - 1; i++) {
        elementLi[i].id = i;
        addFuc(elementLi[i], "click", function () {
            pageNo = this.id;

            for (var i = 1; i < elementLi.length - 1; i++) {
                removeClass(elementLi[i], 'on');
            }
            addClass(elementLi[pageNo], 'on');
            //课程数据
            if(product.className === "product on" ){
                ptype ==10
                initCourse(pageNo, psize, ptype);
            }else if(program.className === "program on" ){
                ptype =20
                initCourse(pageNo, psize, ptype);
            }
        });
    }

    //注册上一页点击事件
    addFuc(pre, "click", function () {
        if (pageNo > 1) {
            pageNo--;
            removeClass(elementLi[pageNo + 1], 'on');
            addClass(elementLi[pageNo], 'on');
            //课程数据
            if(product.className === "product on" ){
                ptype ==10
                initCourse(pageNo, psize, ptype);
            }else if(program.className === "program on" ){
                ptype =20
                initCourse(pageNo, psize, ptype);
            }
        }
    });
    //注册下一页点击事件
    addFuc(next, "click", function () {
        if (pageNo < 8) {
            pageNo++;
            removeClass(elementLi[pageNo - 1], 'on');
            addClass(elementLi[pageNo], 'on');
            //课程数据
            if(product.className === "product on" ){
                ptype ==10
                initCourse(pageNo, psize, ptype);
            }else if(program.className === "program on" ){
                ptype =20
                initCourse(pageNo, psize, ptype);
            }
        }
    });


}

//装载课程数据
function initCourse(pageNo, psize, ptype) {
    var courseUl = document.getElementsByClassName("course");
    //课程+课程详细的浮层模板
    function courseBlock(opt) {
        return '<li class="courseLi">\
                    <div class="img"><img src="' + opt.middlePhotoUrl + '"></div>\
                    <div class="title">' + opt.name + '</div>\
                    <div class="orgName">' + opt.provider + '</div>\
                    <div class="hot"><span >' + opt.learnerCount + '</span></div>\
                    <div class="discount">¥ <span>' + opt.price + '</span></div>' + '\
                    <div class="mDialog">\
                        <div class="uHead">\
                            <img src="' + opt.middlePhotoUrl + '" class="pic">\
                            <div class="uInfo">\
                                <h3 class="uTit">' + opt.name + '</h3>\
                                <div class="uHot"><span class="uNum">' + opt.learnerCount + '</span>人在学</div>\
                                <div class="uPub">发布者：<span class="uOri">' + opt.provider + '</span></div>\
                                <div class="uCategory">分类：<span class="uTag">' + opt.categoryName + '</span></div>\
                            </div>\
                        </div>\
                        <div class="uIntro">' + opt.description + '</div>\
                    </div>\
                </li>';
    }


    // ajax请求数据
    ajax({
        method: 'get',
        url: 'http://localhost:8282/qm/webDev/couresByCategory.htm',
        data: {
            pageNo: pageNo,
            psize: psize,
            type: ptype,
        },
        success: function (data) {
            var rdata = JSON.parse(data);
            courseRender(rdata.list, rdata.pagination.pageSize);
        },
        async: true,
        error: function (text) {
            alert(text);
        }

    });

    //将每页课程写入html
    function courseRender(arr, num) {
        var courseTemplate = '';
        var len = arr.length;
        if (len < num) {
            num = len;
        }
        for (var i = 0; i < num; i++) {
            courseTemplate += courseBlock(arr[i]);
        }
        courseUl[0].innerHTML = courseTemplate;
    }
}

//显示课程详情
function showCourse() {
    var courseCell = document.getElementsByClassName('courseLi');
    for (var i = 0; i < courseCell.length; i++) {
        addFuc(courseCell[i], "mouseover", function () {
            var dialog = this.getElementsByClassName('mDialog')[0];
            dialog.style.display = 'block';
        });
        addFuc(courseCell[i], "mouseout", function () {
            var dialog = this.getElementsByClassName('mDialog')[0];
            dialog.style.display = 'none';
        });
    }
}
setInterval(showCourse, 100);

//根据窗口大小，动态显示课程数量
function mainContent() {
    var tag = null;
    if (document.body.clientWidth >= 1205) {
        tag = 20;
        tabSwitch(tag);
    } else {
        tag = 15;
        tabSwitch(tag);
    }

    addFuc(window, "resize", function () {
        if (document.body.clientWidth >= 1205) {
            tag = 20;
            tabSwitch(20);
        } else if (document.body.clientWidth <= 1205) {
            tag = 15;
            tabSwitch(15);
        }
    });
}
addLoadEvent(mainContent);
//////////////////////////////////////////////////