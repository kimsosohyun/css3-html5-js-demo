(function(){

var s_item1=document.querySelector(".s_item1"),
    s_item2=document.querySelector(".s_item2"),
    s_item3=document.querySelector(".s_item3"),
    s_item4=document.querySelector(".s_item4"),
    s_item5=document.querySelector(".s_item5"), //s对应标准库
    m_item1=document.querySelector(".m_item1"),
    m_item2=document.querySelector(".m_item2"),
    m_item3=document.querySelector(".m_item3"),
    m_item4=document.querySelector(".m_item4"),
    m_item5=document.querySelector(".m_item5"); //m对应自定义库


var m_ul1=m_item1.querySelector("ul"),
    m_ul2=m_item2.querySelector("ul"),
    m_ul3=m_item3.querySelector("ul"),
    m_ul4=m_item4.querySelector("ul"),
    m_ul5=m_item5.querySelector("ul");



var standard=document.querySelector(".standard");
var s_lis=standard.getElementsByTagName("li"); //标准库下的所有Li

var myLibrary=document.querySelector(".myLibrary");
var m_lis=myLibrary.getElementsByTagName("li"); //自定义库下的所有Li

var s_arr=[];//用于记录 标准库 中li的原位置
var m_arr=[];//用于记录 自定义库 中li的原位置
var oc=[];  //用于记录 自定义库 中li的排布

start();

function start() {  //主函数
    addLi(getLength(s_item1),m_ul1);
    addLi(getLength(s_item2),m_ul2);
    addLi(getLength(s_item3),m_ul3);
    addLi(getLength(s_item4),m_ul4);
    addLi(getLength(s_item5),m_ul5);  //往自定义库添加li

    toAbsolute();    //将float样式转为absolute定位方式，方便拖拽和得到位置
    replace(s_item1,m_item1);
    replace(s_item2,m_item2);
    replace(s_item3,m_item3);
    replace(s_item4,m_item4);
    replace(s_item5,m_item5);  //实现左右拖拽

    replace(m_item1,m_item1);
    replace(m_item2,m_item2);
    replace(m_item3,m_item3);
    replace(m_item4,m_item4);
    replace(m_item5,m_item5);  //实现上下拖拽

    goBack(); //删除函数调用

    var submit=document.getElementsByClassName("submit")[0];
    submit.addEventListener("click",function(){
        console.log(getOrder());
        // console.log(oc[0].lists);
        // oc[0].lists=[
        //     {index: 0, content: "码上服务"},
        //     {index: 4, content: "问卷调查"}
        // ];
        //
        // var li=m_item1.getElementsByTagName("li");
        //
        // oc[0].lists.forEach(
        //     (list)=>{
        //         for(var i=0;i<li.length;i++)
        //         {
        //             li[list.index].innerHTML=list.content;  //可根据oc来初始化界面。
        //         }
        //     }
        // )
    }.bind(this),false)
}

function getOrder(x) {    //可根据参数返回 自定义库整体li的排序情况 或者 单个模块li的排序情况
    //不加参数，返回整体，参数0对应第一模块，以此类推。
    oc=[];
    var length=0;
    pushArr(m_item1,0);
    pushArr(m_item2,1);
    pushArr(m_item3,2);
    pushArr(m_item4,3);
    pushArr(m_item5,4);

    function pushArr(obj,num) {
        var lis=obj.getElementsByTagName("li");
        var span=obj.querySelector(".title");
           oc.push(
               {
                   id:num,
                   module:span.innerHTML,
                   lists:[]
               }
           );
        var preL=length;
        length+=lis.length;
        for (var i=0;i<m_lis.length;i++)
        {
            if (m_lis[i].aNum>-1){
                {
                    if (i<length&&i>=preL) {
                        oc[num].lists.push({
                            index:m_lis[i].index-preL,content:s_lis[m_lis[i].aNum].innerHTML
                        })
                    }
                }
            }
        }
    }
    if (x>=0){
        return oc[x];
    }
    else{
        return  oc;
    }
    // x? return oc[x]:return oc[];
}

function goBack() {    //用于鼠标移入点击x 删除/回到标准库
    var click_onoff=true;//防止x的click函数调用多次.
    for (var i=0;i<m_lis.length;i++)
    {
        m_lis[i].addEventListener("mouseover",function () {
            if (this.aNum>-1) {
                var x=this.getElementsByTagName("span")[0];
                x?x.style.display="block":"";
                x?x.addEventListener("click",function(){                    
                    if (click_onoff) {
                        click_onoff=false;
                        x.style.display="none";
                        startMove(this,{left:s_arr[this.aNum].left,top:s_arr[this.aNum].top},function(){
                            this.style.left=m_arr[this.index].left+"px";
                            this.style.top=m_arr[this.index].top+"px";
                            this.innerHTML="+";
                            this.style.cursor="";
                            s_lis[this.aNum].style.visibility="visible";

                            click_onoff=true;
                            setTimeout( function(){
                                this.aNum=-1;
                            }.bind(this),0)
                        }.bind(this),16)
                    }
                }.bind(this),false):"";
            }
        });
        m_lis[i].addEventListener("mouseout",function () {
            if (this.aNum>-1) {
                var x=this.getElementsByTagName("span")[0];
                x?x.style.display="none":"";
            }
        },false)
    }
}

function getLength(obj) {  //用于得到标准库中Li的数量
    var lis=obj.getElementsByTagName("li");
    return lis.length;
}

function addLi(num,obj) { //用于初始化在自定义库中添加li
    var inner="";
    for(var i=0;i<num;i++){
        inner+="<li>+</li>";
    }
    obj.innerHTML=inner;
}

function toAbsolute() { //实现标准库和自定义库中的Li变为漂浮定位
    for (var i=0;i<s_lis.length;i++)
    {
        s_lis[i].index=i;
        s_arr[i]={};
        s_arr[i].left=s_lis[i].offsetLeft;
        s_arr[i].top=s_lis[i].offsetTop;

    }
    var s_height1=s_item1.offsetHeight;
    var s_height2=s_item2.offsetHeight;
    var s_height3=s_item3.offsetHeight;
    var s_height4=s_item4.offsetHeight;
    var s_height5=s_item5.offsetHeight;

    for(var j=0; j<s_lis.length;j++){
        s_lis[j].style.position="absolute";
        s_lis[j].style.left=s_arr[j].left+"px";
        s_lis[j].style.top=s_arr[j].top+"px";
        s_lis[j].style.margin="0px";
    }
    s_item1.style.height=s_height1+"px";
    s_item2.style.height=s_height2+"px";
    s_item3.style.height=s_height3+"px";
    s_item4.style.height=s_height4+"px";
    s_item5.style.height=s_height5+"px";

    for (var x=0;x<m_lis.length;x++)
    {
        m_lis[x].index=x;
        m_lis[x].aNum=-1; //初始化:自定义库中Li 全部对应标准库的下标 -1
        m_arr[x]={};
        m_arr[x].left=m_lis[x].offsetLeft;
        m_arr[x].top=m_lis[x].offsetTop;

    }
    var m_height1=m_item1.offsetHeight;
    var m_height2=m_item2.offsetHeight;
    var m_height3=m_item3.offsetHeight;
    var m_height4=m_item4.offsetHeight;
    var m_height5=m_item5.offsetHeight;

    for(var s=0; s<m_lis.length;s++){
        m_lis[s].style.position="absolute";
        m_lis[s].style.left=m_arr[s].left+"px";
        m_lis[s].style.top=m_arr[s].top+"px";
        m_lis[s].style.margin="0px";
    }
    m_item1.style.height=m_height1+"px";
    m_item2.style.height=m_height2+"px";
    m_item3.style.height=m_height3+"px";
    m_item4.style.height=m_height4+"px";
    m_item5.style.height=m_height5+"px";
}

function replace(obj1,obj2) { //实现具体拖拽功能
    var lis1=obj1.getElementsByTagName("li");
    var zindex=0;
    for (var i=0;i<lis1.length;i++)
    {
        lis1[i].addEventListener("mousedown",function (ev) {
            if(ev.target.nodeName.toUpperCase() === 'SPAN'){
                return ;
            }
            if (this.aNum===-1) {  //空白li不接受拖拽事件
                return ;
            }
            var x=document.getElementsByClassName("x");
            if (x.length){
                for (var j=0;j<x.length;j++){
                    x[j].style.display="none";
                }
            }

            var that = this;
            ev.preventDefault();//阻止拖拽时发生的选中字体等默认事件。
            zindex++; //防止被覆盖
            this.style.zIndex = zindex;
            var dix = ev.clientX - this.offsetLeft;
            var diy = ev.clientY - this.offsetTop;
            document.addEventListener("mousemove",mousemove,false);

            function mousemove (ev) {
                var left = ev.clientX - dix;
                var top = ev.clientY - diy;
                that.style.left = left + "px";
                that.style.top = top + "px";
                getLi(that, obj2);  //在我li移动时判断谁是离我最近的li和是否发生碰撞。
            }

            document.addEventListener("mouseup",mouseup,false);

            function mouseup () {
                var li = getLi(that, obj2);//需要替换位置的li
                var temp = 0;
                document.removeEventListener("mousemove",mousemove);
                document.removeEventListener("mouseup",mouseup);

                if (li && that.parentNode.parentNode.className.charAt(0) === "s") {
                    //标准库中的Li和自定义库中没有"交换"的Li相遇
                    li.aNum = that.index;
                    startMove(that, {left: m_arr[li.index].left, top: m_arr[li.index].top}, function () {
                        li.style.border = "2px solid rgba(91,155,213,0.7)";
                        li.style.visibility="hidden";
                        li.style.cursor="move";
                        li.innerHTML = that.innerHTML+"<span class='x'>x<span>";//给"交换"过后的li设置回去的x
                        //其他空白li则没有x
                        li.style.visibility="visible";
                        that.style.visibility="hidden";
                        that.style.left = s_arr[that.index].left + "px";
                        that.style.top = s_arr[that.index].top + "px";
                    });

                } else if (li && that.parentNode.parentNode.className.charAt(0) === "m") {
                   //自定义库中的li和自定义库中的li相遇
                    startMove(that, {left: m_arr[li.index].left, top: m_arr[li.index].top});
                    startMove(li, {left: m_arr[that.index].left, top: m_arr[that.index].top});
                    li.style.border = "2px solid rgba(91,155,213,0.7)";
                    temp = that.index;
                    that.index = li.index;
                    li.index = temp;//更换相应的下标属性。
                } else if (!li && that.parentNode.parentNode.className.charAt(0) === "m") {
                    //自定义库中的li移动但是没有接触到自定义库中的其他li
                    startMove(that, {left: m_arr[that.index].left, top: m_arr[that.index].top});
                } else {
                    //标准库中的li移动但是没有接触到标准库库中的其他li
                    startMove(that, {left: s_arr[that.index].left, top: s_arr[that.index].top});
                }
            }
        },false)
    }
}

function  getLi(that,obj2) {  //得到谁是距离我最近的li
    var special=that.parentNode.parentNode.className.charAt(0);
    var lis2=obj2.getElementsByTagName("li");
    var index=9999;
    var x=-1;
    for(var i=0;i<lis2.length;i++){
        if(pz(that,lis2[i])&&lis2[i]!==that&&(special!=="s"||lis2[i].aNum<=-1)) {
            var a=lis2[i].offsetLeft-that.offsetLeft;
            var b=lis2[i].offsetTop-that.offsetTop;
            var c=Math.sqrt(a*a+b*b);
            if(c<index) {
                index=c;
                x=i;
            }
        }
      lis2[i].style.border="2px solid rgba(91,155,213,0.7)";
    }
    if (x===-1) {//代表for循环结束了，还没有发生碰撞！这个返回值就说明了它是否发生了碰撞
        return false;
    }
    else{
        lis2[x].style.border="2px solid green";
        return lis2[x];
    }
}

function pz(obj,obj1){  //检验是否发生接触/碰撞
    var l1=obj.offsetLeft;
    var l2=obj1.offsetLeft;
    var t1=obj.offsetTop;
    var t2=obj1.offsetTop;
    var r1=l1+obj.offsetWidth;
    var r2=obj1.offsetLeft+obj1.offsetWidth;
    var b1=t1+obj.offsetHeight;
    var b2=obj1.offsetTop+obj1.offsetHeight;
    if(r1>l2&&b1>t2&&l1<r2&&t1<b2) {
        return true;
    }
    else{
        return false;
    }
}

}())