//事件处理函数
$(function(){

	//根据页面中的参数对页面进行调整
	var pageDisplay = {
		init: function(){
			var href = window.location.href;
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
				//获取用户参数
				var nameReg = /name=(.*)?&/;
				var name = nameReg.exec(searchPara[1]);
				var uidReg = /uid=(.*)&/;
				var uid = uidReg.exec(searchPara[1]);
				var keywordReg = /search=(.*)$/;
				var keyword = keywordReg.exec(searchPara[1]);
				user.init(name[1], uid[1]);
				pageDisplay.loginDisplay();
				pageDisplay.searchDisplay();
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

	//将modal中所有输入框和记录清空
	function clearModal(){
		$.each($('#modal-form').find('input'), function(index, inputBox){
			inputBox.value='';
		});
		$('#telListGroup').empty();
		$('#warn-text').text('');
	};

	//注册框处理事件
	var regist = { 
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
			if(!email){
				regist.illegalHandle('邮箱不能为空！');
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
			$.post("php/index.php",
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

					case 'failed': 
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
				clearModal();
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
			var password = $('#loginPasswordInput').val();
			if(!password){
				login.illegalHandle('密码不能为空！');
				return;
			}
			//发送数据到服务端
			$('#loginSubmitBtn').button('loading');
			$.post("php/index.php",
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

		//登录成功后的处理
		loginSuccess: function(data){
			window.location.href='/weiqi?name=' + 
				data.name + '&uid=' + data.userId;
		},
	};

	var user = {
		//用户数据
		userData:{
		},
		init: function(name, uid){
			this.getUserData(name, uid);
			clearModal();
			this.setMenuBtn();
			this.setPWModal();
			this.setUpdateBtn();
		},

		//向服务器请求用户信息
		getUserData: function(name, uid){
			$.post('php/index.php',{
				operation: 'userdata',
				name: name,
				userId: uid
			},
			function(data,status){
				//获取到的数据赋值给userData
				if(status == 'success'){
					data = JSON.parse(data);
					user.userData = data;
					user.setUserName(user.userData.name);
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
			$.post("php/index.php",
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
				clearModal();
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
			$('warn-text').text('');
			var name=$('#nameInput').val();
			name = name ? name : user.userData.name;
			var email = $('#mailInput').val();
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
			//发送数据到服务端
			$.post("php/index.php",
			{
				operation: 'updateUserData',
				userId: user.userData.id,
				name: name,
				email: email,
				phoneNumber: phoneNumbers,
				education: education,
				eduDate: eduDate,
				address: address
			},
			function(data, status){
			});

		},

		setUpdateBtn: function(){

			$('#regAndloginBtn').unbind();
			$('#regAndloginBtn').on('click', user.updateUserData);
		},

		//退出登录
		logout: function(){
			location.href='/weiqi/';
			user.setUserName('');
			user.userData={};

			$.post('php/index.php',{
				operation: 'logout',
				name: user.userData.name,
				userId: user.userData.id
			},
			function(data, status){
				if(status == success){
					$('#passwordForm').removeClass('sr-only');
					$('#navbar-right-login').addClass('sr-only');
					$('#navbar-right-logout').removeClass('sr-only');
					user.setUserName('');
				}
			});
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

		//向服务器搜索
		searchServer: function(uid, keyword){
			$('#result_mes').text('正在搜索中...');
			$.post('php/index.php',
			{
				operation: 'search',
				userId:	uid,
				keyword: keyword
			},
			function(data, status){
				search.showSearchResult(keyword,res);
			});
		},

		//设置显示搜索结果
		showSearchResult: function(keyword, res){
			if(res.count == 0){
				$('#result_mes').text('找不到您的朋友 '+keyword);
				return;
			}
			$('#result_mes').text('共找到 '+res.count+' 个结果');
			var panel = $('<div></div>').addClass('panel panel-primary');
			var panel_head = $('<div></div>').addClass('panel-heading').append($('<h3></h3>').addClass('panel-title'));
			var panel_body = $('<div></div>').addClass('panel-body');
			var panel_footer = $('<div></div>').addClass('panel-footer');
			var result = res.result;
			for(var i=0; i < res; i++){
				var friend = result[i];
				panel_head.children('h3').text(friend.name);
				var telNumbers = friend.phoneNumber;
				for(var tel in telNumbers){
					panel_body.append($('<p></p>').text('电话：'+tel));
				}
				panel_body.append($('<p></p>').text('街道：' + friend.address));
				panel_body.append($('<p></p>').text(friend.education + '：' +
					friend.eduDate));
				panel_footer.text('最后修改时间：'+friend.lastChange);

				panel.append(panel_head).append(panel_body).append(panel_footer);
				$('#result_list').append(panel);
			}
		}
	};

	regist.init();
	pageDisplay.init();
	search.init();
	pictureWall.init();
	$('#registBtn').on('click',function(){
		regist.init();
	});

	$('#loginBtn').on('click', function(){
		login.init();
	});
});


//闪烁文字
$(function() {
	var message = {

		message: [
			'现在共有n位朋友', 
			'他们都是人渣', 
			'没事来约我踢球啊', 
		],
		counterS: 0,
		counterL: 0,
		deleteS: false,

		init: function() {
			this.cacheElem();
			this.type();
		},

		cacheElem: function() {
			this.$text = $('#flash_text');
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
	message.init();
});
