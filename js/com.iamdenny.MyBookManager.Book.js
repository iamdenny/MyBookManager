com.iamdenny.MyBookManager.Book = jindo.$Class({
	
	_woDB : null,
	_nMainListBookIdx : null,
    _sMainListBookCategory : null,
	_htData : null,
	_wtViewBookDetail : null,
	_welViewBookContent : null,
    _bDeviceReady : null, 
	
	$init : function(woDB){
		this._woDB = woDB;
		
		this._welViewBook = jindo.$Element('viewbook');
		this._welViewBookContent = jindo.$Element('viewbook-content');
        
		this._initTemplates();
		this._initPageShowEvent();
        this._initClickEvent();
        this._initPhonegap();
	},
    
    _initPhonegap : function(){
        var self = this;
        self._bDeviceReady = false;
        document.addEventListener("deviceready", function(){
            self._bDeviceReady = true;
        });
    },
	
	_initTemplates : function(){
		this._wtViewBookDetail = jindo.$Template('tpl-viewbook-detail');
	},

	_initPageShowEvent : function(){
		var self = this;
    	
		$("#viewbook").bind("pagebeforeshow", function(event, ui){
			$.mobile.showPageLoadingMsg("b", "Loading...", true);
            self.loadBook();
		}).bind("pageshow", function(event, ui){
		});
        
        $("#viewbookaddcomment").bind("pagebeforeshow", function(event, ui){
            $('#viewbookaddcomment-textarea').val('');
        }).bind("pageshow", function(event, ui){
    	});
	},
    
    _initClickEvent : function() {
        var self = this;
        $("#viewbookaddcomment-btn").on('click', function(eEvent){
            var sComment = $('#viewbookaddcomment-textarea').val();
            self._woDB.addComment(self._nMainListBookIdx, sComment, function(){
                $('#viewbookaddcomment').dialog('close');            
            });            
        });
        
        $('#_insertPhoto').on('click', function(eEvent){
            if(self._bDeviceReady){
                var oCamera = navigator.camera;
                oCamera.getPicture(function(sDataUrl){
        			self._putDataUrl(sDataUrl);
    			}, function(message){
    				alert(message);
    			}, { 
                    quality : 50, 
    		    	destinationType : oCamera.DestinationType.DATA_URL,
    		    	sourceType : oCamera.PictureSourceType.CAMERA,
                    allowEdit : false,
                    encodingType : oCamera.EncodingType.PNG,
    		    	mediaType : oCamera.MediaType.PICTURE,
                    correctOrientation : true,
                    saveToPhotoAlbum : false
                    }
                );
            }else{
                alert('폰갭 모듈이 로드 되지 않았습니다.');   
            }
        });
    },
    _putDataUrl : function(sDataUrl){
        alert('_putDataUrl');
    },
    
    setMainListBookId : function(nMainListBookIdx){
        this._nMainListBookIdx = nMainListBookIdx;  
    },
    
    setMainListBookCategory : function(sMainListBookCategory){
        this._sMainListBookCategory = sMainListBookCategory;  
    },
	
	loadBook : function(){
		var self = this;
		var sCategory = this.parseCategoryToString(this._sMainListBookCategory);
		this.setTitle(sCategory);
		this._welViewBookContent.empty();
		this._woDB.loadBook(this._nMainListBookIdx, function(results){
			if(results.rows.length > 0){
				self._htData = self.parseRowData(results.rows.item(0));
                self._htData.comments = self.parseComments(results.innerResults);
                self._htData.comments.length = results.innerResults.rows.length;
				var el = jindo.$(self._wtViewBookDetail.process(self._htData));
				self._welViewBookContent.append(el);
				self._refreshViewBook();
			}
		});
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
    
    parseComments : function(oResult){
        var nCount = oResult.rows.length;
        var htData = [];
        for(var i=0; i<nCount; i++){
            htData[i] = oResult.rows.item(i);
            var oDate = Date.parse(htData[i].dbc_upd);
            if(oDate.toString('yyyyMd') == Date.today().toString('yyyyMd')){
        		htData[i]['p_upd'] = oDate.toString('H:m');
    		}else if(oDate.toString('yyyy') == Date.today().toString('yyyy')){
    			htData[i]['p_upd'] = oDate.toString('M.d');	
    		}else{
    			htData[i]['p_upd'] = oDate.toString('yy.M.d');
    		}
        }
        return htData;
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
		$('.viewbook-collapsible', elRoot).collapsible({ mini: "true", theme : "c" , collapsed : false});
        $('.viewbook-listview', elRoot).listview();
	},
	
	_updateCategory : function(sCategory){
		this._woDB.updateCategory(this._nMainListBookIdx, sCategory);
		this.fireEvent('updated');
	},
	
	_updateFavorite : function(sFavorite){
		this._woDB.updateFavorite(this._nMainListBookIdx, sFavorite);
		this.fireEvent('updated');
	},
    
    addBook : function(htData){
        console.log(htData);
        this._woDB.addBook(htData, jindo.$Fn(this._cbAddBookSuccess, this).bind());
    },
    
    _cbAddBookSuccess : function(){
        this.fireEvent('updated');
    }
}).extend(jindo.Component);