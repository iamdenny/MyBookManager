com.iamdenny.MyBookManager.Book = jindo.$Class({
	
	_woDB : null,
	_nMainListBookIdx : null,
	_htData : null,
	_wtViewBookDetail : null,
	_welViewBookContent : null,
	
	$init : function(woDB){
		this._woDB = woDB;
		
		this._welViewBookContent = jindo.$Element('viewbook-content');
		
		this._initTemplates();
		this._initPageShowEvent();
	},
	
	_initTemplates : function(){
		this._wtViewBookDetail = jindo.$Template('tpl-viewbook-detail');
	},

	_initPageShowEvent : function(){
		var self = this;
		$("#viewbook").bind("pagebeforeshow", function(event, ui){
			$.mobile.showPageLoadingMsg("b", "Loading...", true);
			console.log('viewbook pagebeforeshow');
		});
		$("#viewbook").bind("pageshow", function(event, ui){
			console.log('viewbook pageshow');
		});	
	},
	
	loadBook : function(nMainListBookIdx){
		var self = this;
		
		this._nMainListBookIdx = nMainListBookIdx;
		this._welViewBookContent.empty();
		this._woDB.loadBook(function(tx, results){
			if(results.rows.length > 0){
				self._htData = self._parseRowData(results.rows.item(0));
				var el = jindo.$(self._wtViewBookDetail.process(self._htData));
				self._welViewBookContent.append(el);
				self._refreshViewBook();
			}
		}, this._nMainListBookIdx);
	},
	
	_parseRowData : function(htData){
		htData['p_category_' + htData.db_category] = 'checked="checked"';
		htData['p_favorite_' + htData.db_favorite] = 'selected="selected"';
		return htData;
	},
	
	_refreshViewBook : function(){
		var self = this
			, elRoot = this._welViewBookContent.$value();
			
		$("input[type='radio']", elRoot).checkboxradio();
		$("input[type='radio']", elRoot).click(function(){
			self._updateCategory($(this).val());
			//console.log(self._nMainListBookIdx + " : " + $(this).val());
		});
		$('.categorygroup', elRoot).controlgroup();
		$('#db_favorite', elRoot).slider();
		$('#db_favorite', elRoot).change(function(){
			self._updateFavorite($(this).val());
		});
		$('.db_price', elRoot).parseNumber({format:"#,###원", locale:"kr"});
		$('.db_price', elRoot).formatNumber({format:"#,###원", locale:"kr"});
		$('.db_discounted_price', elRoot).formatNumber({format:"#,###", locale:"kr"});
		$('#viewbook-description', elRoot).collapsible({ mini: "true", theme : "c" , collapsed : false});
	},
	
	_updateCategory : function(sCategory){
		this._woDB.updateCategory(this._nMainListBookIdx, sCategory);
	},
	
	_updateFavorite : function(sFavorite){
		this._woDB.updateFavorite(this._nMainListBookIdx, sFavorite);
	}
});