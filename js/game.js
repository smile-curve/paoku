function person(canvas,cobj,runs,jumps){  //定义人的状态
	this.canvas=canvas;
	this.cobj=cobj;
	this.runs=runs;
	this.jumps=jumps;
	// this.person=new person(canvas,cobj,runs,jumps);
	this.x=0;
	this.y=0;
	this.width=90;
	this.height=115;
	this.speedx=5;
	this.speedy=5;
	this.zhongli=5;
	this.status="runs";
	this.state=0;
}
person.prototype={
	draw:function(){  //绘制人
		this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.status][this.state],0,0,180,230,0,0,this.width,this.height);
        this.cobj.restore();
	}
}
/***********************游戏的主类***********************/
function game(canvas,cobj,runs,jumps){    //定义游戏的状态
	this.canvas=canvas;
	this.cobj=cobj;
	this.width=canvas.width;
	this.height=canvas.height;
	this.person=new person(canvas,cobj,runs,jumps);
}
game.prototype={
	play:function(){  
		var that=this;
		var num=0;   // run 人的8中状态
		var top=0;   // 设置人距top的距离
		var num2=0;  // 设置画布动，人不动
		setInterval(function(){
			that.cobj.clearRect(0,0,that.width,that.height);
			num++;
			num2+=5;
			that.person.state=num%8;
			// that.person.x+=that.person.speedx;
			that.person.speedy+=that.person.zhongli;
			top+=that.person.speedy;
			if(top>=320){
				top=320;
			}
			that.person.y=top;
			that.person.draw();
			that.canvas.style.backgroundPositionX=-num2+"px";
		},50)
	}
}