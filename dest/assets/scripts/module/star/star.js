  define(function(require){

      require('./star.css');

      //var Stars = function (id, options) {
      //    this.initialize(id, options);
      //};
      //Stars.prototype = {
      //    initialize: function (star, options) {
      //        this.setOptions(options); //默认属性
      //        var flag = 999; //定义全局指针
      //        var starlist = document.getElementById(star).getElementsByTagName('a'); //星星列表
      //        var input = document.getElementById(this.options.outText) || document.getElementById(star + "-input"); // 输出结果
      //        var tips = document.getElementById(this.options.tips) || document.getElementById(star + "-tips"); // 打印提示
      //        var nowClass = " " + this.options.nowClass; // 定义选中星星样式名
      //        var len = starlist.length; //星星数量
      //        // 绑定事件 点击 鼠标滑过
      //        for (i = 0; i < len; i++) {
      //            starlist[i].value = i;
      //            starlist[i].onclick = _click;
      //            starlist[i].onmouseover = _mouseover;
      //            starlist[i].onmouseout = _mouseout;
      //        }
      //        //click
      //        function _click(e) {
      //            if (e && e.preventDefault) {
      //                e.preventDefault();
      //            } else {
      //                window.event.returnValue = false;
      //            }
      //            this.className = this.className + nowClass;
      //            flag = this.value;
      //            input.value = this.getAttribute("star:value");
      //        };
      //
      //        //mouseover
      //        function _mouseover() {
      //            if (flag < 999) {
      //                //去除点击，mouseover事件多次添加的class
      //                var account = RegExp(nowClass, "g");
      //                starlist[flag].className = starlist[flag].className.replace(account, "")
      //            }
      //        };
      //
      //        //mouseout
      //        function _mouseout() {
      //            if (flag < 999)
      //                starlist[flag].className = starlist[flag].className + nowClass;
      //        };
      //    },
      //
      //    //设置默认属性
      //    setOptions: function (options) {
      //        this.options = {//默认值
      //            outText: "",//设置触保存分数的INPUT
      //            tips: "",//设置提示文案容器
      //            nowClass: "current-rating"
      //        };
      //        this.extend(this.options, options || {});
      //    },
      //    //simple copy
      //    extend:function(src,dest){
      //        for(i in dest){
      //            src[i] = dest[i];
      //        }
      //    }
      //};
      //
      //return new Stars('star');
  });

