com.iamdenny.MyBookManager = jindo.$Class({
	
	$init : function(){
		
		this._woConfig = new com.iamdenny.MyBookManager.Config();
		var bCurrentBrowserSupport = this._woConfig.checkCurrentBrowserSupport();
		if(!bCurrentBrowserSupport){
			alert('지원하지 않는 브라우저 입니다. 크롬 또는 사파리를 이용해주세요.');
			return false;
		}
		var bConfigExists = this._woConfig.checkConfigExists();
		if(!bConfigExists){
			//alert('초기 설정 정보를 셋팅합니다.');
			this._woConfig.setAsDefault();
		} 
		
		this._woDB = new com.iamdenny.MyBookManager.DB();
		
		this._woList = new com.iamdenny.MyBookManager.List(this._woDB);
		this._woList.showList();
	}
});
