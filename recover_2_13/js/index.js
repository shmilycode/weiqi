//事件处理函数
$(function(){
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
			var password = $('keywordInput').val();
			if(!password){
				regist.illegalHandle('密码不能为空！');
				return;
			}
			var email = $('#mailInput').val();

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

			//发送数据到服务端
			$.post("index.php",
			{
				operaton: 'regist',
				name: name,
				password: password,
				email: email,
				telphone: telNumbers,
				education: education,
				eduDate: eduDate,
				address: address
			},
			function(data, status){
			});
		},
		//设置注册按键与后台的交流
		setRegistBtn: function(){
			var regBtn = $('#regAndloginBtn');
			regBtn.on('click', regist.postRegistData);
		},
		//初始化注册框
		registInit: function(){
			clearModal();
			//清空缓存的号码
			$('#modal-title').text('注册');
			$('#regAndloginBtn').text('注册');
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
		loginInit: function(){
			clearModal();
			$('#modal-title').text('登录');
			$('#regAndloginBtn').text('登录');
			$('#hide_login').addClass('sr-only');
			$('.help-block').addClass('sr-only');
			$('#registerExplain').addClass('sr-only');
			this.setLoginBtn();
		},
		//将注册数据发送到后台
		postLoginData: function(data, response){
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
			//发送数据到服务端
			$.post("index.php",
			{
				operaton: 'login',
				name: name,
				password: password
			},
			function(data, status){
			});
		},
		//设置注册按键与后台的交流
		setLoginBtn: function(){
			var loginBtn = $('#regAndloginBtn');
			loginBtn.on('click', login.postLoginData);
		},


	};

	$('#registBtn').on('click',function(){
		regist.registInit();
	});

	$('#loginBtn').on('click', function(){
		login.loginInit();
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
