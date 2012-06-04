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
        this._woBook = new com.iamdenny.MyBookManager.Book(this._woDB);
		this._woList = new com.iamdenny.MyBookManager.List(this._woDB, this._woConfig, this._woBook);
		this._woSearchAPI = new com.iamdenny.MyBookManager.SearchAPI(this._woDB, this._woConfig);
        this._woSearchAPI.attach('addBook', function(htData){
            self._woBook.addBook(htData);
        });
        //bConfigExists = false;
		if(!bConfigExists){
			$.mobile.showPageLoadingMsg("b", "Initialization...", true);
			this._woConfig.setAsDefault();
			this._woDB.setAsDefault();
            this._woConfig.loadData();
			this._woDB.attach('DefaultDataSuccess', function(eEvent){
                console.log('DefaultDataSuccess');
				self._woList.showList();
				$.mobile.hidePageLoadingMsg();
			});
		}else{
            this._woConfig.loadData();
			this._woList.showList();	
			$.mobile.hidePageLoadingMsg();		
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
