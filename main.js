/**
 * Created by Administrator on 2018/3/1.
 */
//  当前版本 0.13
;(function(){
    //initializing是为了解决我们之前说的继承导致原型有多余参数的问题。当我们直接将父类的实例赋值给子类原型时。是会调用一次父类的构造函数的。所以这边会把真正的构造流程放到init函数里面，通过initializing来表示当前是不是处于构造原型阶段，为true的话就不会调用init。
    //fnTest用来匹配代码里面有没有使用super关键字。对于一些浏览器`function(){xyz;}`会生成个字符串，并且会把里面的代码弄出来，有的浏览器就不会。`/xyz/.test(function(){xyz;})`为true代表浏览器支持看到函数的内部代码，所以用`/\b_super\b/`来匹配。如果不行，就不管三七二十一。所有的函数都算有super关键字，于是就是个必定匹配的正则。
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    // 超级父类
    this.Class = function(){};

    // Create a new Class that inherits from this class
    // 生成一个类，这个类会具有extend方法用于继续继承下去
    Class.extend = function(prop) {
        //保留当前类，一般是父类的原型
        //this指向父类。初次时指向Class超级父类
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        //开关 用来使原型赋值时不调用真正的构成流程
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            //这边其实就是很简单的将prop的属性混入到子类的原型上。如果是函数我们就要做一些特殊处理
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    //通过闭包，返回一个新的操作函数.在外面包一层，这样我们可以做些额外的处理
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        // 调用一个函数时，会给this注入一个_super方法用来调用父类的同名方法
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        //因为上面的赋值，是的这边的fn里面可以通过_super调用到父类同名方法
                        var ret = fn.apply(this, arguments);
                        //离开时 保存现场环境，恢复值。
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // 这边是返回的类，其实就是我们返回的子类
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // 赋值原型链，完成继承
        Class.prototype = prototype;

        // 改变constructor引用
        Class.prototype.constructor = Class;

        // 为子类也添加extend方法
        Class.extend = arguments.callee;

        return Class;
    };
})();
//---------------------------------------------------上面是class类
;(function (window) {//轮播图插件
    var Interval;//定时器
    var _start = function (that) {
        Interval = setInterval(function () {
            if (that.ImgListLength===that.index||that.ImgListLength<that.index){
                that.index=0
            }else {
                that.index++
            }
            that.fadIn(that.index)
        },that.time)
    };
    var _bind = function (that) {
        var htmlContent = '';
        htmlContent +=
            '<div>';
        for (var i=0;i<that.ImgListLength;i++){
            htmlContent +=
                '<div class="t-Carousel-content">'+
                '<img class="t-Carousel-img" src="'+this.ImgList[i]+'" alt="">'+
                '</div>'
        }
        htmlContent +=
            '</div>'+
            '<div class="t-Carousel-Choice" style="margin-left:'+that.ChoiceDivLenght+'">';
        for (var i=0;i<that.ImgListLength;i++){
            htmlContent += '<div></div>'
        }
        htmlContent +=
            '</div>'+
            '<div class="t-Carousel-left">'+
            '<svg class="icon" width="40px" height="40px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#dbdbdb" d="M670.977781 808.954249c-5.300726 0-10.596336-2.045589-14.603603-6.126534L368.69006 509.86743c-7.818059-7.961322-7.818059-20.717857 0-28.67918l287.684118-292.960285c7.92039-8.065699 20.877493-8.182356 28.942169-0.26299 8.065699 7.919367 8.182356 20.877493 0.264013 28.942169L411.976936 495.526817l273.603425 278.620695c7.918343 8.064676 7.801686 21.022803-0.264013 28.942169C681.331593 807.002804 676.153664 808.954249 670.977781 808.954249z" /></svg>'+
            '</div>'+
            '<div class="t-Carousel-right">'+
            '<svg class="icon" width="40px" height="40px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#dbdbdb" d="M383.291616 808.954249c-5.175883 0-10.353812-1.950422-14.338566-5.862521-8.064676-7.919367-8.182356-20.877493-0.26299-28.942169l273.602402-278.620695L368.69006 216.907145c-7.919367-8.064676-7.801686-21.022803 0.26299-28.942169 8.065699-7.918343 21.022803-7.80271 28.942169 0.26299l287.685141 292.960285c7.818059 7.961322 7.818059 20.717857 0 28.67918L397.895219 802.826692C393.887952 806.907637 388.591319 808.954249 383.291616 808.954249z" /></svg>'+
            '</div>';
        $(that.ContentDOM).html(htmlContent);//插入dom
        _start(that)
    };
    var _bindDom = function (that) {
        $(that.DomComtentImg).hover(function () {//绑定DOM
            that.fadIn(that.index);
            clearInterval(Interval)
        },function () {
            _start(that)
        });
        $(that.DomCarouselLeft).hover(function () {//绑定DOM
            clearInterval(Interval)
        });
        $(that.DomCarouselLeft).click(function () {//绑定DOM
            if (that.index===0||that.index<0){
                that.index = that.ImgListLength-1
            }else {
                --that.index
            }
            that.fadIn(that.index)
        });
        $(that.DomCarouselRight).hover(function () {//绑定DOM
            clearInterval(Interval)
        });
        $(that.DomCarouselRight).click(function () {//绑定DOM
            if (that.ImgListLength<that.index||that.ImgListLength-1===that.index){
                that.index = 0
            }else {
                ++that.index
            };
            that.fadIn(that.index)
        });
        $(that.DomChoice).hover(function () {
            that.fadIn($(that.DomChoice).index(this));
            clearInterval(Interval)
        })
    };
    function Carousel(options) {
        this.time = options.time || 3000;
        this.index = 0;
        this.ImgListLength = options.ImgList.length; //长度
        this.ImgList = options.ImgList; //图片数据 （必填）
        this.ContentDOM = options.id;//容器DOM （必填）
        this.DomComtentImg = '.t-Carousel-content';//img容器DOM
        this.DomChoice = '.t-Carousel-Choice div';//下面圆圈
        this.ChoiceDivLenght = '-' + this.ImgListLength*17.55/2 + 'px';//圆圈的总长度为了适应居中
        this.DomCarouselLeft = '.t-Carousel-left';//向左
        this.DomCarouselRight = '.t-Carousel-right';//向右
        _bind(this);
        _bindDom(this)
    }
    Carousel.prototype= {
        constructor: Carousel,
        init: function () {},
        fadIn:function (index) {
            $(this.DomComtentImg).eq(index).fadeIn().siblings().fadeOut()
            $(this.DomChoice).eq(index).addClass('t-Carousel-background').siblings().removeClass('t-Carousel-background')
        }
    };
    function Calculation(time) {//获取当前时间(刚刚-时分-昨天-年月日)
        var newTime = Date.parse(time)/1000;//任务时间
        var timestamp = Date.parse(new Date())/1000;//当前时间
        var timeDifference = timestamp - newTime;//时间差
        var Day = timeHour(timestamp)+timeMinute(timestamp);//当天时间戳
        if (timeDifference<3600){ //一小时以内
            return '刚刚'
        }
        if (3600<=timeDifference && timeDifference <= Day){
            return timeHourMinute(newTime)
        }
        if (timeDifference>Day&&timeDifference<=Day+86400){
            return '昨天'
        }
        if (timeDifference>Day+86400){
            return yearMonthDay(newTime)
        }
        function yearMonthDay(timestamp) {//获取年月日
            var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate()<10 ?  '0'+(date.getDate())+' ' :+ date.getDate()+' ';
            return Y+M+D;
        }
        function timeHourMinute(timestamp) {//获取小时加时间
            var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var h = date.getHours()<10 ?  '0'+(date.getHours())+':' :+ date.getHours()+':';
            var m = date.getMinutes()<10 ?  '0'+(date.getMinutes()) :+ date.getMinutes();
            return h+m;
        }
        function timeHour(timestamp) {//获取小时
            var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var h = date.getHours()*3600;
            return h;
        }
        function timeMinute(timestamp) {//获取分钟
            var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var m = date.getMinutes()/60*3600;
            return m;
        }
    }
    window.Carousel = Carousel;
    window.Calculation = Calculation
}(window));
//    -----------------------------------------------上面的是轮播图
var EjectAlert = Class.extend({ //alert
    bind: function (that) {//默认绑定
        $("body").append(
            '<div class="mydialog123">'+
            '<span class="close123">×</span>'+
            '<div class="mydialog-cont">'+
            '<div class="cont123">'+that.content+'</div>'+
            '</div>'+
            '<div class="footer123">'+
            '<span class="btn123 t_ok_alert">'+that.okValue+'</span>'+
            '<span class="btn123 t_remove_alert">'+that.closeValue+'</span>'+
            '</div>' +
            '</div>'
        );
        $(that.DOMxx).on('click',function () {
            that.removeAlert()
        });
        $(that.DOMclose).on('click',function () {
            that.removeAlert();
            return that.close()
        });
        $(that.DOMok).on('click',function () {
            that.removeAlert();
            return that.ok()
        })
    },
    init:function(options){//默认加载
        this.okValue = options.okValue|| '确定'; //ok里面的字
        this.ok = options.ok;           //ok的方法
        this.close = options.close;     //取消的方法
        this.closeValue = options.closeValue||'取消';//取消里面的字
        this.content = options.content||'我是里面的内容'; //里面的内容
        this.DOMxx = '.close123'; //X的dom节点
        this.DOMclose = '.t_remove_alert'; //close的dom节点
        this.DOMok = '.t_ok_alert'; //ok的dom节点
        this.show()
    },
    show: function () {
        if ($('.mydialog123').length===0){     //出现
            this.bind(this)
        }
    },
    hide: function () {  //隐藏
        this.removeAlert()
    },
    ok: function () {    //点击确定
        return true
    },
    close : function () { //点击取消
        return true
    },
    removeAlert : function () { //点击取消
        $('.mydialog123').remove()
    }
});
var CtTree = Class.extend({ //tree
    bind: function () {
        var that = this;
        function tree(oldArr,pid) {//数组排列
            var newArr = [];
            oldArr.map(function (item) {
                if (item.pid===pid){
                    var obj = {
                        id:item.id,
                        name:item.name
                    };
                    var objOir = tree(oldArr,item.id)
                    if (objOir.length>0){
                        obj.child = objOir
                    }
                    newArr.push(obj)
                }
            });
            return newArr
        }
        function treeHtml(arr,ObjIndex) {//html
            var objHtml = '';
            arr.map(function (item,index) {
                if (item.child){
                    objHtml += "<div isClick='true' class='"+'t-tree-title t-tree-isClick'+"' id='"+ObjIndex+index+'_'+"' >"+
                        "<i class='"+'iconfont'+' '+'iconfontClick'+' '+that.iconKai+"'></i>"+
                        "<span class='t-tree-name' id='"+item.id+"'>"+item.name+"</span>";
                    // objHtml += "<i class='iconfont "+that.jiaJian+"'></i>"
                    objHtml += "<i class='iconfont "+that.guanBi+"'></i>";
                    objHtml += treeHtml(item.child,ObjIndex+index+'_');
                    objHtml += "</div>"
                }else {
                    objHtml += "<div class='"+'t-tree-title'+"' id='"+ObjIndex+index+'_'+"'>"+
                        "<i class='"+'iconfont'+' '+that.dingDan+"'></i>"+
                        "<span class='t-tree-name' id='"+item.id+"'>"+item.name+"</span>"+
                        "</div>"
                }
            });
            return objHtml
        }
        this.arrAy = tree(this.arr,0);//得出最后的数据
        $(this.tree).html(treeHtml(this.arrAy,''));//绑定html
        $('.iconfontClick').on('click',function(){//切换
            if ($(this).parent().attr("isClick")==='true'){
                $(this).removeClass(this.iconKai).addClass(this.iconGuan);
                $(this).parent().children(".t-tree-title").hide();
                $(this).parent().attr("isClick",'false')
            }else {
                $(this).removeClass(this.iconGuan).addClass(this.iconKai);
                $(this).parent().children(".t-tree-title").show();
                $(this).parent().attr("isClick",'true')
            }
        });
        $('.t-tree-name').on('click',function(){
            return that.ok({id:$(this).attr("id"),name:$(this).text()})
            // alert('当前的ID是'+$(this).attr("id")+'当前的name是'+ $(this).text())
        });
        $('.'+this.jiaJian).on('click',function(){
            if ($('.addInput').length===0){
                var input = '<input type="text" class="addInput">';
                $(this).after(input);
                $('.addInput').focus();
                $('.addInput').blur(function () {
                    if ($('.addInput').val().length>0){
                        var objHtm1 = '';
                        objHtm1 += "<div class='"+'t-tree-title'+"'>"+
                            "<i class='"+'iconfont'+' '+that.dingDan+"'></i>"+
                            "<span class='t-tree-name'>"+$('.addInput').val()+"</span>"+
                            "</div>";
                        $(this).parent().after(objHtm1)
                    }
                    $('.addInput').remove()
                })
            }

        });
        $('.'+this.guanBi).on('click',function(){
            // var obj = $(this).parent().attr('id').split('_')
            if (confirm("确定要删除吗!")){
                var Id = $(this).siblings(".t-tree-name").attr('id');
                function removeObj(rxt) {
                    rxt.forEach(function (res,index) {
                        if (Id==res.id){
                            rxt.splice([index],1)
                        }
                        if (res.child){
                            removeObj(res.child)
                        }
                    })
                }
                removeObj(that.arrAy)
                $(this).parent().remove()
            }
        })
    },
    init: function (options) {
        this.iconKai = options.iconKai || 'icon-kaiwenjianjia';//开的文件样式
        this.tree = options.tree;//插入ID（必填）
        this.iconGuan = options.iconGuan || 'icon-wenjianjia';//关闭的文件样式
        this.dingDan = options.dingDan || 'icon-dingdan';//里面文件样式
        this.guanBi = options.guanBi || 'icon-guanbi1';//关闭按钮样式
        this.jiaJian = options.jiaJian || 'icon-jiajianzujianjiahao';//添加按钮样式
        this.arr = options.arr;//里面数据 改变数据样式
        this.arrAy = [];//改变后数组样式
        this.bind();
        this.ok = options.ok;
    },
    ok: function (res) {
        return res
    }
});
var ThreeLevelLinkage = Class.extend({ //省市区三级联动
    _bind: function () {
        var that = this;
        var operationProvince = function (id) { //处理省
            $(that.cityDom).html("<option value='请选择'>请选择</option>")
            $(that.countyDom).html("<option value='请选择'>请选择</option>")
            var city = '';
            that.city.forEach(function(res,index){
                if (res.ProID==id){
                    city+= "<option value='"+res.CityID+"'>"+res.CityName+"</option>";
                }
            });
            $(that.cityDom).append(city)
        };
        var operationCounty = function (id) {//处理市
            $(that.countyDom).html("<option value='请选择'>请选择</option>")
            var county = '';
            that.county.forEach(function(res,index){
                if (res.CityID==id){
                    county+= "<option value='"+res.Id+"'>"+res.countyName+"</option>";
                }
            });
            $(that.countyDom).append(county)
        };
        var province = '';
        that.province.forEach(function(res,index){//处理省
            province+= "<option value='"+res.ProID+"'>"+res.ProName+"</option>";
        });
        $(that.provinceDom).append(province);//插入省
        if (this.optionsId!=='请选择'){
            operationProvince(this.optionsId);
            $(that.provinceDom).val(this.optionsId)
            if (that.cityId!=='请选择'){
                operationCounty(this.cityId)
                $(that.cityDom).val(this.cityId)
            }
            if (that.countyId!=='请选择'){
                $(that.countyDom).val(this.countyId)
            }
        }
        $(that.provinceDom).on('change',function(){
            operationProvince($(this).val());
        });
        $(that.cityDom).on('change',function(){
            operationCounty($(this).val())
        })
    },
    init: function (options) {
        this.optionsId = options.optionsId || '请选择';
        this.cityId = options.cityId || '请选择';
        this.countyId = options.countyId || '请选择';
        this.province = provinceArr;
        this.city = cityArr;
        this.county = countyArr;
        this.provinceDom = options.province||'#province';
        this.cityDom = options.city||'#city';
        this.countyDom = options.county||'#county';
        this._bind()
    }
});
var pagination = Class.extend({ //分页
    bind:function () {
    },
    pagination: function (pag,current) {
        var that = this;
        function pagination(paging,currentPaging) {
            if (currentPaging>paging){
                alert('当前页数不能大于总页数');
                return false
            }
            var paginationHtml = '';
            paginationHtml += "<a class='page operation' id='homePage'>首页</a><a class='page operation' id='previousPage'>上一页</a>";
            if (currentPaging<5){//前面
                if (paging<6){
                    var num = paging+1
                }else {
                    var num = 6
                }
                for (var i=1;i<num;i++){
                    if (i==currentPaging){
                        paginationHtml+="<a class='pageNumber pageNumberBackground'>"+i+"</a>"
                    }else {
                        paginationHtml+="<a class='pageNumber'>"+i+"</a>"
                    }
                }
                if (paging>6){
                    paginationHtml+="...<a class='pageNumber'>"+paging+"</a>"
                }
            }else if(currentPaging>paging-5&&currentPaging>5){ //后面
                if (paging-5>1){
                    paginationHtml+="<a class='pageNumber'>"+1+"</a>...";
                }
                for (var i=paging-5;i<paging+1;i++){
                    if (i<0){
                        i=1
                    }
                    if (i==currentPaging){
                        paginationHtml+="<a class='pageNumber pageNumberBackground'>"+i+"</a>"
                    }else {
                        paginationHtml+="<a class='pageNumber'>"+i+"</a>"
                    }
                }
            }else if (currentPaging>=5&&currentPaging<=paging-5){//中间
                paginationHtml+="<a class='pageNumber'>"+1+"</a>...";
                for (var i=currentPaging-1;i<Number(currentPaging)+3;i++){
                    if (i==currentPaging){
                        paginationHtml+="<a class='pageNumber pageNumberBackground'>"+i+"</a>"
                    }else {
                        paginationHtml+="<a class='pageNumber'>"+i+"</a>"
                    }
                }
                paginationHtml+="...<a class='pageNumber'>"+paging+"</a>"
            }
            paginationHtml += "<a class='page operation' id='nextPage'>下一页</a><a class='page operation' id='shadowe'>尾页</a>";
            paginationHtml += "<a style='color: #969696;font-size: 14px'>"+"共"+paging+"组数据"+"</a>";
            $(that.id).html(paginationHtml);
            _bind()
        }
        pagination(that.paging,current);
        function _bind() {
            $('.pageNumber').on('click',function () {
                that.currentPaging = $(this).text();
                pagination(that.paging,$(this).text())
                that.callback(that.currentPaging)
            });
            $('.operation').on('click',function () {
                var operation = $(this).attr('id');
                if (operation=='homePage'){//首页
                    that.currentPaging = 1;
                    pagination(that.paging,1)
                }
                if (operation=='shadowe'){//尾页
                    that.currentPaging = that.paging;
                    pagination(that.paging,that.paging)
                }
                if (operation=='previousPage'){//上一页
                    if (that.currentPaging>1){
                        that.currentPaging = --that.currentPaging;
                        pagination(that.paging,that.currentPaging)
                    }
                }
                if (operation=='nextPage'){//下一页
                    if (that.currentPaging<that.paging){
                        that.currentPaging = ++that.currentPaging;
                        pagination(that.paging,that.currentPaging)
                    }
                }
                that.callback(that.currentPaging)
            })
        }
    },
    init: function (options) {
        this.paging = options.paging;
        this.id = options.id;
        this.callback = options.callback;
        this.currentPaging = options.currentPaging;
        this.pagination(this.paging,this.currentPaging)
    },
    callback:function (res) {
        return res
    }
});
var ChiTu = (function () {
    return {
        EjectAlertL:function (res) {//绑定alert
            return new EjectAlert(res);
        },
        TCarousel:function (res) {//绑定轮播图
            return new Carousel(res);
        },
        CtTree:function (res) {//绑定轮播图
            return new CtTree(res);
        },
        pagination:function (res) {//分页
            return new pagination(res);
        },
        getTime:function (res) {//获取时间
            // 一个小时以内(刚刚)
            // 一个小时到一天以内是(时分)
            // 超过一天到第二天之间(昨天)
            // 超过昨天（年月日）
            return Calculation(res);
        },
        ThreeLevelLinkage:function (res) {//省市区
            return new ThreeLevelLinkage(res);
        }
    }
}());
   function timestampToTime(timestamp) {//时间戳转换获取时间
       var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
       var Y = date.getFullYear() + '-';
       var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
       var D = date.getDate()<10 ?  '0'+(date.getDate())+' ' :+ date.getDate()+' ';
       var h = date.getHours()<10 ?  '0'+(date.getHours())+':' :+ date.getHours()+':';
       var m = date.getMinutes()<10 ?  '0'+(date.getMinutes())+':' :+ date.getMinutes()+':';
       var s = date.getSeconds();
       return Y+M+D+h+m+s;
   }


