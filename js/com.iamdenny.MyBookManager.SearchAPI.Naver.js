
/*
	http://openapi.naver.com/search?key=de5ca00aaa40ab254ea5dec2c93247fd&query=%EC%82%BC%EA%B5%AD%EC%A7%80&target=book&display=20&start=1
	http://openapi.naver.com/search?key=de5ca00aaa40ab254ea5dec2c93247fd&query=%EC%82%BC%EA%B5%AD%EC%A7%80&display=10&start=1&target=book
	http://openapi.naver.com/search?key=de5ca00aaa40ab254ea5dec2c93247fd&query=art&display=10&start=1&target=book_adv&d_titl=art&d_catg=103
	http://openapi.naver.com/search?key=de5ca00aaa40ab254ea5dec2c93247fd&query=movie&target=ranktheme
 */
	
com.iamdenny.MyBookManager.SearchAPI.Naver = jindo.$Class({
	
	_sUrl : 'http://openapi.naver.com/search',
	_sKey : 'de5ca00aaa40ab254ea5dec2c93247fd',
	
	$init : function(){
		
	},
	
	getRSS : function(sQuery, nStart, nDisplay, fCallback){
		$.get(this._sUrl, 
		 	{	key: this._sKey, 
		 		query: sQuery,
		 		start : nStart,
		 		display : nDisplay },
		   	function(data){
		    	fCallback(data);
		   	}
		);
	}
});
