<?php
	sleep(2);
	$score=$_GET["score"];
	$db=new mysqli("localhost","root","","rungame");
	$db->query("set names utf8");
	$sql="insert into game (score) values ({$score})";
	$db->query($sql);
	if($db->afffected_rows>0){
		echo "ok";
	}

?>