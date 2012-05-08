com.iamdenny.MyBookManager = jindo.$Class({
	
	$init : function(){
		var self = this;
		
		this._woConfig = new com.iamdenny.MyBookManager.Config();
		var bCurrentBrowserSupport = this._woConfig.checkCurrentBrowserSupport();
		if(!bCurrentBrowserSupport){
			alert('지원하지 않는 브라우저 입니다. 크롬 또는 사파리를 이용해주세요.');
			return false;
		}
		var bConfigExists = this._woConfig.checkConfigExists();
		this._woDB = new com.iamdenny.MyBookManager.DB();
		this._woList = new com.iamdenny.MyBookManager.List(this._woDB);
		this._woSearchAPI = new com.iamdenny.MyBookManager.SearchAPI(this._woDB);
		if(!bConfigExists){
			$.mobile.showPageLoadingMsg("b", "Initialization...", true);
			this._woConfig.setAsDefault();
			this._woDB.setAsDefault();
			setTimeout(function(){
				self._woList.showList();
				$.mobile.hidePageLoadingMsg();
			}, 3000);
		}else{
			this._woList.showList();			
		}
		
		// $(document).bind('tap', function(){
			// alert('tap');
		// });
		// $(document).bind('taphold', function(){
			// alert('taphold');
		// });
		// $(document).bind('swipe', function(event, data){
			// event.preventDefault();
			// alert('swipe');
		// });
		// $(document).bind('swipeleft', function(event, data){
			// event.preventDefault();
			// history.go();
		// });
		// $(document).bind('swiperight', function(event, data){
			// event.preventDefault();
			// history.back();
		// });
		$(window).bind('orientationchange', function (e) {
		    // setTimeout(function(){
		    	// var bodyHeight = $(document.body).height();
		    	// alert(bodyHeight)
		    // },200);
		    // window.resizeBy(screen.width ,100)
		});
		$(document).bind('pagebeforeshow', function(){
			$('.ui-btn-active.auto-turn-off').removeClass('ui-btn-active');
		});
		
	}
});
