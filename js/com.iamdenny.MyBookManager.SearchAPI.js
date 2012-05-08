com.iamdenny.MyBookManager.SearchAPI = jindo.$Class({
	
	_woDB : null,
	_woNaverAPI : null,
	_woGoogleAPI : null,
	
	$init : function(woDB){
		this._woDB = woDB;
		
		this._welAddBook = jindo.$Element('addbook');
		this._welAddBookSearchInput = jindo.$Element('addbook-search-input');
		this._welAddBookList = jindo.$Element('addbook-list');
		
		this._wtAddBookListBook = jindo.$Element('tpl-addbook-list-book');
		
		this._woNaverAPI = new com.iamdenny.MyBookManager.SearchAPI.Naver();
		
		this._initEvent();	
	},
	
	_initEvent : function(){
		var self = this;
		$(this._welAddBookSearchInput.$value()).keyup(function(eEvent){
			self._getRSS($(this).val());			 	
		});
		 
	},
	
	_getRSS : function(sText){
		var sQuery = sText
			, nStart = 1
			, nDisplay = 20;
		this._woNaverAPI.getRSS(sQuery, nStart, nDisplay, this._callbackRSS);
	},
	
	_callbackRSS : function(xml){
		alert(xml);
		console.log(xml);
	}
	
});
