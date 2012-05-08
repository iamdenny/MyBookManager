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
		if(!bConfigExists){
			$.mobile.showPageLoadingMsg("b", "초기 셋팅 중...", true);
			this._woConfig.setAsDefault();
			this._woDB.setAsDefault();
			setTimeout(function(){
				self._woList.showList();
				$.mobile.hidePageLoadingMsg();
			}, 3000);
		}else{
			this._woList.showList();			
		}
	}
});
