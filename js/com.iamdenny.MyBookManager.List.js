com.iamdenny.MyBookManager.List = jindo.$Class({
	
	_woDB : null,
	_wtMainListDivider : null,
	_wtMainListBookDetail : null,
	_wtViewBook : null,
	_nMainListIsReadingLimit : null,
	_nMainListFavoriteLimit : null,
	_nMainListBookIdx : null,
	
	$init : function(woDB){
		this._woDB = woDB;	
		
		this._welMainList = jindo.$Element('main-list');
		this._welViewBookContent = jindo.$Element('viewbook-content');
		
		this._nMainListIsReadingLimit = 3;
		this._nMainListFavoriteLimit = 3;
		
		this._initTemplates();
		this._initPageShowEvnet();
		this._initClickEvent();
	},
	
	_initTemplates : function(){
		this._wtMainListDivider = jindo.$Template('tpl-main-list-divider');
		this._wtMainListBook = jindo.$Template('tpl-main-list-book');		
		this._wtViewBookDetail = jindo.$Template('tpl-viewbook-detail');
	},

	_initPageShowEvnet : function(){
		var self = this;
		$("#viewbook").bind("pagebeforeshow", function(event, ui){
			self._welViewBookContent.empty();
			self._showBook();
		});
		$("#viewbook").bind("pageshow", function(event, ui){
			console.log('viewbook pageshow');
		});	
	},
	
	_initClickEvent : function() {
		// this._welMainList.delegate('click')
		// $("#main-list").bind("click", function(event, ui){
			// console.log(event);
		// });
		var self = this;
		jindo.$Element("main-list").delegate("click",  
		    ".main-list-book",             // 필터  
		    function(eEvent){   // 콜백 함수  
		    	eEvent.stopDefault();
		    	self._nMainListBookIdx = jindo.$Element(eEvent.element).attr('id').replace('main-list-book-idx_', '');
		    	$.mobile.changePage("#viewbook");
		        //alert("main-list-book 클래스를 가진 li가 클릭 될 때 실행");  
		    }
		);  
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
	},
	
	_refreshViewBook : function(){
		//(this._welViewBook.$value()).controlgroup('refresh');
	},
	
	_showBook : function(){
		var self = this;
		if(!this._nMainListBookIdx){
			alert("도서가 선택되지 않았습니다.");
			history.back();
			return false;
		}
		this._woDB.loadBook(function(tx, results){
			if(results.rows.length > 0){
				var el = jindo.$(self._wtViewBookDetail.process(results.rows.item(0)));
				self._welViewBookContent.append(el);
				self._refreshViewBook();
			}
		}, this._nMainListBookIdx);
	}
});