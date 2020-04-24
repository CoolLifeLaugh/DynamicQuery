/**
 * 通用Select下拉选择框
 */
define(['app'], function (app) {
    /**
     * 从服务器，获取下拉选择框所以内容列表
     */
    app.service('pluginNgGridCVSExport', ['QHttp', '$cacheFactory', function (QHttp, $cacheFactory) {
    	var self = this;
	    self.grid = null;
	    self.scope = null;
	    self.init = function (scope, grid, services) {
	        self.grid = grid;
	        self.scope = scope;
	        function showCVSExportDownloadLink() {
	            var keyCollections = [];
	            for (var grd in grid.config.columnDefs) {
	                keyCollections.push(grid.config.columnDefs[grd].field);
	            }
	            var csvFileDatas = '';
	            function StringifyCSVData(strKey) {
	                if (!strKey || strKey == null) { // we want to catch anything null-ish, hence just == not ===
	                    return '';
	                }
	                if (typeof (strKey) === 'number') {
	                    return '' + strKey;
	                }
	                if (typeof (strKey) === 'boolean') {
	                    return (strKey ? 'TRUE' : 'FALSE');
	                }
	                if (typeof (strKey) === 'string') {
	                    return strKey.replace(/"/g, '""').replace(',', '，');
	                }
	                return ""//JSON.stringify(strKey).replace(/"/g, '""');
	            }
	            function swapLastCommaForNewline(strKey) {
	                var newStr = strKey.substr(0, strKey.length - 1);
	                return newStr + "\n";
	            }
	            for (var k in keyCollections) {
	            	if (keyCollections[k]) {
	            		csvFileDatas += '"' + StringifyCSVData(keyCollections[k]) + '",';
	            	}
	            }
	            csvFileDatas = swapLastCommaForNewline(csvFileDatas);
	            var getGridData = grid.data;
	            for (var gridRow in getGridData) {
	                for (k in keyCollections) {
	                    var currentReowCell;
	                   /* if (options != null && options.columnOverrides != null && options.columnOverrides[keyCollections[k]] != null) {
	                        currentReowCell = options.columnOverrides[keyCollections[k]](getGridData[gridRow][keyCollections[k]]);
	                    } else {*/
	                        currentReowCell = getGridData[gridRow][keyCollections[k]];
//	                    }
	                    if (keyCollections[k]) {
		            		csvFileDatas += '"' + StringifyCSVData(currentReowCell) + '",';
	                    }
	                }
	                csvFileDatas = swapLastCommaForNewline(csvFileDatas);
	            }
	            var footerPanel = $(".btn-group");
	            var csvFooterPanelLink = $('.btn-primary');
	            if (csvFooterPanelLink != null) {
	                csvFooterPanelLink.remove();
	            }
	            var csvHTMLTemplateLink = "<a class=\"btn btn-xs btn-primary btn-editable\" href=\"data:text/csv;charset=GBK,";
	            csvHTMLTemplateLink += encodeURIComponent(csvFileDatas);
	            csvHTMLTemplateLink += "\" download=\"Export-from-Grid.csv\"> <i class='icon-share-alt'></i>导出</a>";
	            footerPanel.append(csvHTMLTemplateLink);
	        }
	        setTimeout(showCVSExportDownloadLink, 0);
	        scope.cvsRenderRowsKeys = function () {
	            var hashVal = '';
	            for (var index in scope.RowsIndex) {
	                hashVal += scope.RowsIndex[index].$$hashKey;
	            }
	            return hashVal;
	        };
	        scope.$watch('cvsRenderRowsKeys()', showCVSExportDownloadLink);
	    };
        
    }]);
});