// localStorage.length // num of items stored
// localStorage.key(0); // 'dateOfBirth'
// localStorage.removeItem('dateOfBirth');
// localStorage.clear();

// localStorage.setItem('user', JSON.stringify({user: 'john', id: 10}));
// var user = JSON.parse(localStorage.getItem('user'));

com.iamdenny.MyBookManager.Config = jindo.$Class({
	
	_sPrefix : 'dny_',
	
	$init : function(){
		
	},
	
	checkCurrentBrowserSupport : function(){
		var bCurrentBrowserSupport = true;
		if(typeof(window.openDatabase) == 'undefined'){
			bCurrentBrowserSupport = false;
		}
		if (typeof(localStorage) == 'undefined' ) {
			bCurrentBrowserSupport = false;
		}
		return bCurrentBrowserSupport;
	},
	
	checkConfigExists : function(){
		var bConfigExists = true;
		if(!localStorage.getItem(this._sPrefix + 'homepage')){
			bConfigExists = false;
		}
		return bConfigExists;
	},
	
	setAsDefault : function(){
		try{
			localStorage.setItem(this._sPrefix + 'homepage', 'http://mybookmanager.iamdenny.com');
		}catch (e) {
     		if (e == QUOTA_EXCEEDED_ERR) {
				alert('Web Storage 할당량 초과 입니다.');
			}
		}
	}
});