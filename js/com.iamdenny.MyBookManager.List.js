com.iamdenny.MyBookManager.List = jindo.$Class({
	
	_woDB : null,
	_woBook : null,
	_wtMainListDivider : null,
	_wtViewBook : null,
	_nMainListIsReadingLimit : null,
	_nMainListFavoriteLimit : null,
	_nMainListBookIdx : null,
	
	$init : function(woDB){
		this._woDB = woDB;	
		this._woBook = new com.iamdenny.MyBookManager.Book(this._woDB);
			
		this._welMain = jindo.$Element('main');
		this._welMainList = jindo.$Element('main-list');
		
		this._nMainListIsReadingLimit = 3;
		this._nMainListFavoriteLimit = 3;
		
		this._initTemplates();
		this._initPageShowEvent();
		this._initClickEvent();
	},
	
	_initTemplates : function(){
		this._wtMainListDivider = jindo.$Template('tpl-main-list-divider');
		this._wtMainListBook = jindo.$Template('tpl-main-list-book');	
	},
	
	_initPageShowEvent : function(){
		var self = this;
		$("#main").bind("pagebeforeshow", function(event, ui){
			$.mobile.showPageLoadingMsg("b", "Loading...", true);
			console.log('main pagebeforeshow');
			self._welMainList.empty();
			self.showList();
		});
		$("#main").bind("pageshow", function(event, ui){
			console.log('main pageshow');
		});	
	},
	
	_initClickEvent : function() {
		// this._welMainList.delegate('click')
		// $("#main-list").bind("click", function(event, ui){
			// console.log(event);
		// });
		var self = this;
		jindo.$Element("main-list").delegate("click", ".main-list-book", 
			function(eEvent){   // 콜백 함수  
		    	eEvent.stopDefault();
		    	self._nMainListBookIdx = jindo.$Element(eEvent.element).attr('id').replace('main-list-book-idx_', '');
		    	self._sMainListBookCategory = self._parseDividerToCategory(jindo.$Element(eEvent.element));
		    	if(!self._nMainListBookIdx){
					alert("도서가 선택되지 않았습니다.");
					return false;
				}else{
					self._woBook.loadBook(self._nMainListBookIdx, self._sMainListBookCategory);
			    	$.mobile.changePage("#viewbook");
			    }
		    }
		).delegate('click', '.main-list-divider', 
			function(eEvent){
				eEvent.stopDefault();
				self._sMainListBookCategory = self._parseDividerToCategory(jindo.$Element(eEvent.element));
				console.log((eEvent.element))
				if(!self._sMainListBookCategory){
					alert('카테고리가 선택되지 않았습니다.');
					return false;
				}else{
					self.showListByCategory(self._sMainListBookCategory);
					$.mobile.changePage("#viewlist");
				}
			}
		);  
	},
	
	_parseDividerToCategory : function(welTarget){
		var sCategory = null;
		if(welTarget.hasClass('main-list-divider_isreading')){
			sCategory = 'isreading';
		}else if(welTarget.hasClass('main-list-divider_favorite')){
			sCategory = 'favorite';
		}else if(welTarget.hasClass('main-list-divider_willread')){
			sCategory = 'willread';
		}else if(welTarget.hasClass('main-list-divider_hasread')){
			sCategory = 'hasread';
		}
		return sCategory;
	},
	
	parseRowData : function(htData){
		htData = this._woBook.parseRowData(htData);
		return htData;
	},
	
	setTitle : function(sTitle){
		$('header h1', this.welMain.$value()).text(sTitle);
	},
	
	showList : function(){
		var self = this;
		
		this._woDB.loadList(function(tx, results){
			var sPClass = 'main-list-divider_isreading';
			var el = jindo.$(self._wtMainListDivider.process({title : '현재 읽고 있는 도서', p_class : sPClass}));
			self._welMainList.append(el);
				
			for (var i = 0, len = results.rows.length; i < len; i++){
				var htData = self.parseRowData(results.rows.item(i));
				htData.p_class = sPClass;
				var el = jindo.$(self._wtMainListBook.process(htData));
				self._welMainList.append(el);
			}
			
			self._refreshListView();
			fFavorite();
		}, 'isreading', null, null, self._nMainListIsReadingLimit);
		
		var fFavorite = function(){
			self._woDB.loadFavoriteList(function(tx, results){
				var sPClass = 'main-list-divider_favorite';
				var el = jindo.$(self._wtMainListDivider.process({title : '즐겨찾는 도서', p_class : sPClass}));
				self._welMainList.append(el);
					
				for (var i = 0, len = results.rows.length; i < len; i++){
					var htData = self.parseRowData(results.rows.item(i));
					htData.p_class = 'main-list-divider_favorite';
					var el = jindo.$(self._wtMainListBook.process(htData));
					self._welMainList.append(el);
				}
				
				self._refreshListView();
				fWillRead();
			}, null, null, self._nMainListFavoriteLimit);
		};
		
		var fWillRead = function(){
			self._woDB.loadList(function(tx, results){
				var sPClass = 'main-list-divider_willread';
				var el = jindo.$(self._wtMainListDivider.process({title : '앞으로 읽을 도서', p_class : sPClass}));
				self._welMainList.append(el);
					
				for (var i = 0, len = results.rows.length; i < len; i++){
					var htData = self.parseRowData(results.rows.item(i));
					htData.p_class = sPClass;
					var el = jindo.$(self._wtMainListBook.process(htData));
					self._welMainList.append(el);
				}
				
				self._refreshListView();
				fHasRead();
			}, 'willread', null, null, self._nMainListFavoriteLimit);
		};
		
		var fHasRead = function(){
			self._woDB.loadList(function(tx, results){
				var sPClass = 'main-list-divider_hasread';
				var el = jindo.$(self._wtMainListDivider.process({title : '다 읽은 도서', p_class : sPClass}));
				self._welMainList.append(el);
					
				for (var i = 0, len = results.rows.length; i < len; i++){
					var htData = self.parseRowData(results.rows.item(i));
					htData.p_class = sPClass;
					var el = jindo.$(self._wtMainListBook.process(htData));
					self._welMainList.append(el);
				}
				
				self._refreshListView();
			}, 'hasread', null, null, self._nMainListFavoriteLimit);
		};
		
	},
	
	showListByCategory : function(sCategory){
		
	},
		
	_refreshListView : function(){
		$(this._welMainList.$value()).listview('refresh');
	}
	
});