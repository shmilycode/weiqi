//事件处理函数
$(function(){
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
		//电话输入框只能输入数字
		inputTel: function(){
			var tmptxt = $(this).val();
			$(this).val(tmptxt.replace(/\D|^0/g,''));
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
				paste: function(){return false;}
			}).css("-webkit-ime-mode: disabled;\
				-moz-ime-mode: disabled;\
				-ms-ime-mode: disabled;\
				ime-mode: disabled;");//禁用输入法和中文输入:
			$("#addTelBtn").click(regist.addTelOpt);
		},
		//选择学历框
		setEduSelector: function(){
			$('#eduInput').bind({
				keypress: function(){
					event.returnValue = false;},
				paste: function(){
					return false;}
			});
			$('#eduDropdown li').on('click', function(){
				$('#eduInput').val($(this).text());
				regist.setDateInput($(this).text()+'入学日期');
			});

		},
		//设置入学日期选择框
		setDateInput: function(placeholder){
			var dateInput = $('#dateInput');	
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
		//初始化注册框
		registInit: function(){
			$('#modal-title').text('注册');
			this.setTelInput();
			this.setEduSelector();
		}
  	};
	regist.registInit();
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
