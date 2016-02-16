<?php
header("Content-type: text/txt; charset=utf-8");
//数据库的信息
$servername = "120.27.110.28";
$username = "root";
$password = "chenweiqi";

$con = mysql_connect($servername, $username, $password);
if(!$con){
	die("无法连接Mysql数据库: " .mysql_error());
}
mysql_select_db("shmily", $con);
//使数据库支持中文
mysql_query("set character set 'utf8'");
mysql_query("set names 'utf8'");
createDB("shmily", $con);
createTB("user_data", $con);

//设置跨域请求
make_cors();

$msg = $_POST;
handleMessage($msg);


//对接收到的数据进行处理
function handleMessage($msg){
	if (!$msg)
		return ;
	$Opt = $msg['operation'];
	$data = $msg;
	$Response = array();
	switch ($Opt){
	case 'regist':
		$Response = handleRegist($data);
		break;
	case 'login':
		$Response = handleLogin($data);
		break;
	case 'updatePW':
		$Response = handleUpdatePW($data);
		break;
	case 'userdata':
		$Response = handleUserData($data);
	case 'updateUserData' :
		$Response = handleUpdateUserData($data);
	case 'logout' :
		$Response = handleLogout($data);
	case 'search':
		$Response = handleSearch($data);
	default:
		break;
	}
		echo json_encode($Response);
}

//处理插入事件
function handleRegist($data){
	
	return $Response;
}

//处理查找事件
function handleQuery($data){
	$result;
	if(!$data){
		$result = queryAll();
	}
	else{
		$result = queryUrlAndSpm($data['url'], 
					 $data['spm']);
	}
	$json_res = array();
	//取出所有结果
	while($row = mysql_fetch_array($result)){
		$json_res[] = $row;
	}
	$Response['result'] = $json_res;
	return $Response;
	
}

//处理更新事件
//function handleUpdate($data){	
//}

//获取客户端的IP
function getUserIp(){
	$userIp = $_SERVER["REMOTE_ADDR"];
	return $userIp;
}

//创建mysql数据库
function createDB($DBname, $con){
	$createStr = "create database " .$DBname;	
	if(!mysql_query($createStr, $con)){
		return "无法创建数据库" .$DBname .mysql_error();
	}else
		return "创建数据库成功！";
}

//创建mysql数据表
//opInfo text character set utf8 collate utf8_general_ci,
function createTB($TBname, $con){
	$createStr = "create table user_data
			(uid bigint NOT NULL AUTO_INCREMENT,
			PRIMARY KEY(uid),
			name text,
			password text,
			phoneNumber text,
			email text,
			education text,
			eduDate text,
			address text,
			status int,
			loginIp text,
			registDate datetime,
			modifiedDate datetime,
			operateDate datetime
			)";
	if(!mysql_query($createStr, $con))
		return "创建数据表失败: " .mysql_error();
	else{
		mysql_query("set opType utf8;");//设置字符集
		return "创建数据表成功!";
	}

}

//插入数据
function insert($name, $phoneNumber, $email, $education, $eduDate, $address){
	$userIp = getUserIp();
	$curDate = date("Y-m-d H:i:s", strtotime("now"));
	$insertStr = "insert into user_data (name, phoneNumber, email,
			education, eduDate, address, status, registDate,
			modifiedDate, operateDate) 
			values ('$name', $phoneNumber, '$email', '$education', 
			'$eduDate', '$address', 0, '$curDate', '$curDate', '$curDate')";
	
	if (!mysql_query($insertStr)){
		return "插入数据失败: " .mysql_error();
	}else{
		return "插入数据成功！";
	}
}

//根据url和spm查找
function queryUrlAndSpm($url, $spm){
	$queryStr = "";
	if(!$url && $spm){
		$queryStr = "select * from user_data where spm = \"";
		$queryStr .= $spm .'"';
	}
	else if(!$spm && $url){
		$queryStr = "select * from user_data where url = \"";
		$queryStr .= $url .'"';
	}
	else if($url && $spm){
		$queryStr = "select * from user_data where url = \"";
		$queryStr .= $url ."\" or spm = \"".$spm .'"';
	}else
		return;
	$result = mysql_query($queryStr);
	return $result;
}

//遍历数据
function queryAll(){
	$result = mysql_query("select * from user_data");
	return $result;
}

//设置跨域
function make_cors($origin = '*'){
	$request_method = $_SERVER['REQUEST_METHOD'];
	if($request_method === 'OPTIONS'){
		//echo 'OPTIONS\n';
		header('Access-Control-Allow-Origin:'.$origin);
		header('Access-Control-Allow-Credentials:true');
		header('Access-Control-Allow-Methods:GET, POST, OPTIONS');

		header('Access-Control-Max-Age:1728000');
		header('Content-Type:text/javascript; charset=UTF-8');
		header('Content-Length: 0',true);

		header('status: 204');
		header('HTTP/1.0 204 No Content');
	}

	if($request_method === 'GET'){
		//echo 'GET\n';
		header('Access-Control-Allow-Origin:'.$origin);
	        header('Access-Control-Allow-Credentials:true');
	        header('Access-Control-Allow-Methods:GET, POST, OPTIONS');
	}

	if($request_method === 'POST'){
		//echo 'POST\n';
		header('Access-Control-Allow-Origin:'.$origin);
	 	header('Access-Control-Allow-Credentials:true');
		header('Access-Control-Allow-Methods:GET, POST, OPTIONS');
	}
}

?>
