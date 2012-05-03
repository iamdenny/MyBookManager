com.iamdenny.MyBookManager.DB = jindo.$Class({
	
	_db : null,
	_sPrefix : 'dny_',
	_nDBSize : 10 * 1024 * 1024, // 20MB
	
	$init : function(){
		this._open();
		this._createTable();
	},
	
	_open :  function() {
  		this._db = openDatabase('MyBookManager', '1.0', 'My Book Manager', this._nDBSize);
  	},
  	
  	onError : function(tx, e) {
		alert('예기치 않은 오류가 발생하였습니다: ' + e.message );
	},
	
	onSuccess : function(tx, r) {
	  // 모든 데이터를 다시 그림
	  //html5rocks.webdb.getAllTodoItems(tx, r);
	},
	
	_createTable : function() {
		var self = this;
	  	this._db.transaction(function(tx) {
	   		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
	                  self._sPrefix + 'List(l_idx INTEGER PRIMARY KEY ASC, title TEXT, added_on DATETIME)', []);
	  	});
	}
  	
});