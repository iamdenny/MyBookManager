// localStorage.length // num of items stored
// localStorage.key(0); // 'dateOfBirth'
// localStorage.removeItem('dateOfBirth');
// localStorage.clear();

// localStorage.setItem('user', JSON.stringify({user: 'john', id: 10}));
// var user = JSON.parse(localStorage.getItem('user'));

com.iamdenny.MyBookManager.Config = jindo.$Class({
    
    _welConfig : null,
    _welConfigContent : null,
    
	$init : function(){
		this._welConfig = jindo.$Element('config');
		this._welConfigContent = jindo.$Element('config-content');
        
        $('#config').page();
        
        this._initPageShowEvent();
        this._initEvents();        
	},
    
    _initPageShowEvent : function(){
		var self = this;
		$("#config").bind("pagebeforehide", function(event, ui){
			self.fireEvent('pagebeforehide');
		}).bind("pagehide", function(event, ui){
            self.fireEvent('pagehide');
		});
        
    },
    
    _initEvents : function(){
        var self = this;

        $(".config-content-main").bind("change", function(eEvent) {
            var sId = eEvent.target.id;
            sId = sId.replace('c_', '');
            var htMain = self.get('main');
            htMain[sId] = eEvent.target.value;
            self.set('main', htMain);            
        });  
        $('.config-content-search').bind('change', function(eEvent){
            var sId = eEvent.target.id;
            sId = sId.replace('c_', '');
            var htSearch = self.get('search');
            htSearch[sId] = eEvent.target.value;
            self.set('search', htSearch);
        });
    },
    
    loadData : function(){
        var htMain = this.get('main');
        
        $('#c_isreading_count').val(htMain.isreading_count);
        $('#c_favorite_count').val(htMain.favorite_count);
        $('#c_willread_count').val(htMain.willread_count);
        $('#c_hasread_count').val(htMain.hasread_count);
        $('.config-content-main').slider('refresh');
        
        var htSearch = this.get('search');
        $('#c_result_count').val(htSearch.result_count);
        $('.config-content-search').slider('refresh');
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
		if(!localStorage.getItem('homepage')){
			bConfigExists = false;
		}
        //bConfigExists = false; // for testing
		return bConfigExists;
	},
	
	setAsDefault : function(){
		try{
			localStorage.setItem('homepage', 'http://mybookmanager.iamdenny.com');
            var htMain = {
                isreading_count : 3,
                favorite_count : 3,
                willread_count : 3,
                hasread_count : 3
            };
            this.set('main', htMain);
            
            var htSearch = {
                result_count : 20
            }
            this.set('search', htSearch);
            
            var htSync = {
                sync : false,
                id : null,
                password : null,
                interval : 1,
            }
            this.set('sync', htSync);
		}catch (e) {
            console.log(e);
			//alert('Web Storage 할당량 초과 입니다.');
		}
    },
    
    set : function(sKey, htData){
        var sData = jindo.$Json(htData).toString();
        console.log(sData);
        localStorage.setItem(sKey, sData);
    },
    
    get : function(sKey){
        return jindo.$Json(localStorage.getItem(sKey)).toObject();
    }
}).extend(jindo.Component);