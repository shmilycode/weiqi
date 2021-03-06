<?php
header("Content-type: text/txt; charset=utf-8");
//数据库的信息
$key = 666666;
$servername = "";
$username = "root";
$password = "";

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
	case 'count': 
		$Response = handleCount($data);
		break;
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
		break;
	case 'updateUserData' :
		$Response = handleUpdateUserData($data);
		break;
	case 'logout' :
		$Response = handleLogout($data);
		break;
	case 'search':
		$Response = handleSearch($data, false);
		break;
	case 'searchAll':
		$Response = handleSearch($data, true);
		break;
	case 'uploadHeadImage':
		$Response = handleUploadHeadImage($data);
	default:
		break;
	}
		echo json_encode($Response);
}

//处理获取用户数量事件
function handleCount($data){
	$result = queryAll();
	if(!$result){
		$Response['status'] = 'failed';
		$Response['count'] = 0;
		return $Response;
	}
	$Response['status'] = 'success';
	$Response['count'] = mysql_num_rows($result);
	return $Response;
}

//处理注册事件
function handleRegist($data){
	$name = $data['name'];
	//密码存放前在预定义字符前添加反斜杠
	$password = addslashes($data['password'] ^ key);
	$email = $data['email'];
	if(mysql_num_rows(queryEmail($email))){
		$Response['status'] = 'failed';
		$Response['message'] = '邮箱已被注册';
		return $Response;
	}
	//将数组转化为字符串,用空格分隔
	$phoneNumber = implode(' ', $data['phoneNumber']);
	$education = $data['education'];
	$eduDate = $data['eduDate'];
	$address = $data['address'];
	$result = insert($name, $password, $email, $phoneNumber,
		$education, $eduDate, $address);
	//注册成功
	if(!$result){
		$Response['status'] = 'success';
		$Response['message'] = '数据库插入成功';
	}else{
		$Response['status'] = 'error';
		$Response['message'] = $result;
	}
	return $Response;
}

//处理登录验证
function handleLogin($data){
	$account = $data['email'];
	$password = $data['password'] ^ key;
	$result = queryAccount($account);

	$pw = 0;
	$uid = 0;
	$name = 0;
	if($result){
	while($row = mysql_fetch_array($result)){
		$uid = $row['uid'];
		$pw = $row['password'];
		$name = $row['name'];
	}}
	//用户不存在
	if(!$uid){
		$Response['status'] = 'non-existent';
		$Response['message'] = '用户名不存在! ';
		return $Response;
	}

	//密码不正确
	if($password != $pw){
		$Response['status'] = 'failed';
		$Response['message'] = '密码错误！';
		return $Response;
	}

	$res = updateLogin($uid);
	if(!$res){
		$Response['status'] = 'success';
		$Response['message'] = '登录成功！';
		$Response['name'] = $name;
		$Response['userId'] = $uid;
	}else{
		$Response['status'] = 'error';
		$Response['message'] = $res;
	}
	return $Response;
} //获取用户信息
function handleUserData($data){
	$uid = $data['userId'];
	$result = queryUid($uid);
	if(!$result){
		$Response['status'] = 'failed';
		$Response['message'] = '用户不存在';
		return $Response;
	}
	while($row = mysql_fetch_array($result)){
		//如果用户不是处于登录状态
		if(!$row['status']){
			$Response['status'] = 'failed';
			$Response['message'] = '用户未登录';
			return $Response;
		}
		$Response['status'] = 'success';
		$Response['userId'] = $row['uid'];
		$Response['name'] = $row['name'];
		$Response['phoneNumber'] = explode(' ', $row['phoneNumber']);
		$Response['email'] = $row['email'];
		$Response['education'] = $row['education'];
		$Response['eduDate'] = $row['eduDate'];
		$Response['address'] = $row['address'];
		$Response['headImage'] = $row['headImage'];
	}
	if(!$Response){
		$Response['status'] = 'failed';
		$Response['message'] = '用户不存在';
	}
	return $Response;
}

//处理修改密码
function handleUpdatePW($data){
	$uid = $data['userId'];
	$prePW = $data['prePassword'];
	//检查密码是否正确
	$users = queryUid($uid);
	$truePW = 0;
	while($row = mysql_fetch_array($users)){
		$truePW = $row['password'];
	}
	if(strcmp($prePW ^ key, $truePW)){
		$Response['status'] = 'failed';
		$Response['message'] = '当前密码错误';
		return $Response;
	}
	$newPW = addslashes($data['newPassword'] ^ key);
	$result = updatePassword($uid, $newPW);
	if(!$result){
		$Response['status'] = 'success';
		$Response['message'] = '修改密码成功';
	}else{
		$Response['status'] = 'error';
		$Response['message'] = $result;
	}
	return $Response;
}

//处理修改用户资料
function handleUpdateUserData($data){
	$uid = $data['userId'];
	$result = queryUid($uid);
	if(!$result){
		$Response['error'] = 'error';
		$Response['message'] = '用户不存在';
		return;
	}
	while($row = mysql_fetch_array($result)){
		$name = $data['name'];
		$email = $data['email'];
		$sameEmail = queryEmail($email);
		if(mysql_num_rows($sameEmail)){
			while($row = mysql_fetch_array($sameEmail)){
				if($row['uid'] != $uid){
					$Response['status'] = 'failed';
					$Response['message'] = '邮箱已被注册';
					return $Response;
				}
			}
		}
		$phoneNumber = implode(' ', $data['phoneNumber']);
		$education = $data['education'];
		$eduDate = $data['eduDate'];
		$address = $data['address'];
		$res = updateUserData($uid, $name, $email, $phoneNumber, 
			$education, $eduDate, $address);
		if(!$res){
			$Response['status'] = 'success';
			$Response['message'] = '更新数据成功';
		}else{
			$Response['status'] = 'error';
			$Response['message'] = $res;
		}
		return $Response;
	}
}

//处理注销登录事件
function handleLogout($data){
	$uid = $data['userId'];
	if($uid == 0){
		$Response['status'] = 'success';
		$Response['message'] = '用户不存在';
		return $Response;
	}
	$result = queryUid($uid);
	if(!$result){
		$Response['status'] = 'success';
		$Response['message'] = '用户不存在';
		return;
	}
	while($row = mysql_fetch_array($result)){
		$result = updateLogout($uid);
		if(!$result){
			$Response['status'] = 'success';
			$Response['message'] = '注销成功';
		}else{
			$Response['status'] = 'failed';
			$Response['message'] = $result;
		}
	}
	return $Response;
}

//处理搜索事件
function handleSearch($data, $queryAll){
	$uid = $data['userId'];
	$result = queryUid($uid);
	if(!$result){
		$Response['status'] = 'error';
		$Response['message'] = '用户不存在';
		return $Response;
	}
	while($row = mysql_fetch_array($result)){
		//如果用户不是处于登录状态
		if(!$row['status']){
			$Response['status'] = 'error';
			$Response['message'] = '用户未登录';
			return $Response;
		}
	}
	//是否查找全部人
	if(!$queryAll)
		$result = queryName($data['keyword']);
	else
		$result = queryAll();
	if(!$result){
		$Response['status'] = 'failed';
		$Response['message'] = '未找到满足条件用户';
		$Response['count'] = 0;
		return $Response;
	}
	$Response['status'] = 'success';
	$Response['count'] = mysql_num_rows($result);
	$users = array();
	while($row = mysql_fetch_array($result)){
		$user['name'] = $row['name'];
		$user['phoneNumber'] = explode(' ', $row['phoneNumber']);
		$user['education'] = $row['education'];
		$user['eduDate'] = $row['eduDate'];
		$user['address'] = $row['address'];
		$user['email'] = $row['email'];
		$user['modifiedDate'] = $row['modifiedDate'];
		$user['headImage'] = $row['headImage'];
		$users[] = $user;
	}
	$Response['userData'] = $users;
	return $Response;
}

function handleUploadHeadImage($data){
	$uid = $data['userId'];
	$result = queryUid($uid);
	if(!$result){
		$Response['status'] = 'error';
		$Response['message'] = '用户不存在';
		return $Response;
	}
	while($row = mysql_fetch_array($result)){
		//如果用户不是处于登录状态
		if(!$row['status']){
			$Response['status'] = 'error';
			$Response['message'] = '用户未登录';
			return $Response;
		}
	}

	$img = addslashes($data['image']);
	$result = updateHeadImage($uid, $img);
	if(!$result){
		$Response['status'] = 'success';
		$Response['message'] = '设置头像成功';
	}else{
		$Response['status'] = 'failed';
		$Response['message'] = $result;
	}
	return $Response;
}

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
			name text  character set utf8 collate utf8_general_ci,
			password text,
			phoneNumber text,
			email text,
			education text character set utf8 collate utf8_general_ci,
			eduDate text,
			address text character set utf8 collate utf8_general_ci,
			status int,
			loginIp text,
			registDate datetime,
			modifiedDate datetime,
			operateDate datetime,
			headImage longblob
			)";
	if(!mysql_query($createStr, $con))
		return "创建数据表失败: " .mysql_error();
	else{
		mysql_query("set opType utf8;");//设置字符集
		return "创建数据表成功!";
	}

}

//插入数据
function insert($name, $password, $email, $phoneNumber, $education, $eduDate, $address){
	$userIp = getUserIp();
	$curDate = date("Y-m-d H:i:s", strtotime("now"));
	$insertStr = "insert into user_data (name, password, phoneNumber,
			email, education, eduDate, address, status, loginIp,
			registDate, modifiedDate, operateDate) 
			values ('$name', '$password', '$phoneNumber', 
			'$email', '$education', '$eduDate', '$address', 
			0, '$userIp', '$curDate', '$curDate', '$curDate')";
	
	if (!mysql_query($insertStr)){
		return mysql_error();
	}else{
		return 0;
	}
}

//用户登录，修改数据库
function updateLogin($uid){
	$userIp = getUserIp();
	$curDate = date("Y-m-d H:i:s", strtotime("now"));
	$updateStr = "update user_data set status=1, loginIp=\"";
	$updateStr .= $userIp ."\", operateDate=\"" .$curDate;
	$updateStr .= "\" where uid=" .$uid;
	if(!mysql_query($updateStr))
		return mysql_error();
	else{
		return 0;
	}

}
//用户注销登录，修改数据库
function updateLogout($uid){
	$curDate = date("Y-m-d H:i:s", strtotime("now"));
	$updateStr = "update user_data set status=0, operateDate=\"";
	$updateStr .= $curDate ."\" where uid=" .$uid;
	echo $updateStr;
	if(!mysql_query($updateStr))
		return mysql_error();
	else{
		return 0;
	}

}

//根据uid修改用户密码
function updatePassword($uid, $newPW){
	$curDate = date("Y-m-d H:i:s", strtotime("now"));
	$updateStr = "update user_data set password = \"";
	$updateStr .= $newPW ."\", operateDate = \"";
	$updateStr .= $curDate ."\" where uid = ";
	$updateStr .= $uid;
	if(!mysql_query($updateStr))
		return mysql_error();
	else
		return 0;
}

//根据uid修改用户资料
function updateUserData($uid, $name, $email, $phoneNumber, $education,
			$eduDate, $address){
	$curDate = date("Y-m-d H:i:s", strtotime("now"));
	$updateStr = "update user_data set name = \"";
	$updateStr .= $name ."\", email = \"";
	$updateStr .= $email ."\", phoneNumber = \"";
	$updateStr .= $phoneNumber ."\", education = \"";
	$updateStr .= $education ."\", eduDate = \"";
	$updateStr .= $eduDate ."\", address = \"";
	$updateStr .= $address ."\", modifiedDate = \"";
	$updateStr .= $curDate ."\", operateDate = \"";
	$updateStr .= $curDate ."\" where uid = ";
	$updateStr .= $uid;
	if(!mysql_query($updateStr))
		return mysql_error();
	else
		return 0;
}

//根据uid更新用户头像信息
function updateHeadImage($uid, $img){
	$curDate = date("Y-m-d H:i:s", strtotime("now"));
	$updateStr = "update user_data set headImage = \"";
	$updateStr .= $img ."\", operateDate = \"";
	$updateStr .= $curDate ."\" where uid = ";
	$updateStr .= $uid;
	if(!mysql_query($updateStr))
		return mysql_error();
	else
		return 0;

}

//根据账号查找用户
function queryAccount($account){
	$queryStr = "select * from user_data where email=\"";
	$queryStr .= $account .'"';
	$result = mysql_query($queryStr);
	return $result;
}

//根据UID查找用户
function queryUid($uid){
	$queryStr = "select * from user_data where uid=";
	$queryStr .= $uid;
	$result = mysql_query($queryStr);
	return $result;
}

//根据NAME查找用户
function queryName($name){
	$queryStr = "select * from user_data where name LIKE \"%";
	$queryStr .= $name .'%"';
	$result = mysql_query($queryStr);
	return $result;
}

//根据EMAIL查找用户
function queryEmail($email){
	$queryStr = "select * from user_data where email = \"";
	$queryStr .= $email .'"';
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
