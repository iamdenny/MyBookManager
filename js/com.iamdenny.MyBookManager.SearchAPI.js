com.iamdenny.MyBookManager.SearchAPI = jindo.$Class({
	
	_woDB : null,
    _woConfig : null,
	_woNaverAPI : null,
	_woGoogleAPI : null,
	_ahtData : null,
	_welTargetBook : null,
	
	$init : function(woDB, woConfig){
		this._woDB = woDB;
        this._woConfig = woConfig;
		
		this._welAddBook = jindo.$Element('addbook');
		this._welAddBookSearchInput = jindo.$Element('addbook-search-input');
		this._welAddBookList = jindo.$Element('addbook-list');
		
		this._welAddBookDialog = jindo.$Element('addbookdialog');
		this._welAddBookDialogContent = jindo.$Element('addbookdialog-content');
		
		this._wtAddBookListBook = jindo.$Template('tpl-addbook-list-book');
		this._wtAddBookDialogBook = jindo.$Template('tpl-addbookdialog-book');		
		
		this._woNaverAPI = new com.iamdenny.MyBookManager.SearchAPI.Naver();
		
		this._initEvent();
		this._initPageShowEvent();	
	},
	
	_initEvent : function(){
		var self = this;
		$(this._welAddBookSearchInput.$value()).keyup(function(eEvent){
			self._getRSS($(this).val());			 	
		});
		 
		this._welAddBookList.delegate('click', '.addbook-list-book',
			function(eEvent){
				self._welTargetBook = jindo.$Element(eEvent.element);
				self._loadBookForDialog();
				$.mobile.changePage("#addbookdialog");				
			}
		);
	},
	
	_initPageShowEvent : function(){
		$("#addbookdialog").bind("pagebeforeshow", function(event, ui){
			$.mobile.showPageLoadingMsg();
			$('#addbookdialog-addbook-btn').button();
		}).bind("pageshow", function(event, ui){
		});
	},
	
	_getRSS : function(sText){
		var sQuery = sText
			, nStart = 1
			, nDisplay = 20;
		this._woNaverAPI.getRSS(sQuery, nStart, nDisplay, this, '_callbackRSS');
	},
	
	_callbackRSS : function(ahtData){
		this._ahtData = ahtData;
		this._welAddBookList.empty();
		for(var i=0, length = ahtData.length; i<length; i++){
			var el = jindo.$(this._wtAddBookListBook.process(ahtData[i]));
			this._welAddBookList.append(el);
		}
		this._refreshAddBookListView();
	},
	
	_refreshAddBookListView : function(){
		$(this._welAddBookList.$value()).listview('refresh');
	},
	
	_loadBookForDialog : function(){
		var nIdx = this._welTargetBook.attr('id').replace('addbook-list-book_', '');
		var el = jindo.$(this._wtAddBookDialogBook.process(this._ahtData[nIdx]));
		this._welAddBookDialogContent.empty();
		this._welAddBookDialogContent.append(el);
	}
	
});
