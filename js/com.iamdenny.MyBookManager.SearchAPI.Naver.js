
/*
	http://openapi.naver.com/search?key=de5ca00aaa40ab254ea5dec2c93247fd&query=%EC%82%BC%EA%B5%AD%EC%A7%80&target=book&display=20&start=1
	http://openapi.naver.com/search?key=de5ca00aaa40ab254ea5dec2c93247fd&query=%EC%82%BC%EA%B5%AD%EC%A7%80&display=10&start=1&target=book
	http://openapi.naver.com/search?key=de5ca00aaa40ab254ea5dec2c93247fd&query=art&display=10&start=1&target=book_adv&d_titl=art&d_catg=103
	http://openapi.naver.com/search?key=de5ca00aaa40ab254ea5dec2c93247fd&query=movie&target=ranktheme
 */
	
com.iamdenny.MyBookManager.SearchAPI.Naver = jindo.$Class({
	
	_sProxyUrl : 'http://ajaxui.nhndesign.com/jsMatch/temp/PracticalAjaxUIProxy.php',
	_sUrl : 'http://openapi.naver.com/search',
	_sKey : 'de5ca00aaa40ab254ea5dec2c93247fd',
	
	$init : function(){
		this._woAjax = jindo.$Ajax(this._sProxyUrl, {
			onerror : jindo.$Fn(this._onError, this).bind()
		});
	},
	
	_onError : function(e){
		console.log(e);
	},
	
	_onResponseKeyword : function(that, sCallback, oRes){
		var htData = this._parseJSON(oRes);
		alert(htData);
		that[sCallback](htData);
		
	},
	
	_parseJSON : function(oRes){
		var htNewData = oRes.json().channel.item;
		return htNewData; 
	},
	
	getRSS : function(sQuery, nStart, nDisplay, that, sCallback){
		var self = this;
		if(jindo.$Agent().navigator().mobile){
			// $.get(this._sUrl, 
			 	// {	key: this._sKey, 
			 		// query: sQuery,
			 		// start : nStart,
			 		// display : nDisplay },
			   	// function(data){
			   		// alert(data);
			    	// self._onResponseKeyword(that, sCallback, data);
			   	// }
			// );
			this._woAjax.option('onload', jindo.$Fn(this._onResponseKeyword, this).bind(that, sCallback));
			this._woAjax.option('type', 'xhr');
			this._woAjax.url(this._sUrl);
			this._woAjax.request({key:this._sKey,query:sQuery,display:nDisplay,start:nStart,target:'book'});
		}else{
			sQuery = encodeURIComponent(sQuery);
			this._woAjax.option('onload', jindo.$Fn(this._onResponseKeyword, this).bind(that, sCallback));
			this._woAjax.option('type', 'jsonp');
			this._woAjax.url(this._sProxyUrl);
			this._woAjax.request({
				url : this._sUrl + '?key='+this._sKey+'&query='+sQuery+'&display='+nDisplay+'&start='+nStart+'&target=book' 
			});	
		}		
	}
});
