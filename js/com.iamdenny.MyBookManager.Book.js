com.iamdenny.MyBookManager.Book = jindo.$Class({
	
	_woDB : null,
	_nMainListBookIdx : null,
	_htData : null,
	_wtViewBookDetail : null,
	_welViewBookContent : null,
	_sMainListBookCategory : null,
	
	$init : function(woDB){
		this._woDB = woDB;
		
		this._welViewBook = jindo.$Element('viewbook');
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
		}).bind("pageshow", function(event, ui){
		});	
	},
	
	loadBook : function(nMainListBookIdx, sMainListBookCategory){
		var self = this;
		
		this._nMainListBookIdx = nMainListBookIdx;
		this._sMainListBookCategory = sMainListBookCategory;
		var sCategory = this.parseCategoryToString(this._sMainListBookCategory);
		this.setTitle(sCategory);
		this._welViewBookContent.empty();
		this._woDB.loadBook(function(tx, results){
			if(results.rows.length > 0){
				self._htData = self.parseRowData(results.rows.item(0));
				var el = jindo.$(self._wtViewBookDetail.process(self._htData));
				self._welViewBookContent.append(el);
				self._refreshViewBook();
			}
		}, this._nMainListBookIdx);
	},
	
	setTitle : function(sTitle){
		$('header h1', this._welViewBook.$value()).text(sTitle);
	},
	
	parseCategoryToString : function(sMainListBookCategory){
		var sString = '';
		switch(sMainListBookCategory){
			case 'isreading':
				sString = '현재 읽고 있는 도서';
				break;
			case 'favorite':
				sString = '즐겨찾는 도서';
				break;
			case 'willread':
				sString = '앞으로 읽을 도서';
				break;
			case 'hasread':
				sString = '다 읽은 도서';
				break;
			default :
				sString = '전체 도서';
				break;
		}
		return sString;
	},
	
	parseRowData : function(htData){
		htData['p_category_' + htData.db_category] = 'checked="checked"';
		htData['p_favorite_' + htData.db_favorite] = 'selected="selected"';
		var oDate = Date.parse(htData.db_upd);
		if(oDate.toString('yyyyMd') == Date.today().toString('yyyyMd')){
			htData['p_upd'] = oDate.toString('H:m');
		}else if(oDate.toString('yyyy') == Date.today().toString('yyyy')){
			htData['p_upd'] = oDate.toString('M.d');	
		}else{
			htData['p_upd'] = oDate.toString('yy.M.d');
		}
		 
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
		this.fireEvent('updated');
	},
	
	_updateFavorite : function(sFavorite){
		this._woDB.updateFavorite(this._nMainListBookIdx, sFavorite);
		this.fireEvent('updated');
	}
}).extend(jindo.Component);