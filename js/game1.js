function person(canvas,cobj,runs,jumps){//定义人的状态
    this.canvas=canvas;
    this.cobj=cobj;
    this.runs=runs;
    this.jumps=jumps;
    //图片的位置
    this.x=0;
    this.y=425;
    //图片大小
    this.width=90;
    this.height=115;
    this.status="runs";//当前图片状态
    this.state=0;//张数，第几张
    this.num=0;
    this.speedx=6;
    this.life=3;
}
person.prototype={
    draw:function(){    //绘制人
        this.cobj.save();    //记录初始位置
        this.cobj.translate(this.x,this.y);
        //drawImage(第几张图片,图片位置,放置图片的位置)
        this.cobj.drawImage(this[this.status][this.state],0,0,200,300,0,0,this.width,this.height);
        this.cobj.restore();    //放回原来位置
    }
}

/*********障碍物*******/
function hinder(canvas,cobj,hinderImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.state=0;
    this.x=canvas.width-20;
    this.y=460;
    this.width=70;
    this.height=70;
    this.speedx=6;
}
hinder.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImg[this.state],0,0,200,240,0,0,this.width,this.height);
        this.cobj.restore();
    }
}

/*********血*******/
function lizi(cobj){
    this.cobj=cobj;
    this.x = 230;
    this.y = 250;
    this.r = 1+2*Math.random();
    this.color = "red";
    this.speedy = 10*Math.random()-3; 
    this.speedx = 10*Math.random()-3;
    this.zhongli = 0.3;
    this.speedr = 0.1;
}
lizi.prototype = {
    draw:function(){
        var cobj=this.cobj;
        cobj.save();
        cobj.translate(this.x,this.y);
        cobj.beginPath();
        cobj.fillStyle = this.color;
        cobj.arc(0,0,this.r,0,2*Math.PI);
        cobj.fill();
        cobj.restore();
    },
    update:function(){
        this.x+=this.speedx;
        this.speedy+=this.zhongli;
        this.y+=this.speedy;
        this.r-=this.speedr;
    }
}
function xue(cobj,x,y){
    var arr = [];

    for(var i = 0;i<30;i++)
    {
        var obj = new lizi(cobj);
        obj.x = x;
        obj.y = y;
        arr.push(obj);
    }
    var that=this;
    this.t = setInterval(function(){
        for(var i = 0;i<arr.length;i++)
        {

            arr[i].draw();
            arr[i].update();

            if(arr[i].r<0){
                arr.splice(i,1);
            }
        }
        if(arr.length==0){
            clearInterval(that.t);
        }
    },50)
}
/*********子弹*******/
function zidan(canvas,cobj){
    this.canvas=canvas;
    this.cobj=cobj;
    this.x=0;
    this.y=0;
    this.width=10;
    this.height=10;
    this.color="#000";
    this.speedx=5;
    this.jia=1;   //加速度
}
zidan.prototype={
    draw:function(){
        var cobj=this.cobj;
        cobj.save();
        cobj.translate(this.x,this.y);
        cobj.fillStyle=this.color;
        cobj.fillRect(0,0,this.width,this.height);
        cobj.restore();
    }
}


/***********************游戏的主类***********************/
function game(canvas,cobj,runs,jumps,hinderImg,runA,jumpA,hitA,zidanA){    //定义游戏的状态
	this.person=new person(canvas,cobj,runs,jumps,hinderImg,runA,jumpA,hitA,zidanA);
	this.canvas=canvas;
	this.cobj=cobj;
	this.runA=runA;
	this.jumpA=jumpA;
	this.hitA=hitA;
	this.zidanA=zidanA;
	this.width=canvas.width;
	this.height=canvas.height;
	this.backx=0;  //控制背景的距离				
	this.backSpeed=6;  //控制背景的速度
	// this.fire=new fire();
	this.hinderImg=hinderImg;
	this.hinderArr=[];
	// new hinder(canvas,cobj,hinderImg).draw();
	this.score=0;
	this.isfire=false;
	this.zidan=new zidan(canvas,cobj);  //子弹实例化
	//move
	this.num=0;
	this.rand=(2+Math.ceil(6*Math.random()))*1000;
	this.ts={};
	//move2
	this.flag=true;   //控制人跳
	this.inita=0;
	this.speeda=5;
	this.r=200;
	this.y=this.person.y;    //记录原始值

	this.flag2=true;   //控制人 开始和暂停

	this.step=1;  //控制速度慢慢加快
	this.stepspeed=2;
	this.current=0;

}
game.prototype={
	play:function(start,mask){  
		this.name=prompt("请输入名字","xue");
		//大幕拉起
		start.css("animation","start1 2s ease forwards");
		mask.css("animation","mask1 2s ease forwards");
		this.run();
		this.key();
		this.mouse();
	},
	run:function(){
		var that=this;
		that.runA.play();

		that.ts.t1=setInterval(function(){
			that.move();
		},50);	
	},
	move:function(){      //控制人的
		var that=this;
		that.num+=50;
		that.cobj.clearRect(0,0,that.width,that.height);
		that.person.num++;    //控制人的不同形态(用来计算显示的图片)
		 // that.backSpeed=6;
		if(that.person.status=="runs"){
			that.person.state=that.person.num%8;
		}else{
			that.person.state=0;
		}

		//让人物的x发送变化
		that.person.x+=that.person.speedx;
		if(that.person.x>that.width/3){
			that.person.x=that.width/3;		
		}
		that.person.draw();    //绘制人到2d图像中

		//操作障碍物
		
		if(that.num%that.rand==0){	
			that.rand=(2+Math.ceil(6*Math.random()))*1000;			
			that.num=0;
			var obj=new hinder(that.canvas,that.cobj,that.hinderImg);   //
			obj.state=Math.floor(Math.random()*that.hinderImg.length);  //图片随机
			that.hinderArr.push(obj);
		}
		for (var i = 0; i < that.hinderArr.length; i++) {
			that.hinderArr[i].x-=that.hinderArr[i].speedx;
			that.hinderArr[i].draw();

			//碰撞检测
			if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
				if(!that.hinderArr[i].flag){
					that.runA.pause(); 
					that.hitA.play();
					xue(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
					that.person.life--;
					$(".lifes").html(that.person.life);
					// console.log(that.person.life);
					if(that.person.life<=0){
						that.runA.pause();
						//存储到本地
						var messages=localStorage.messages?JSON.parse(localStorage.messages):[];   //存储信息 将字符串转换为对象
						var temp={name:that.name,score:that.score};
						//分数排序  sort(自带冒泡排序)
						if(messages.length>0){
							messages.sort(function(a,b){
								return a.score<b.score;  //由大到小
							})
							//添加数组
							if(temp.score>messages[messages.length-1].score){
								if(messages.length==5){    //如果大于5个,替换掉最小的
									messages[messages.length-1]=temp;
								}else if(messages.length<5){  //如果不够5个,直接放进去即可
									messages.push(temp); //添加游戏信息到messages中
								}
							}
						}else{
							messages.push(temp);
						}
						
						/*循环
						for (var i = 0; i < messages.length; i++) {
							if(temp.score>messages[i].score){
								messages[i]=temp;
								break;
							}
						};*/

						localStorage.messages=JSON.stringify(messages);  //将对象转化为字符串 
						// location.reload();
						that.over();

						//存储到数据库
						/*$.ajax({   
							url:"game.php",
							type:"get",
							data:{
								score:that.score
							},
							success:function(e){
								if(e=="ok"){
									alert("ok");
								}else{
									location.reload();
								}
							}
						})*/
					}
					that.hinderArr[i].flag=true;
				}
				that.runA.play();
				
			}
			if(that.person.x>that.hinderArr[i].x+that.hinderArr[i].width){
				if(!that.hinderArr[i].flag&&!that.hinderArr[i].flag1){
					that.score++;
					that.current++;
					if(that.current%that.step==0){
						that.backSpeed++; //画布加速
						for (var j = 0; j < that.hinderArr.length; j++) {
							that.hinderArr[j].speedx++;   //障碍物加速
						};
						that.current=0;
						that.step+=that.stepspeed;
					}

					// document.title=that.score;
					$(".scores").html(that.score);  //分数增加
					that.hinderArr[i].flag1=true;
				}				
			}
			//子弹碰到障碍物
			 if(hitPix(that.canvas,that.cobj,that.zidan,that.hinderArr[i])){
                if(!that.hinderArr[i].flag){
                    that.hinderArr.splice(i,1);
                    that.score++;
                    // 速度加快
                    that.current++;
                    if(that.current%that.step==0){
                        that.backspeed+=1;
                        that.current=0;
                        that.step+=that.stepsteep;
                    }
                    $(".scores").html(that.score);
                }
            }

		};

		//操作子弹
		if(that.isfire){
			// that.zidanA.play();
			that.zidan.speedx+=that.zidan.jia;
			that.zidan.x+=that.zidan.speedx;
			that.zidan.draw();
			// that.zidanA.pause();
		}
		//操作背景
		that.backx-=that.backSpeed;
		that.canvas.style.backgroundPositionX=that.backx+"px";		  
	},
	move2:function(){  //人 暂停 开始
		var that=this;
		that.inita+=that.speeda;					
		if(that.inita>=180){
			that.person.y=that.y;
			clearInterval(that.ts.t2);
			that.runA.play();
			that.flag=true;
			that.person.status="runs";
			that.inita=0;
		}else{
			var top=Math.sin(that.inita*Math.PI/180)*that.r;
			that.person.y=that.y-top;
		}	
	},
	over:function(){   //game over

		for(var i in this.ts){
			clearInterval(this.ts[i]);  //关闭所有的计时器
		}
		var over=document.querySelector(".over");
		over.style.animation="start 2s ease forwards";
		this.runA.pause();
		//记录分数
		var scoreEle=document.querySelector(".scoreEle");
		scoreEle.innerHTML=this.score;
		var lis=document.querySelector(".over ul");
		var messages=localStorage.messages?JSON.parse(localStorage.messages):[];
		var str="";
		for (var i = 0; i < messages.length; i++) {
			str+="<li>"+messages[i].name+":"+messages[i].score;
		};
		lis.innerHTML=str;

		this.again();
	},
	again:function(){   //再来一次
		$(".scores").html(0);
		$(".lifes").html(3);
		var that=this;
		var btn=document.querySelector(".again");
		btn.onclick=function(){
			var over=document.querySelector(".over");
			over.style.animation="start1 2s ease forwards";
			that.person.x=0;
			that.person.y=420;
			that.score=0;
			that.person.life=3;
			that.hinderArr=[];
			that.inita=0;
			that.y=that.person.y;

			that.run();
			btn.onclick=null;
		}
	},
	key:function(){   //点击人跳跃
		var that=this;
		var flag=true;   //控制一直点击就下不来的bug
		document.onkeydown=function(e){
			
			if(e.keyCode==13){  //按enter人暂停
				if(that.flag2){
					for(var i in that.ts){
						clearInterval(that.ts[i]);
					}			
					that.runA.pause();
					that.flag2=false;
				}
				
			}else if(e.keyCode==65){   //按a人开始
				that.ts.t1=setInterval(function(){
					that.move();
				},50);
				if(!that.flag){
					clearInterval(that.ts.t2);
					that.ts.t2=setInterval(function(){
						that.move2();
					},50);
				}
				
				that.flag2=true;
			}else if(e.keyCode==32){  //点击 空格 跳跃		
					
				if(!that.flag){  //控制人 跳 
					return;
				}
				that.runA.pause();	
				that.flag=false;

				that.jumpA.play();
				
				that.person.status="jumps";   //跳的时候为跳的状态
				
				that.ts.t2=setInterval(function(){
					that.move2();
				},50);			

			}		
			
			// that.runA.play();
		}
	},
	mouse:function(){
		var that=this;
		document.querySelector(".mask").onclick=function(){			
			that.zidanA.play();
			that.zidan.x=that.person.x+that.person.width/2;
			that.zidan.y=that.person.y+that.person.height/2;
			that.zidan.speedx=5;
			that.isfire=true;

		}
	}
} 


           