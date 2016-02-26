//事件处理函数
$(function(){
	var serviceAddr = "/weiqi/php/index.php";

	//根据页面中的参数对页面进行调整
	var pageDisplay = {
		init: function(){
			var href = window.location.href;
			href = decodeURIComponent(href);
			var withUserReg = /weiqi\/\?(.*)/;
			var userPara = withUserReg.exec(href);
			//处于有用户登录的界面
			if(userPara && userPara.length >= 2){
				pageDisplay.loginDisplay();

				//获取用户参数
				var nameReg = /name=(.*)?&/;
				var name = nameReg.exec(userPara[1]);
				var uidReg = /uid=(.*)$/;
				var uid = uidReg.exec(userPara[1]);
				user.init(name[1], uid[1]);
				return;

			}
			var withSearchReg = /search\/\?(.*)/;
			var searchPara = withSearchReg.exec(href);
			if(searchPara && searchPara.length == 2){
				pageDisplay.loginDisplay();
				pageDisplay.searchDisplay();
				//获取用户参数
				var nameReg = /name=(.*?)&/;
				var name = nameReg.exec(searchPara[1]);
				var uidReg = /uid=(.*)?&/;
				var uid = uidReg.exec(searchPara[1]);
				var keywordReg = /search=(.*)$/;
				var keyword = keywordReg.exec(searchPara[1]);
				user.init(name[1],uid[1]);
				if(keyword)
					search.searchServer(uid[1], keyword[1]);
				else
					search.searchAll(uid[1]);
			}
		},
		//用户已经登录
		loginDisplay: function(){
			$('#signupModal').modal('hide');
			$('#navbar-right-logout').addClass('sr-only');
			$('#navbar-right-login').removeClass('sr-only');
			$('#modal-title').text('用户信息');
			$('#regAndloginBtn').text('保存修改');
			$('#regAndloginBtn').attr('data-loading-text', '保存中..');
			$('#hide_login').removeClass('sr-only');
			$('.help-block').addClass('sr-only');
			$('#registerExplain').addClass('sr-only');
			$('#passwordForm').addClass('sr-only');
		},

		//搜索页面显示
		searchDisplay: function(){
		},

		//提示页面
		mentionPage: function(mention){
			var modal_body = $('<div></div>').addClass('modal-body').append($('<h4></h4>').text(mention));
			var modal_content = $('<div></div>').addClass('modal-content').append(modal_body);
			var modal_dialog = $('<div></div>').addClass('modal-dialog modal-sm').append(modal_content);
			var mention_modal = $('<div></div>').addClass('modal fade').attr({'tabindex': '-1', 'role': 'dialog', 'aria-labelledby':'mention'}).append(modal_dialog).css('top', '20%');
			mention_modal.modal('toggle');
		}
	};

	//Logo的处理事件
	var logo = {
		init:function(){
			this.setLogoBtn();
		},

		setLogoBtn: function(){
			$('#navbar_title').on('click', function(){
				var len = 0;
				for(data in user.userData)
					len++;
				if(!len){
					window.location.href="/weiqi/";
				}else{
					window.location.href="/weiqi/?name="+user.userData.name+"&uid="+user.userData.userId;
				}
			});
		},

	};
	//注册框处理事件
	var regist = { 
		//将modal中所有输入框和记录清空
		clearModal: function(){
			$.each($('#modal-form').find('input'), function(index, inputBox){
			inputBox.value='';
			});
			$('#telListGroup').empty();
			$('#warn-text').text('');
		},

		//添加电话号码框
		appendTelGroup: function(telNumber){
			var telSpan = $("<span></span>").addClass("input-group-btn");
			telSpan.append($("<button></button>").addClass("btn btn-default").attr("type","button")).
				children("button").append($("<span></span>").
				addClass("glyphicon glyphicon-remove").attr("name", "delTelGroup")).
				css({"border-radius":"0px", "border":"0px"});
			telSpan.click(regist.delTelGroup);
			var telLabel = $("<input></input>").addClass("form-control m_pointer-cursor").attr({"value": telNumber, "readonly":true}).
				css({"border-radius":"0px", "border":"0px"});	
			var telGroup = $("<div></div>").addClass("input-group").attr("role","group").append(telLabel).append(telSpan);
			var telListGroup = $("#telListGroup").append(telGroup);
		},
		//输入框事件
		setNameInput: function(){
			var nameInput = $('#nameInput');
			nameInput.bind({'focus':function(){
				$('#name_helpspan').removeClass('sr-only');},
				'blur': function(){
				$('#name_helpspan').addClass('sr-only');}
			});

		},

		setKeywordInput: function(){
			$('#keywordInput').bind({
				focus: function(){
					$('#keyword_helpspan').removeClass('sr-only');
				},
				blur: function(){
					$('#keyword_helpspan').addClass('sr-only');
				}
			});
		},

		//处理添加电话框操作
		addTelOpt: function(){
			var telInput = $("#telInput");
			if(telInput.val()){
				regist.appendTelGroup(telInput.val());
				telInput.val('');
			}
		},
		//删除号码框
		delTelGroup: function(){
			this.parentElement.remove();
		},
		//设置电话框事件
		setTelInput: function(){
			$("#telInput").bind({
				keypress: function(){
					var keyCode = event.keyCode;
					if ((keyCode >= 48 && keyCode <= 57)){
						event.returnValue = true;
					}
					else{
						event.returnValue = false;
					}
				},
				paste: function(){return false;},
				focus: function(){
					$('#tel_helpspan').removeClass('sr-only');
				},
				blur: function(){
					$('#tel_helpspan').addClass('sr-only');
				}
			}).css("-webkit-ime-mode: disabled;\
				-moz-ime-mode: disabled;\
				-ms-ime-mode: disabled;\
				ime-mode: disabled;");//禁用输入法和中文输入:
			$("#addTelBtn").click(regist.addTelOpt);
		},

		setMailInput: function(){
			$('#mailInput').bind({
				focus: function(){
					$('#mail_helpspan').removeClass('sr-only');
				},
				blur: function(){
					$('#mail_helpspan').addClass('sr-only');
				}
			});
		},

		//选择学历框
		setEduSelector: function(){
			$('#eduInput').bind({
				keypress: function(){
					event.returnValue = false;},
				paste: function(){
					return false;},
				focus: function(){
					$('#edu_helpspan').removeClass('sr-only');
				},
				blur: function(){
					$('#edu_helpspan').addClass('sr-only');
				}
			});
			$('#eduDropdown li').on('click', function(){
				$('#eduInput').val($(this).text());
				regist.setDateInput($(this).text()+'入学日期');
			});

		},
		//设置入学日期选择框
		setDateInput: function(placeholder){
			var dateInput = $('#dateInput');	
			var s = dateInput.children('input');
			dateInput.children('input').bind({
				focus: function(){
					$("#date_helpspan").removeClass("sr-only");
				},
				blur: function(){
					$('#date_helpspan').addClass('sr-only');
				}
			});
			dateInput.children('input').val('');
			dateInput.datepicker({
				format: "yyyy-mm",
				autoclose: true,
				minViewMode: 1,
				startView: 2,
				language: "zh-CN"
			});
			dateInput.children('input').attr('placeholder', placeholder);
		},
		setAddrInput: function(){
			$('#addrInput').bind({
				focus: function(){
					$('#addr_helpspan').removeClass('sr-only');
				},
				blur: function(){
					$('#addr_helpspan').addClass('sr-only');
				}
			});
		},

		//用户不合法输入处理
		illegalHandle: function(warnText){
			var titleOffset = $('#modal-title').offset();
			$('.modal').animate({
				scrollTop: titleOffset.top},500);
			$('#warn-text').text(warnText);
		},
		//将注册数据发送到后台
		postRegistData: function(data, response){
			$('#warn-text').text('');
			var name=$('#nameInput').val();
			if(!name){
				regist.illegalHandle('姓名不能为空！');
				return;
			}
			var password = $('#keywordInput').val();
			if(!password){
				regist.illegalHandle('密码不能为空！');
				return;
			}
			var email = $('#mailInput').val();
			var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
			if(!email){
				regist.illegalHandle('邮箱不能为空！');
				return;
			}else if(!emailReg.test(email)){
				regist.illegalHandle('请输入正确的邮箱! ');
				return;
			}

			$('#addTelBtn').click();
			var telGroup = $('#telListGroup').find('input');
			var telNumbers = new Array();
			$.each(telGroup, function(index, telInput){
				if(telInput.value)
					telNumbers.push(telInput.value);
			});
			if(!telNumbers.length){
				regist.illegalHandle('电话号码不能为空！');
				return;
			}
			var education = $('#eduInput').val();
			if(!education){
				regist.illegalHandle('请选择学历！');
				return;
			}
			var eduDate = $('#dateInput input').val();
			if(!eduDate){
				regist.illegalHandle('入学日期不能为空！');
				return;
			}
			var address = $('#addrInput').val();
			if(!address){
				regist.illegalHandle('街道名称不能为空！');
				return;
			}

			$('#regAndloginBtn').button('loading');
			//发送数据到服务端
			$.post(serviceAddr,
			{ 
				operation: 'regist',
				name: name,
				password: password,
				email: email,
				phoneNumber: telNumbers,
				education: education,
				eduDate: eduDate,
				address: address
			},
			function(data, status){
				if(status == 'success'){
					data = JSON.parse(data);
					var registStatus = data['status'];
					switch(registStatus){
					case 'success':
						$('#signupModal').modal('hide');
						pageDisplay.mentionPage('注册成功！');	
						break;
					case 'failed': 
						regist.illegalHandle('邮箱已被注册，请重新输入');
						break;
					case 'error':
						pageDisplay.mentionPage('注册失败！');
						break;
					default:
						break;
					};
				}else{
					regist.illegalHandle('因服务器问题，注册失败！');
				}
				$('#regAndloginBtn').button('reset');
			}).error(function(){
				pageDisplay.mentionPage('服务器发生错误！');
				$('#regAndloginBtn').button('reset');
			});
		},
		//设置注册按键与后台的交流
		setRegistBtn: function(){
			var regBtn = $('#regAndloginBtn');
			regBtn.unbind();
			regBtn.on('click', regist.postRegistData);
			$('#signupModal').on('hidden.bs.modal', function(){
				regist.clearModal();
				$('#regAndloginBtn').button('reset');
			});
		},
		//初始化注册框
		init: function(){
			//清空缓存的号码
			$('#modal-title').text('注册');
			$('#regAndloginBtn').text('注册');
			$('#regAndloginBtn').attr('data-loading-text', '注册中..');
			$('#hide_login').removeClass('sr-only');
			$('.help-block').removeClass('sr-only');
			$('#registerExplain').removeClass('sr-only');
			this.setNameInput();
			this.setKeywordInput();
			this.setTelInput();
			this.setMailInput();
			this.setEduSelector();
			this.setDateInput();
			this.setAddrInput();
			this.setRegistBtn();
		}
  	};

	var login = {
		init: function(){
			var storage = window.localStorage;
			$('#loginEmailInput').val(storage.username);
			this.setLoginBtn();
		},

		//错误输入处理
		illegalHandle: function(warnText){
			var titleOffset = $('#loginTitle').offset();
			$('#loginModal').animate({
				scrollTop: titleOffset.top},500);
			$('#login-warn-text').text(warnText);
		},

		//将登录数据发送到后台
		postLoginData: function(data, response){
			$('#login-warn-text').text('');
			var email=$('#loginEmailInput').val();
			if(!email){
				login.illegalHandle('邮箱不能为空！');
				return;
			}
			login.saveUserName(email);
			var password = $('#loginPasswordInput').val();
			if(!password){
				login.illegalHandle('密码不能为空！');
				return;
			}
			//发送数据到服务端
			$('#loginSubmitBtn').button('loading');
			$.post(serviceAddr,
			{
				operation: 'login',
				email: email,
				password: password
			},
			function(data, status){
				if(status == 'success'){
					data = JSON.parse(data);
					switch(data.status){
					case 'non-existent':
						login.illegalHandle('用户不存在');
						break;
					case 'failed':
						login.illegalHandle('密码错误');
						break;
					case 'success':
						login.loginSuccess(data);	
						break;
					case 'error':
						login.illegalHandle('服务器错误');
						break;
					default: break;
					}
					$('#loginSubmitBtn').button('reset');
				}
			}).error(function(){
				$('#loginModal').modal('hide');
				pageDisplay.mentionPage('服务器发生错误！');
				$('#loginSubmitBtn').button('reset');
			});
		},
		//设置登录按键与后台的交流
		setLoginBtn: function(){
			var loginBtn = $('#loginSubmitBtn');
			loginBtn.on('click', login.postLoginData);
			$('#loginModal').on('hidden.bs.modal', function(){
				$('#loginSubmitBtn').button('reset');
			});
		},
		
		//设置记忆用户名
		saveUserName: function(name){
			var storage = window.localStorage;
			storage.username = name;
		},

		//登录成功后的处理
		loginSuccess: function(data){
			window.location.href='/weiqi?name=' + 
				data.name + '&uid=' + data.userId;
		},
	};

	var user = {
		//用户数据
		userData:{},
		init: function(name, uid){
			this.setUserName(name);
			this.getUserData(uid);
			this.clearModal();
			this.setMenuBtn();
			this.setPWModal();
			this.setUpdateBtn();
		},

		//向服务器请求用户信息
		getUserData: function(uid){
			$.post(serviceAddr,{
				operation: 'userdata',
				userId: uid
			},
			function(data,status){
				//获取到的数据赋值给userData
				if(status == 'success'){
					var data = JSON.parse(data);
					switch(data.status){
					case 'failed':
						user.logout();
					case 'success':
						user.userData = data;
						user.setUserName(data.name);
						if(data.headImage){
							$('#camera').addClass('sr-only');
							$('#headImage').attr('src', user.userData.headImage);
						}
						$('#image_name').text(data.name);
						$('#image_email').text(data.email);
						break;
					default: break;
					};
				}else{
					pageDisplay.mentionPage('获取用户数据失败');
				}
			}).error(function(){
				pageDisplay.mentionPage('服务器发生错误');
			});
		},

		//设置用户名
		setUserName: function(name){
			$('#userLabel').text(name);
		},

		//用户不合法输入处理
		illegalHandle: function(warnText){
			var titleOffset = $('#updatePWTitle').offset();
			$('.modal').animate({
				scrollTop: titleOffset.top},500);
			$('#pw-warn-text').text(warnText);
		},

		//修改密码
		updatePW: function(){
			$('#pw-warn-text').text('');
			var prePW = $('#prePasswordInput').val();
			var newPW = $('#newPasswordInput').val();
			if(!prePW || !newPW){
				user.illegalHandle('密码不能为空! ');
				return;
			}
			$('#updatePWBtn').button('loading');
			$.post(serviceAddr,
			{
				operation: 'updatePW',
				userId: user.userData.userId,
				prePassword: prePW,
				newPassword: newPW
			},
			function(data, status){
				if(status == 'success'){
					data = JSON.parse(data);	
					switch(data.status){
					case 'success':
						$('#updatePWModal').modal('hide');
						pageDisplay.mentionPage('修改密码成功！');
						break;
					case 'failed':
						user.illegalHandle('当前密码错误');
						break;
					case 'error':
						user.illegalHandle('服务器修改密码失败！');
						break;
					default: break;
					};
				}
				else{
					user.illegalHandle('服务器修改密码失败！');
				}
				$('#updatePWBtn').button('reset');
			}).error(function(){
				$('#updatePWBtn').button('reset');
			});
		},

		//设置密码框
		setPWModal: function(){
			$('#updatePWBtn').on('click', user.updatePW);
			$('#updatePWModal').on('hidden.bs.modal', function()
			{
				$('#updatePWBtn').button('reset');
				user.clearModal();
			});
				
		},

		//设置用户信息
		setUserData: function(){
			$('#nameInput').val(user.userData.name);
			var phoneNumbers = user.userData.phoneNumber;
			for(var i=0; i < phoneNumbers.length; i++){
				$('#telInput').val(phoneNumbers[i]);
				$('#addTelBtn').click();
			}
			$('#mailInput').val(user.userData.email);
			$('#eduInput').val(user.userData.education);
			$('#dateInput').children('input').val(user.userData.eduDate);
			$('#addrInput').val(user.userData.address);
		},

		//保存用户修改信息
		updateUserData: function(){
			$('#warn-text').text('');
			var name=$('#nameInput').val();
			name = name ? name : user.userData.name;
			var email = $('#mailInput').val();
			var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
			if(!emailReg.test(email)){
				regist.illegalHandle('请输入正确的邮箱！');
				return;
			}
			email = email ? email : user.userData.email;
			$('#addTelBtn').click();
			var phoneGroup = $('#telListGroup').find('input');
			var phoneNumbers = new Array();
			$.each(phoneGroup, function(index, telInput){
				if(telInput.value)
					phoneNumbers.push(telInput.value);
			});
			phoneNumbers = phoneNumbers ? phoneNumbers :
					user.userData.phoneNumbers;
			var education = $('#eduInput').val();
			education = education ? education : 
					user.userData.education;
			var eduDate = $('#dateInput input').val();
			eduDate = eduDate ? eduDate : user.userData.eduDate;
			var address = $('#addrInput').val();
			address = address ? address : user.userData.address;
			$('#regAndloginBtn').button('loading');
			//发送数据到服务端
			$.post(serviceAddr,
			{
				operation: 'updateUserData',
				userId: user.userData.userId,
				name: name,
				email: email,
				phoneNumber: phoneNumbers,
				education: education,
				eduDate: eduDate,
				address: address
			},
			function(data, status){
				if(status == 'success'){
					data = JSON.parse(data);
					switch(data.status){
					case 'success':
						pageDisplay.mentionPage('修改成功');
						user.getUserData(user.userData.userId);
						break;
					case 'error':
						pageDisplay.mentionPage('修改失败！');
						break;
					case 'failed':
						regist.illegalHandle('邮箱已被注册，请重新输入');
						break;
					default:
						break;
					};
					
				}else{
					regist.illegalHandle('更新数据失败! ');
				}
				$('#regAndloginBtn').button('reset');
			}).error(function(){
				regist.illegalHandle('更新数据失败! ');
				$('#regAndloginBtn').button('reset');
			});

		},

		setUpdateBtn: function(){

			$('#regAndloginBtn').unbind();
			$('#regAndloginBtn').on('click', user.updateUserData);
		},

		//退出登录
		logout: function(){
			$.post(serviceAddr,{
				operation: 'logout',
				userId: user.userData.userId
			},
			function(data, status){
				if(status == 'success'){var i = 1;}
			});
			user.setUserName('');
			user.userData={};
			$('#passwordForm').removeClass('sr-only');
			$('#navbar-right-login').addClass('sr-only');
			$('#navbar-right-logout').removeClass('sr-only');
			location.href='/weiqi/';

		},

		setMenuBtn: function(){
			$('#pw_li').on('click', function(){
				$('#pw-warn-text').text('');
			});
			$('#ud_li').on('click', function(){
				$('#warn-text').text('');
				user.setUserData();
			});
			$('#logoutBtn').on('click', function(){
				user.logout();
			});
		},

		clearModal: function(){
			$.each($('#updatePWModal').find('input'), 
				function(index, inputBox){
				inputBox.value='';
			});
			$.each($('#modal-form').find('input'), 
				function(index, inputBox){
				inputBox.value='';
			});

			$('#telListGroup').empty();
			$('#warn-text').text('');
			$('#pw-warn-text').text('');
	
		}
	};
	var pictureWall = {
		init: function(){
			if(!$('#picture-wall').length)
				return;
			this.addLgPicture('picture (1).jpg');
			this.addLgPicture('picture (2).jpg');
			this.addSmPicture('picture (3).jpg');
			this.addSmPicture('picture (4).jpg');
			this.addSmPicture('picture (5).jpg');
			this.addSmPicture('picture (6).jpg');
			this.addSmPicture('picture (7).jpg');
			this.addSmPicture('picture (8).jpg');
			//this.addSmPicture('2.jpg');
		},
			
		//添加大图片
		addLgPicture: function(name){
			var picDiv = $('<div></div>').addClass('col-xs-12 col-sm-6');
			var thumbnail = $('<a></a>').addClass('thumbnail').attr({'href':'#','data-toggle':'modal', 'data-target':'#picture'});
			thumbnail.append($('<img></img>').addClass('m_picture').attr("src", "../picture-wall/thumbnail/"+name));
			thumbnail.on('click', function(){
				$('#picture-name').text(name);
				$('#full-picture').attr('src', "../picture-wall/fullpicture/"+name);
			});
			picDiv.append(thumbnail);
			$('#picture-wall').append(picDiv);
		},
		//添加小图片
		addSmPicture: function(name){
			var picDiv = $('<div></div>').addClass('col-xs-6 col-sm-3');
			var thumbnail = $('<a></a>').addClass('thumbnail').attr({'href':'#', 'data-toggle': 'modal', 'data-target':'#picture'});
			thumbnail.append($('<img></img>').addClass('m_picture').attr("src", "../picture-wall/thumbnail/"+name));
			thumbnail.on('click', function(){
				$('#picture-name').text(name);
				$('#full-picture').attr('src', "../picture-wall/fullpicture/"+name);
			});
			picDiv.append(thumbnail);
			$('#picture-wall').append(picDiv);
		},
	};

	var search = {
		init: function(){
			this.setSearchBtn();
		},

		setSearchBtn: function(){
			$('#searchBtn').on('click', search.searchOpt);
			$('#searchAll').on('click', search.searchAllOpt);
		},

		//搜索操作
		searchOpt: function(){
			if(!user.userData.name){
				//如果还没登录，则显示登录框
				$('#loginBtn').click();
				return;
			}
			var searchKW = $('#search_input').val();
			if(!searchKW)
				return;
			window.location.href='/weiqi/search?name='+user.userData.name+
				'&uid='+user.userData.userId+'&search='+searchKW;
		},

		//搜索全部用户操作
		searchAllOpt: function(){
			if(!user.userData.name){
				//如果还没登录，则显示登录框
				$('#loginBtn').click();
				return;
			}
			window.location.href='/weiqi/search?name='+user.userData.name+
				'&uid='+user.userData.userId+'&search';
		},


		//向服务器搜索指定keyword的数据
		searchServer: function(uid, keyword){
			$('#result_mes').text('正在搜索中...');
			$.post(serviceAddr,
			{
				operation: 'search',
				userId:	uid,
				keyword: keyword
			},
			function(data, status){
				if(status == 'success'){
					data = JSON.parse(data);
					switch(data.status){
					case 'error':
						user.logout(user.userData.userId);
						break;
					case 'failed':
					case 'success':
						search.showSearchResult(keyword,data);
						break;
					default: break;
					};
				}
				else
					$('#result_mes').text('搜索失败! ');
			}).error(function(){
				$('#result_mes').text('服务器错误！');
			});
		},

		//向服务顺搜索全部数据
		searchAll: function(uid){
			$('#result_mes').text('正在搜索中...');
			$.post(serviceAddr,
			{
				operation: 'searchAll',
				userId:	uid,
			},
			function(data, status){
				if(status == 'success'){
					data = JSON.parse(data);
					switch(data.status){
					case 'error':
						user.logout(user.userData.userId);
						break;
					case 'failed':
					case 'success':
						search.showSearchResult(null,data);
						break;
					default: break;
					};
				}
				else
					$('#result_mes').text('搜索失败! ');
			}).error(function(){
				$('#result_mes').text('服务器错误！');
			});

		},

		//设置显示搜索结果
		showSearchResult: function(keyword, res){
			if(res.count == 0){
				$('#result_mes').text('找不到您的朋友 '+keyword);
				return;
			}
			$('#result_mes').text('共找到 '+res.count+' 个结果');
			var result = res.userData;
			var eduGroup = {};
			var addrGroup = {};
			for(var i=0; i < res.count; i++){
				var friend = result[i];
				if(eduGroup[friend.education])
					eduGroup[friend.education]++;
				else
					eduGroup[friend.education] = 1;
				if(addrGroup[friend.address])
					addrGroup[friend.address]++;
				else
					addrGroup[friend.address] = 1;
				var panel = $('<div></div>').addClass('panel panel-primary');
				var panel_head = $('<div></div>').addClass('panel-heading').append($('<h3></h3>').addClass('panel-title'));
				var panel_body = $('<div></div>').addClass('panel-body');
				var panel_footer = $('<div></div>').addClass('panel-footer');
				panel_head.children('h3').text(friend.name);
				var phoneNumber = friend.phoneNumber;
				for(var n =0; n < phoneNumber.length; n++){
					panel_body.append($('<p></p>').text('电话：'+phoneNumber[n]));
				}
				/*
				panel_body.append($('<p></p>').text(friend.education + '入学时间：' +
					friend.eduDate));
				*/
				panel_body.append($('<p></p>').text('电子邮箱：' + friend.email));
				panel_body.append($('<p></p>').text('街道：' + friend.address));
				panel_footer.text('最后修改时间：'+friend.modifiedDate);

				panel.append(panel_head).append(panel_body).append(panel_footer);
				$('#result_list').append(panel);
			}

			//this.sortResult('Education', eduGroup);
			this.sortResult('Address', addrGroup);
		},

		//对搜索结果进行分组
		sortResult: function(listName, group){
			var sideList = $('<div></div>').addClass('m_sidebar');
			sideList.append($('<h2></h2>').text(listName));
			var sideGroup = $('<ul></ul>').addClass('list-group');
			for(itemName in group){
				var listItem = $('<li></li>').addClass('list-group-item');
				listItem.append($('<span></span>').addClass('badge').text(group[itemName]));
				listItem.append($('<span></span>').text(itemName));
				sideGroup.append(listItem);
			}
			sideList.append(sideGroup);
			$('#sidebar').append(sideList);
		}
	};


	//闪烁文字
	var message = {

		message: [
			'他们都是人渣', 
			'没事来约我踢球啊', 
		],
		counterS: 0,
		counterL: 0,
		deleteS: false,

		init: function() {
			this.cacheElem();
			this.showMessage();
		},

		cacheElem: function() {
			this.$text = $('#flash_text');
		},

		showMessage: function(){
			$.post(serviceAddr,
			{
				operation: 'count',
			},
			function(data, status){
				if(status == 'success')
					data = JSON.parse(data);
					message.message.push('现在共有' + data.count + '个朋友');
				message.type();
			}).error(function(){
				message.type();
			});

		},

		type: function() {
			var message = this.message[this.counterS],
				  that = this,
				  speed = 0;

			message = !this.deleteS ? 
				message.slice(0, ++this.counterL) :
				message.slice(0, --this.counterL);
			if(this.message[this.counterS] != message && 
			!this.deleteS) {
				this.$text.text(message);
				speed = 90;
			}
			else {
				this.deleteS = true;
				speed = this.message[this.counterS] == 
					message ? 1000 : 40;
				this.$text.text(message);
				if (message == '') {
					this.deleteS = false;
					this.counterS = this.counterS < 
					this.message.length - 1 ? 
					this.counterS + 1 : 0;
				}
			}
			setTimeout(function(){that.type()}, speed);
		}
	};

	//上传图片操作
	var uploadImage = {
		imageFile: 0,

		init: function(){
			this.setModal();
			this.setImgSelectBtn();
			this.setImgUploadBtn();
			this.imageFile = 0;
		},

		setModal: function(){
			$('#headImage').on('click',uploadImage.initModal);
		},

		initModal: function(){
			$('#uploadMention').text('');
			var headImage = user.userData.headImage;
			if(!user.userData.headImage)
				return;
			$('#camera').addClass('sr-only');
			$('#rawImg').attr('src', headImage);
			$('#itemImg').attr('src', headImage);
			$('#headImg').attr('src', headImage);
		},

		//将用户选择的头像图片文件取出
		handleHeadImage: function(files){
			$('#uploadMention').text('');
			uploadImage.imageFile = 0;
			for (var i = 0; i< files.length; i++){
				var file = files[i];
				var imageType = /image.*/;

				//如果不是图片文件
				if (!file.type.match(imageType)){
					$('#uploadMention').text('请确保选择的文件为图片文件！');
					return;
				}
				//如果图片大小超过1M
				if (file.size / (1024*1024) >= 1){
					$('#uploadMention').text('图片大小超过1M，无法上传');
					return;
				}	
				var rawimg = $('#rawImg');
				var rawreader = new FileReader();
				rawreader.onload = (function(aImg){
					return function(e){
						aImg.attr('src',e.target.result);
						uploadImage.imageFile = e.target.result;
					};
				})(rawimg);
				rawreader.readAsDataURL(file);
				var itemimg = $('#itemImg');
				var itemreader = new FileReader();
				itemreader.onload = (function(aImg){
					return function(e){
						aImg.attr('src',e.target.result);
					};
				})(itemimg);
				itemreader.readAsDataURL(file);
				var headimg = $('#headImg');
				var headreader = new FileReader();
				headreader.onload = (function(aImg){
					return function(e){
						aImg.attr('src',e.target.result);
					};
				})(headimg);
				headreader.readAsDataURL(file);
			}
		},

		setImgSelectBtn: function(){
			$('#imgSelectBtn').on('change', function(){
				var files = $('#imgSelectBtn')[0].files;
				uploadImage.handleHeadImage(files);
			});
		},

		//上传图片
		uploadHeadImage: function(){
			if(!uploadImage.imageFile){
				$('#uploadMention').text('请选择图片!');
				return;
			}
			$('#imgUploadBtn').button('loading');
			$.post(serviceAddr,
			{
				operation: 'uploadHeadImage',
				userId: user.userData.userId,
				image: uploadImage.imageFile
			},function(data, status){
				if(status == 'success'){
					data = JSON.parse(data);
					switch(data.status){
					case 'error':
						user.logout(user.userData.userId);
						break;
					case 'failed':
						pageDisplay.mentionPage('上传头像失败！');
						break;
					case 'success':
						$('#headImage').attr('src',uploadImage.imageFile); 
						pageDisplay.mentionPage('头像上传成功！');
						break;
					default: break;

					};
				}else{
				}
				$('#uploadImageModal').modal('hide');
				$('#imgUploadBtn').button('reset');
			}).error(function(){
				pageDisplay.mentionPage('上传头像失败！');
				$('#uploadImageModal').modal('hide');
				$('#imgUploadBtn').button('reset');
			});
		},

		setImgUploadBtn: function(){
			$('#imgUploadBtn').on('click', uploadImage.uploadHeadImage);
		}

	};
	message.init();
	logo.init();
	regist.init();
	pageDisplay.init();
	search.init();
	pictureWall.init();
	uploadImage.init();
	$('#registBtn').on('click',function(){
		regist.init();
	});

	$('#loginBtn').on('click', function(){
		login.init();
	});
});
