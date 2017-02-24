window.onload=function(){
	var clientW=document.documentElement.clientWidth;
	var clientH=document.documentElement.clientHeight;
	var canvas=document.querySelector("canvas");
	canvas.width=clientW;
	canvas.height=clientH; 
	var cobj=canvas.getContext("2d");

	var runs=document.querySelectorAll(".run");  //获取图片
	var jumps=document.querySelectorAll(".jump");  //获取图片
	var hinderImg=document.querySelectorAll(".hinder");  //获取图片

	var runA=document.querySelector(".runA");
	var jumpA=document.querySelector(".jumpA");
	var hitA=document.querySelector(".hitA");
	var zidanA=document.querySelector(".zidanA");
	
	var gameObj=new game(canvas,cobj,runs,jumps,hinderImg,runA,jumpA,hitA,zidanA);

	//选项卡
	var start=$(".start");
	//遮罩
	var mask=$(".mask");
	//开始按钮
	var startBtn=$(".btn:eq(0)");
	startBtn.one("click",function(){
		gameObj.play(start,mask);
	})


}