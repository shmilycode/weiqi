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
			var message 	= this.message[this.counterS],
				  that 	    = this,
				  speed 	  = 0;

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
