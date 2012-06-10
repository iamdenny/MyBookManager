com.iamdenny.MyBookManager.List = jindo.$Class({
	
	_woDB : null,
    _woConfig : null,
	_woBook : null,
	_wtMainListDivider : null,
	_wtViewBook : null,
	_nMainListIsReadingLimit : null,
	_nMainListFavoriteLimit : null,
	_nMainListBookIdx : null,
	
	$init : function(woDB, woConfig, woBook){
		var self = this;
		
		this._woDB = woDB;	
        this._woConfig = woConfig;
        this._woConfig.attach('pagebeforehide', function(){
			self.showList();
		});
		this._woBook = woBook;
		this._woBook.attach('updated', function(){
			self.showList();
		});
			
		this._welMain = jindo.$Element('main');
		this._welMainList = jindo.$Element('main-list');
        //this._oIScrollMain = new iScroll('scroller-main', { hScrollbar: false, vScrollbar: true, bounce : true });
		
		this._welViewList = jindo.$Element('viewlist');
		this._welViewListList = jindo.$Element('viewlist-list');
		
		this._initTemplates();
		this._initPageShowEvent();
		this._initClickEvent();
	},
	
	_initTemplates : function(){
		this._wtMainListDivider = jindo.$Template('tpl-main-list-divider');
		this._wtMainListBook = jindo.$Template('tpl-main-list-book');	
		this._wtViewListListBook = jindo.$Template('tpl-viewlist-list-book');
	},
	
	_initPageShowEvent : function(){
		var self = this;
		$("#main").bind("pagebeforeshow", function(event, ui){
			$.mobile.showPageLoadingMsg("b", "Loading...", true);
		}).bind("pageshow", function(event, ui){
		});
		
		$("#viewlist").bind("pagebeforeshow", function(event, ui){
			$.mobile.showPageLoadingMsg("b", "Loading...", true);
			self._welViewListList.empty();
			self.setTitle(self._welViewList, self._sMainListBookCategory);
			self.showListByCategory(self._sMainListBookCategory);
		}).bind("pageshow", function(event, ui){
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
                    self._woBook.setMainListBookId(self._nMainListBookIdx);
                    self._woBook.setMainListBookCategory(self._sMainListBookCategory);
			    	$.mobile.changePage("#viewbook");
			    }
		    }
		).delegate('click', '.main-list-divider', 
			function(eEvent){
				eEvent.stopDefault();
				self._sMainListBookCategory = self._parseDividerToCategory(jindo.$Element(eEvent.element));
				if(!self._sMainListBookCategory){
					alert('카테고리가 선택되지 않았습니다.');
					return false;
				}else{
					$.mobile.changePage("#viewlist");
				}
			}
		);  
		
		jindo.$Element("viewlist-list").delegate("click", ".viewlist-list-book", 
			function(eEvent){
				eEvent.stopDefault();
		    	self._nMainListBookIdx = jindo.$Element(eEvent.element).attr('id').replace('viewlist-list-book-idx_', '');
		    	if(!self._nMainListBookIdx){
					alert("도서가 선택되지 않았습니다.");
					return false;
				}else{
                    console.log(self._woBook);
                    self._woBook.setMainListBookId(self._nMainListBookIdx);
    	            self._woBook.setMainListBookCategory(self._sMainListBookCategory);
                    
			    	$.mobile.changePage("#viewbook");
			    }
			}
		);
		
		jindo.$Element("go_to_viewlist").delegate("click", '',
			function(eEvent){
				eEvent.stopDefault();
				self._sMainListBookCategory = 'all';
				$.mobile.changePage("#viewlist");
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
		var self = this,
            htConfigMain = this._woConfig.get('main'),
		    nIsReadingCount = htConfigMain.isreading_count,
		    nFavoriteCount = htConfigMain.favorite_count,
            nWillReadCount = htConfigMain.willread_count,
            nHasReadCount = htConfigMain.hasread_count;
        
        this._welMainList.empty();
		this._woDB.loadList(function(tx, results){
			var sPClass = 'main-list-divider_isreading';
			var el = jindo.$(self._wtMainListDivider.process({title : '현재 읽고 있는 도서', p_class : sPClass}));
			self._welMainList.append(el);
				
			self._appendTheResultWithTemplate(self._welMainList, self._wtMainListBook, sPClass, results);

			self._refreshMainListView();
			fFavorite();
		}, 'isreading', 'db_upd', 'DESC', nIsReadingCount);
		
		var fFavorite = function(){
			self._woDB.loadFavoriteList(function(tx, results){
				var sPClass = 'main-list-divider_favorite';
				var el = jindo.$(self._wtMainListDivider.process({title : '즐겨찾는 도서', p_class : sPClass}));
				self._welMainList.append(el);
				
				self._appendTheResultWithTemplate(self._welMainList, self._wtMainListBook, sPClass, results);
				
				self._refreshMainListView();
				fWillRead();
			}, 'db_upd', 'DESC', nFavoriteCount);
		};
		
		var fWillRead = function(){
			self._woDB.loadList(function(tx, results){
				var sPClass = 'main-list-divider_willread';
				var el = jindo.$(self._wtMainListDivider.process({title : '앞으로 읽을 도서', p_class : sPClass}));
				self._welMainList.append(el);
				
				self._appendTheResultWithTemplate(self._welMainList, self._wtMainListBook, sPClass, results);
				
				self._refreshMainListView();
				fHasRead();
			}, 'willread', 'db_upd', 'DESC', nWillReadCount);
		};
		
		var fHasRead = function(){
			self._woDB.loadList(function(tx, results){
				var sPClass = 'main-list-divider_hasread';
				var el = jindo.$(self._wtMainListDivider.process({title : '다 읽은 도서', p_class : sPClass}));
				self._welMainList.append(el);
					
				self._appendTheResultWithTemplate(self._welMainList, self._wtMainListBook, sPClass, results);
				
				self._refreshMainListView();
				
				self._showCountForMainList();
			}, 'hasread', 'db_upd', 'DESC', nHasReadCount);
		};
	},
	
	_showCountForMainList : function(){
		var self = this;
		this._woDB.getCount(function(tx, results){
			$('.main-list-divider_isreading .ui-li-count', self._welMainList.$value()).text(results.rows.item(0).count);
		}, 'isreading');
		this._woDB.getCount(function(tx, results){
			$('.main-list-divider_favorite .ui-li-count', self._welMainList.$value()).text(results.rows.item(0).count);
		}, 'favorite');
		this._woDB.getCount(function(tx, results){
			$('.main-list-divider_willread .ui-li-count', self._welMainList.$value()).text(results.rows.item(0).count);
		}, 'willread');
		this._woDB.getCount(function(tx, results){
			$('.main-list-divider_hasread .ui-li-count', self._welMainList.$value()).text(results.rows.item(0).count);
		}, 'hasread');
	},
	
	_appendTheResultWithTemplate : function(welList, wtListBook, sPClass, results){
		for (var i = 0, len = results.rows.length; i < len; i++){
			var htData = this.parseRowData(results.rows.item(i));
			htData.p_class = sPClass;
			htData.p_filtertext = htData.db_title + ',' + htData.db_author + ',' + htData.price + ',' + htData.publisher + ',' + htData.db_isbn + ',' + htData.db_description;
			var el = jindo.$(wtListBook.process(htData));
			welList.append(el);
		}
	},
	
	showListByCategory : function(sCategory){
		var self = this;
		var sPClass = 'viewlist-list-divider_' + sCategory;
		if(sCategory == 'favorite'){
			this._woDB.loadFavoriteList(function(tx, results){
				self._appendTheResultWithTemplate(self._welViewListList, self._wtViewListListBook, sPClass, results);
				self._refreshViewListListView();
			}, 'db_upd', 'DESC', null);	
		}else{
			this._woDB.loadList(function(tx, results){
				self._appendTheResultWithTemplate(self._welViewListList, self._wtViewListListBook, sPClass, results);
				self._refreshViewListListView();
			}, sCategory, 'db_upd', 'DESC', null);
		}
	},
		
	_refreshMainListView : function(){
		$(this._welMainList.$value()).listview('refresh');
	},
	
	_refreshViewListListView : function(){
		$(this._welViewListList.$value()).listview('refresh');
	},
	
	setTitle : function(welSection, sCategory){
		var sTitle = this.parseCategoryToString(sCategory);
		$('header h1', welSection.$value()).text(sTitle);
	},
	
	parseCategoryToString : function(sCategory){
		return this._woBook.parseCategoryToString(sCategory);	
	}
	
});