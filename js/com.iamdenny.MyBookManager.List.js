com.iamdenny.MyBookManager.List = jindo.$Class({
	
	_woDB : null,
	_wtMainListDivider : null,
	_nMainListIsReadingLimit : null,
	_nMainListFavoriteLimit : null,
	
	$init : function(woDB){
		this._woDB = woDB;	
		
		this._welMainList = jindo.$Element('main-list');
		
		this._initTemplates();
		
		this._nMainListIsReadingLimit = 3;
		this._nMainListFavoriteLimit = 3;
	},
	
	_initTemplates : function(){
		this._wtMainListDivider = jindo.$Template('tpl-main-list-divider');
		this._wtMainListBook = jindo.$Template('tpl-main-list-book');		
	},
	
	showList : function(){
		var self = this;
		
		this._woDB.loadList(function(tx, results){
			var el = jindo.$(self._wtMainListDivider.process({title : '현재 읽고 있는 도서'}));
			self._welMainList.append(el);
				
			for (var i = 0, len = results.rows.length; i < len; i++){
				var el = jindo.$(self._wtMainListBook.process(results.rows.item(i)));
				self._welMainList.append(el);
			}
			
			self._refreshListView();
			fFavorite();
		}, 'is reading', null, null, self._nMainListIsReadingLimit);
		
		var fFavorite = function(){
			self._woDB.loadList(function(tx, results){
				var el = jindo.$(self._wtMainListDivider.process({title : '즐겨찾는 도서'}));
				self._welMainList.append(el);
					
				for (var i = 0, len = results.rows.length; i < len; i++){
					var el = jindo.$(self._wtMainListBook.process(results.rows.item(i)));
					self._welMainList.append(el);
				}
				
				self._refreshListView();
				fWillRead();
			}, 'favorite', null, null, self._nMainListFavoriteLimit);
		};
		
		var fWillRead = function(){
			self._woDB.loadList(function(tx, results){
				var el = jindo.$(self._wtMainListDivider.process({title : '앞으로 읽을 도서'}));
				self._welMainList.append(el);
					
				for (var i = 0, len = results.rows.length; i < len; i++){
					var el = jindo.$(self._wtMainListBook.process(results.rows.item(i)));
					self._welMainList.append(el);
				}
				
				self._refreshListView();
				fHasRead();
			}, 'will read', null, null, self._nMainListFavoriteLimit);
		};
		
		var fHasRead = function(){
			self._woDB.loadList(function(tx, results){
				var el = jindo.$(self._wtMainListDivider.process({title : '다 읽은 도서'}));
				self._welMainList.append(el);
					
				for (var i = 0, len = results.rows.length; i < len; i++){
					var el = jindo.$(self._wtMainListBook.process(results.rows.item(i)));
					self._welMainList.append(el);
				}
				
				self._refreshListView();
			}, 'has read', null, null, self._nMainListFavoriteLimit);
		};
		
	},
		
	_refreshListView : function(){
		$(this._welMainList.$value()).listview('refresh');
	}
});