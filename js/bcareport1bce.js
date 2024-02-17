var ReportStandard = (function () {
	// _ (underscore) variable for function
	// $ (dollar) variable for selector
	var resultList,
		resultPage, dsid;

	var filterArr = [], checkboxArr = [];

	var _checkboxHeader = function () {
		var $repotStandardWrapper = $('.report-standard-wrapper');

		var $table = $repotStandardWrapper.find('table.tblReport');
		var $thead = $table.find('thead');
		var $checkboxHeader = $thead.find('input[type="checkbox"]');

		$checkboxHeader.on('change', function () {
			//console.log('checkactive all');
			checkboxArr = [];
			var $this = $(this),
				_value = $this.is(':checked'),
				_type = 'all';

			checkActive(_value, _type, $this);
			var $tbody = $this.closest('table').find('tbody');
			var $checkboxBody = $tbody.find('input[type="checkbox"]:not(:disabled)');

			$checkboxBody.each(function (index) {
				var $this = $(this),
					_value = $this.is(':checked'),
					_type = 'all';

				checkActive(_value, _type, $this);

				var dataValue = {};
				if (_value) {
					dataValue = {
						ID: "{" + $this.attr('item-id') + "}",
						Title: $this.val(),
						File: $this.attr('data-file'),
						Size: $this.attr('data-size')
					}
					checkboxArr.push(dataValue);
				}
				else {
					checkboxArr.splice($.inArray(dataValue, checkboxArr), 1);
				}
				console.log(checkboxArr, "head");
			})

		});
	};

	var _checkboxBody = function () {
		var $repotStandardWrapper = $('.report-standard-wrapper');
		var $table = $repotStandardWrapper.find('table.tblReport');
		var $tbody = $table.find('tbody');
		var $checkboxBody = $tbody.find('input[type="checkbox"]');

		$checkboxBody.on('change', function () {
			var $this = $(this),
				_value = $this.is(':checked'),
				_type = 'one';

			checkActive(_value, _type, $this);

			var dataValue = {};
			if (_value) {
				dataValue = {
					ID: "{" + $this.attr('item-id') + "}",
					Title: $this.val(),
					File: $this.attr('data-file'),
					Size: $this.attr('data-size')
				}
				checkboxArr.push(dataValue);
			}
			else {
				checkboxArr.splice($.inArray(dataValue, checkboxArr), 1);
			}

			//console.log(checkboxArr, "body");
		});
	};

	var clearAll = function clearAll() {
		checkboxArr = [];
		var $repotStandardWrapper = $('.report-standard-wrapper');
		var $table = $repotStandardWrapper.find('table.tblReport');
		var $downloadBar = $('.o-bar--download');
		$table.find('input').prop('checked', false);
		$downloadBar.removeClass('is-active');
	};

	var checkActive = function checkActive(value, type, $selector) {
		var $parent = $selector.parents('table').find('tbody'),
			$table = $selector.parents('table').find('thead'),
			$checkHeader = $table.find('input[type="checkbox"]'),
			$checkboxAll = $parent.find('input[type="checkbox"]:not(:disabled)'),
			$checkboxBodyAll = $parent.find('input[type="checkbox"]:not(:disabled)'),
			$downloadBar = $('.o-bar--download'),
			_dataValue = [];

		$checkboxAll.each(function () {
			var $this = $(this),
				_value = $this.is(':checked');

			_dataValue.push(_value);
		});

		//var checkAllTrue;
		//checkAllTrue = _dataValue.every(function (val, i, arr) {
		//	return val === arr[0];
		//}); // check all checkbox is checked

		//if (type == "all") {
		//	checkAllTrue = true;
		//}

		////console.log(checkAllTrue, "checkAllTrue");
		////console.log(_dataValue, "_dataValue");

		//if (checkAllTrue) {
		//	type = "all";
		//	$checkHeader.prop('checked', true);
		//} else {
		//	type = "one";
		//	$checkHeader.prop('checked', false);
		//} // if checkbox header is checked or not


		if (value) {
			$selector.prop('checked', true);

			if (type == 'all') {
				$checkboxBodyAll.prop('checked', true);
			}

			if (!$downloadBar.hasClass('is-active')) {
				$downloadBar.addClass('is-active');
			}
		} else {
			if (type == 'all') {
				clearAll();
			} else {
				$selector.prop('checked', false);

				if (!_dataValue.includes(true)) {
					clearAll();
				}
			}
		}

		_downloadBar(value, type, $selector);
	};

	var _downloadBar = function (value, type, $selector) {
		var $downloadBar = $('.o-bar--download');
		var $parent = $selector.parents('table').find('tbody'),
			$checkboxAll = $parent.find('input[type="checkbox"]'),
			_dataValue = [],
			$totalFile = $downloadBar.find('*[data-totalFile]'),
			_totalFile = 0,
			_totalFileText = $totalFile.attr('data-copy'),
			$totalSize = $downloadBar.find('*[data-totalSize]'),
			_totalSize = 0,
			_copyByte = 'KB';
		//console.log("value: " + value + ", type: " + type);

		$checkboxAll.each(function () {
			var $this = $(this),
				_value = $this.is(':checked');

			_dataValue.push(_value);

			if (_value) {
				_totalSize = _totalSize + parseInt($this.attr('data-size'));
				_totalFile = _totalFile + 1;
			}
		});

		if (_totalSize > 1023999) {
			_totalSize = _totalSize / 1024000;
			_copyByte = 'MB';
		}
		else if (_totalSize > 1023) {
			_totalSize = _totalSize / 1024;
			_copyByte = 'KB';
		}
		else {
			_totalSize = _totalSize;
			_copyByte = 'B';
		}

		$totalFile.find('h3').text(_totalFile + ' ' + _totalFileText);
		$totalSize.find('h3').text(Math.round(_totalSize) + ' ' + _copyByte);
	};

	var _downloadFile = function () {
		var $downloadBar = $('.o-bar--download');
		var $btnDownload = $downloadBar.find('.JS-report-download');
		var $btnClear = $downloadBar.find('.JS-report-clear');
		var arrFile = [];
		var objFile = {};

		$btnDownload.click(function () {
			var $this = $(this);
			var $tabPane = $this.closest('body').find('.tab-pane.is-active');
			var $titleHeader = $tabPane.find('.title-header');
			var title = $titleHeader.find('.a-text-title.page-title').text().toLowerCase().trim().replace(" ", "-");
			var zip = new JSZip();
			var count = 0;

			function formatAMPM(date) {
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var ampm = hours >= 12 ? 'pm' : 'am';
				hours = hours % 12;
				hours = hours ? hours : 12; // the hour '0' should be '12'
				minutes = minutes < 10 ? '0' + minutes : minutes;
				var strTime = hours + '.' + minutes + ampm;
				return strTime;
			}

			var d = new Date();
			var date = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
			var time = formatAMPM(d);
			var zipFilename = title + "-" + date + "-" + time + ".zip";


			checkboxArr.forEach(function (url, index) {
				//console.log(url);
				var host = $(location).attr('host');
				//console.log(host + url.File);
				var fileUrl = host + url.File;
				var fileExt = url.File.split(/[#?]/)[0].split('.').pop().trim();
				//var fileName = url.Title.replace(" ", "-") + "." + fileExt;
				var file = url.File.split('/').pop();
				//fileName = file.split('.').slice(0, -1).join('.') +"("+index+ ")." + fileExt;
				var fileName = file.split('.').slice(0, -1).join('.') + "." + fileExt;
				objFile = {
					url: fileUrl,
					filename: file.split('.').slice(0, -1).join('.'),
					ext: fileExt
				}
				arrFile.push(objFile);
			});

			function renameFiles(arr) {
				var count = {};
				var arrRes = [];
				var objRes = {};
				arr.forEach(function (value, i) {
					if (arr.indexOf(value.filename) !== i) {
						var c = value.filename in count ? count[value.filename] = count[value.filename] + 1 : count[value.filename] = 1;
						var j = c;
						var filename = "";
						if (j > 1) {
							filename = value.filename + '(' + j + ').' + value.ext;
						}
						else {
							filename = value.filename + '.' + value.ext;
						}

						while (arr.indexOf(filename) !== -1) filename = value.filename + '(' + (++j) + ').' + value.ext;
						arr[i] = filename;
					}
					objRes = {
						url: value.url,
						filename: arr[i]
					}
					arrRes.push(objRes);
				});
				return arrRes;
			}

			//loading a file and add it in a zip file
			$.each(renameFiles(arrFile), function (index, value) {
				JSZipUtils.getBinaryContent(value.url, function (err, data) {
					if (err) {
						throw err; // or handle the error
					}
					zip.file(value.filename, data, { binary: true });
					count++;
					if (count == checkboxArr.length) {
						zip.generateAsync({ type: 'blob' }).then(function (content) {
							saveAs(content, zipFilename);
						});
					}
				});
			});

		})

		$btnClear.click(function () {
			checkboxArr = [];
			clearAll();
		});
	}

	var _filter = function () {
		var $wrapperReportStandard = $('.report-standard-wrapper');
		var $filterWrapper = $wrapperReportStandard.find('.m-filter__wrapper');
		var $checkboxFilter = $filterWrapper.find('.checkbox-filter');
		var $btnApply = $filterWrapper.find('.JS_filter-apply');
		var $btnReset = $filterWrapper.find('.JS_filter-reset');
		var $backdrop = $filterWrapper.find('.m-filter__backdrop');

		$filterWrapper.find('input').prop('checked', false);

		$checkboxFilter.change(function () {
			var $this = $(this);
			var $thisInput = $this.find("input[type='checkbox']");
			var value = $thisInput.val();
			if ($thisInput.is(':checked')) {
				filterArr.push(value);
			} else {
				filterArr.splice($.inArray(value, filterArr), 1);
			}
		});

		$btnApply.click(function () {
			var $this = $(this);
			var $wrapperReportStandard = $this.closest('.report-standard-wrapper');
			//after click button set to first page
			$wrapperReportStandard.find('.m-pagination').attr('curr-page', 1);
			_retrieveData($this);
		});

		$btnReset.click(function () {
			filterArr = [];
			var $this = $(this);
			var $wrapperReportStandard = $this.closest('.report-standard-wrapper');
			$wrapperReportStandard.find('.m-pagination').attr('curr-page', 1);
			$('html, body').animate({
				scrollTop: $this.closest(".report-standard-wrapper").offset().top
			}, 1000);
			_retrieveData($this);
		});

		$backdrop.click(function () {
			var $this = $(this);
			var $wrapperReportStandard = $this.closest('.report-standard-wrapper');
			//after click button set to first page
			$wrapperReportStandard.find('.m-pagination').attr('curr-page', 1);
			_retrieveData($this);
		});
	};

	var _retrieveData = function ($selector) {
		var $wrapperReportStandard = "", currentPage;

		if ($wrapperReportStandard.length > 1) {
			$wrapperReportStandard = $selector.closest('.report-standard-wrapper');
		} else {
			$wrapperReportStandard = $selector.closest('body').find('.tab-pane.is-active .report-standard-wrapper');
		}

		dsid = $wrapperReportStandard.attr('dsid');

		var strFilter = filterArr.join("|");

		if ($wrapperReportStandard.find('.m-pagination').length) {
			currentPage = $wrapperReportStandard.find('.m-pagination').attr('curr-page');
		} else {
			currentPage = 1;
		}

		var url = '/api/sitecore/Report/GetReportStandardByFilter';
		var params = {
			dsid: dsid,
			year: strFilter,
			currentPage: currentPage
		};

		$.ajax({
			url: url,
			data: params,
			type: "POST",
			success: function (res) {
				//console.log(res);
				var listReport = res.ListReport;
				var totalPage = res.TotalPage;
				var totalResult = res.TotalResultItem;
				var maxItemPerPage = res.MaxItemPerPage;
				_buildHTMLReport($wrapperReportStandard, listReport);
				_checkboxBody();
				clearAll();
				if (totalPage > 0) {
					resultPage = Math.ceil(totalResult / maxItemPerPage);
				} else {
					resultPage = 1;
				}
				_paginationLoad($wrapperReportStandard, totalResult, maxItemPerPage, resultPage, currentPage);
				//console.log("ajax call ------------------------- ");
			},
			error: function (err) {
				//console.log(err);
			}
		});
	};

	var _handleClick = function () {
		var $tabItem = $('.m-tabs-item');
		$tabItem.click(function () {
			filterArr = [];
			checkboxArr = [];

			_checkboxHeader();
			_checkboxBody();
			_downloadFile();

		});
	};

	var _buildHTMLReport = function ($selector, list) {
		var $table = $selector.find('.tblReport');
		var $thead = $table.find('thead');
		var $tbody = $table.find('tbody');
		var html, td1, td2, td3 = "";
		$tbody.empty();
		for (var i = 0; i < list.length; i++) {
			//console.log('Date:'+list[i].Date);
			var fileSizeItem = parseFloat(list[i].Size);
			var fileSizeOnText = "";
			if (fileSizeItem > 1023999) {
				fileSizeOnText = (fileSizeItem / 1024000).toFixed(2) + " MB";
			}
			else if (fileSizeItem > 1023) {
				fileSizeOnText = (fileSizeItem / 1024).toFixed(2) + " KB";
			}
			else {
				fileSizeOnText = parseFloat(list[i].Size) + " B";
			}
			td1 =
				'<td>' +
				'<div class="first-label-side">' +
				'<div class="ico-download i a-system-icon icon-pdf"></div>' +
				'<p class="a-text">' + list[i].Title + '</p>' +
				'<p class="link-file-download d-none">' +
				'<a href="' + list[i].File + '" target="_blank">Lihat</a>' +
				'</p>' +
				'</div>' +
				'</td>';
			td2 =
				'<td>' +
				'<div class="first-label">' +
				'<p class="a-text a-text-brownish-grey pl-0">' + fileSizeOnText + '</p>' +
				'</div>' +
				'</td>';
			if (list[i].File != "#" && fileSizeItem != 0) {
				td3 =
					'<td>' +
					'<div class="checkbox-custom-table ta-right">' +
					'<p class="m-d-none">' +
					'<a href="' + list[i].File + '" target="_blank">Lihat</a>' +
					'</p>' +
					'</div>' +
					'<span class="checkbox-custom checkbox-tbl-body checkbox-report-standard">' +
					'<input type="checkbox" data-date="' + list[i].Date + '" id="dl-' + list[i].ID + '-' + i + '" item-id="' + list[i].ID + '" name="dl-' + list[i].ID + '-' + i + '" value="' + list[i].Title + '" data-file="' + list[i].File + '" data-size="' + list[i].Size + '">' +
					'<label for="dl-' + list[i].ID + '-' + i + '"></label>' +
					'</span>' +
					'</td>';
			}
			else {
				td3 =
					'<td>' +
					'<div class="checkbox-custom-table ta-right disabled">' +
					'<p class="m-d-none">' +
					'<a>Lihat</a>' +
					'</p>' +
					'</div>' +
					'<span class="checkbox-custom checkbox-tbl-body checkbox-report-standard disabled">' +
					'<input disabled type="checkbox" data-date="' + list[i].Date + '" id="dl-' + list[i].ID + '-' + i + '" item-id="' + list[i].ID + '" name="dl-' + list[i].ID + '-' + i + '" value="' + list[i].Title + '" data-file="' + list[i].File + '" data-size="' + list[i].Size + '">' +
					'<label for="dl-' + list[i].ID + '-' + i + '"></label>' +
					'</span>' +
					'</td>';
			}

			html += '<tr>' + td1 + td2 + td3 + '</tr>';

			//html +=
			//	'<tr>' +
			//	'<td>' +
			//	'<div class="first-label-side">' +
			//	'<div class="ico-download i a-system-icon icon-pdf"></div>' +
			//	'<p class="a-text">' + list[i].Title + '</p>' +
			//	'<p class="link-file-download d-none">' +
			//	'<a href="' + list[i].File + '" target="_blank">Lihat</a>' +
			//	'</p>' +
			//	'</div>' +
			//	'</td>' +
			//	'<td>' +
			//	'<div class="first-label">' +
			//	'<p class="a-text a-text-brownish-grey pl-0">' + fileSizeOnText + '</p>' +
			//	'</div>' +
			//	'</td>' +
			//	'<td>' +
			//	'<div class="checkbox-custom-table ta-right">' +
			//	'<p class="m-d-none">' +
			//	'<a href="' + list[i].File + '" target="_blank">Lihat</a>' +
			//	'</p>' +
			//	'</div>' +
			//	'<span class="checkbox-custom checkbox-tbl-body checkbox-report-standard">' +
			//	'<input type="checkbox" data-date="' + list[i].Date + '" id="dl-' + list[i].ID + '-' + i + '" item-id="' + list[i].ID + '" name="dl-' + list[i].ID + '-' + i + '" value="' + list[i].Title + '" data-file="' + list[i].File + '" data-size="' + list[i].Size + '">' +
			//	'<label for="dl-' + list[i].ID + '-' + i + '"></label>' +
			//	'</span>' +
			//	'</td>' +
			//	'</tr>';
		}
		$tbody.append(html);
	};

	var _paginationLoad = function ($selector, totalResult, maxItem, totalPage, currPage) {
		// totalResult for total result item
		// maxItem for max item per page
		// totalPage for total all page
		// currPage for current page
		//console.log("pagination load, _paginationLoad()");
		//console.log("total page: " + totalPage);
		var $resultContainer = $selector;
		var $resultBlock = $resultContainer;
		var $paginationContainer = $selector.find('.pagination-container');
		var listPaging = "<div class='pagination-container'><ul class='m-pagination mt-8 align pdt48' curr-page=" + currPage + " max-item=" + maxItem + " total-result=" + totalResult + " total-page=" + totalPage + ">";

		//PREVIOUS
		var prev = "";
		if (totalPage > 1) {
			if (currPage > 1) {
				prev +=
					"<li class='a-pagination_item previous'>" +
					"<a href='#' data-value='prev'><i class='a-system-icon icon-chevron-back'></i></a>" +
					"</li>\n";
			} else {
				prev +=
					"<li class='a-pagination_item is-disabled previous'>" +
					"<a href='#' data-value='prev'><i class='a-system-icon icon-chevron-back'></i></a>" +
					"</li>\n";
			}
		}
		//NUMBER
		var page = "";
		if (totalPage > 1) {
			if (totalPage <= maxItem) {
				for (var i = 1; i <= totalPage; i++) {
					if (i == currPage) {
						page += "<li class='a-pagination_item is-active'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
					}
					else {
						page += "<li class='a-pagination_item'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
					}
				}
			} else {
				if (currPage <= 3) {
					for (var i = 1; i <= 3; i++) {
						if (i == currPage) {
							page += "<li class='a-pagination_item is-active'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
						}
						else {
							page += "<li class='a-pagination_item'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
						}
					}
					page += "<li class='a-pagination_item'><a href='#'>...</a></li>\n";
					page += "<li class='a-pagination_item'><a href='#' data-value='" + totalPage + "'>" + totalPage + "</a></li>\n";
				}
				else if (currPage > 3 && currPage <= (totalPage - 3)) {
					page += "<li class='a-pagination_item'><a href='#' data-value='1'>1</a></li>\n";
					page += "<li class='a-pagination_item'><a href='#'>...</a></li>\n";
					var currPage3 = parseInt(currPage) + 2;
					if (currPage == 4) {
						for (var i = currPage; i <= currPage3; i++) {
							if (i == currPage) {
								page += "<li class='a-pagination_item is-active'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
							}
							else {
								page += "<li class='a-pagination_item'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
							}
						}
					}
					else if (currPage > 4 && currPage < (totalPage - 3)) {
						for (var i = currPage - 1; i <= parseInt(currPage) + 1; i++) {
							if (i == currPage) {
								page += "<li class='a-pagination_item is-active'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
							}
							else {
								page += "<li class='a-pagination_item'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
							}
						}
					}
					else if (currPage == (totalPage - 3)) {
						//console.log((totalPage - 3))
						for (var i = currPage - 2; i <= currPage; i++) {
							//console.log(i);
							if (i == currPage) {
								page += "<li class='a-pagination_item is-active'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
							}
							else {
								page += "<li class='a-pagination_item'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
							}
						}
					}
					page += "<li class='a-pagination_item'><a href='#'>...</a></li>\n";
					page += "<li class='a-pagination_item'><a href='#' data-value='" + totalPage + "'>" + totalPage + "</a></li>\n";

				}
				//else if (currPage < (totalPage - 1)) {
				//	for (var i = 1; i <= (totalPage - 2); i++) {
				//		if (i == currPage) {
				//			page += "<li class='a-pagination_item is-active'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
				//		}
				//		else {
				//			page += "<li class='a-pagination_item '><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
				//		}
				//	}
				//	page += "<li class='a-pagination_item'><a href='#'>...</a></li>\n";
				//	page += "<li class='a-pagination_item'><a href='#' data-value='" + totalPage + "'>" + totalPage + "</a></li>\n";
				//}
				else if (currPage == (totalPage - 1) && currPage <= totalPage) {
					page += "<li class='a-pagination_item'><a href='#' data-value='1'>1</a></li>\n";
					page += "<li class='a-pagination_item'><a href='#'>...</a></li>\n";
					for (var i = (totalPage - 2); i <= totalPage; i++) {
						if (i == currPage) {
							page += "<li class='a-pagination_item is-active'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
						}
						else {
							page += "<li class='a-pagination_item'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
						}
					}
				}
				else if (currPage >= (totalPage - 2) && currPage <= totalPage) {
					page += "<li class='a-pagination_item'><a href='#' data-value='1'>1</a></li>\n";
					page += "<li class='a-pagination_item'><a href='#'>...</a></li>\n";
					for (var i = (totalPage - 2); i <= totalPage; i++) {
						if (i == currPage) {
							page += "<li class='a-pagination_item is-active'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
						}
						else {
							page += "<li class='a-pagination_item'><a href='#' data-value='" + i + "'>" + i + "</a></li>\n";
						}
					}
				}
				else {
					page += "<li class='a-pagination_item'><a href='#' data-value='1'>1</a></li>\n";
					page += "<li class='a-pagination_item'><a href='#'>...</a></li>\n";
					page += "<li class='a-pagination_item is-active'><a href='#' data-value='" + currPage + "'>" + currPage + "</a></li>\n";
					page += "<li class='a-pagination_item'><a href='#'>...</a></li>\n";
					page += "<li class='a-pagination_item'><a href='#' data-value='" + totalPage + "'>" + totalPage + "</a></li>\n";
				}
			}
		}
		//NEXT
		var next = "";
		if (totalPage > 1) {
			if (currPage < totalPage) {
				next +=
					"<li class='a-pagination_item next'>" +
					"<a href='#' data-value='next'><i class='a-system-icon icon-chevron-next'></i></a>" +
					"</li>\n";
			} else {
				next +=
					"<li class='a-pagination_item is-disabled next'>" +
					"<a href='#' data-value='next'><i class='a-system-icon icon-chevron-next'></i></a>" +
					"</li>\n";
			}
		}
		//GENERATE PAGINATION
		listPaging += prev + page + next;

		if ($paginationContainer.length > 0) {
			$paginationContainer.remove();
		}

		if (totalPage > 0) {
			$selector.append(listPaging);
			//$('.report-standard-wrapper').append(listPaging);
			_paginationClick($selector, totalPage);
		}
	};

	var _paginationClick = function ($selector, totalPage) {
		//console.log("pagination click, _paginationClick()")
		var $paginationParent = $selector.find('.m-pagination');
		var $paginationItem = $selector.find('.a-pagination_item');

		$paginationItem.find('a').on('click', function (e) {
			e.preventDefault();
			var $this = $(this);

			$this.hide();
			var $loader = $('<i class="loader-spin is-active no-margin" style="margin: 0 !important">');
			$this.parent().append($loader).animate({
				opacity: 1
			}, 100, function () {
				var beforePage = $paginationParent.attr('curr-page');
				var afterPage = 1;
				var page = parseInt(beforePage);

				if ($this.attr('data-value') == "prev") {
					afterPage = page - 1;
				}
				else if ($this.attr('data-value') == "next") {
					afterPage = page + 1;
				}
				else {
					afterPage = $this.attr('data-value');
				}

				$paginationParent.attr('curr-page', afterPage);
				_retrieveData($paginationParent);

				$('html, body').animate({
					scrollTop: $this.closest(".report-standard-wrapper").offset().top
				}, 1000);
			});
		});
	};

	var _loadPage = function () {
		//console.log("load page, _loadPage()");
		var $repotStandardWrapper = $('.report-standard-wrapper');
		var totalPage = $repotStandardWrapper.find('.m-pagination').attr('total-page');
		_paginationClick($repotStandardWrapper, totalPage);
	};

	// --- init
	var init = function () {
		//console.log("init, _init()");
		var $wrapperReportStandard = $('.report-standard-wrapper');
		var $filterWrapper = $wrapperReportStandard.find('.m-filter__wrapper');

		if ($wrapperReportStandard.length) {
			_loadPage();
			_handleClick();
			_checkboxHeader();
			_checkboxBody();
			_downloadFile();
		}

		if ($filterWrapper.length) {
			_filter();
		}
	};

	// --- return
	return {
		init: init
	};

})();

var checkboxArrAnnualReport = [];
var annualReportScript = {
	constanta: function constanta() {
		annualReportScript.contentWrapper = $("#annualReport");
		annualReportScript.paginationWrapper = $('.paginationAnnualReport');
		annualReportScript.urlFilterData = '/api/sitecore/Report/GetFilteredData';
		$("input[name='reportYear']").prop('checked', false);
	},
	filteredReportItems: function filteredReportItems(searchKey, yearKey, currentPage) {
		var dsId = annualReportScript.contentWrapper.data("dsid");
		var currentActivePage = $('.a-pagination_item.is-active').find('a').data('pagenum');
		var $downloadBar = $('.o-bar--download');
		var dictLihat = annualReportScript.contentWrapper.data("dictlihat");
		var dictUkuran = annualReportScript.contentWrapper.data("dictukuran");
		$downloadBar.removeClass('is-active');
		$.ajax({
			type: 'POST',
			data: { 'dsId': dsId, 'currentPage': currentPage, 'searchParams': searchKey, 'yearParams': yearKey },
			url: annualReportScript.urlFilterData,
			success: function (results) {
				annualReportScript.contentWrapper.empty();
				annualReportScript.paginationWrapper.empty();
				$.each(results.ReportItems, function (index, value) {
					var fileSizeItem = parseFloat(value.FileSize);
					var fileSizeOnText = "";
					if (fileSizeItem > 1023999) {
						fileSizeOnText = (fileSizeItem / 1024000).toFixed(2) + " MB";
					}
					else if (fileSizeItem > 1023) {
						fileSizeOnText = (fileSizeItem / 1024).toFixed(2) + " KB";
					}
					else {
						fileSizeOnText = value.FileSize + " B";
					}
					var reportItem = `<div class="col-xs-12 col-sm-12 col-md-6">
											<div class="a-card a-card--card-report">
												<div class="a-card--img shine">
													<img loading="lazy" src="`+ value.ImageThumbnail + `">
												</div>
												<div class="a-card--check ta-right">
													<div class="checkbox-custom-card-report">
														<input type="checkbox" id="`+ value.IDItem + `" item-id="` + value.IDItem + `" name="accept" value="` + value.Title + `" data-file="` + value.File + `" data-size="` + value.FileSize + `">
														<label for="`+ value.IDItem + `"></label>
													</div>
												</div>
												<div class="a-card--content">
													<div class="a-card--date shine">
														<p class="a-text a-text-title">`+ value.Title + `</p>
													</div>
													<div class="a-card--title shine">
														<p class="a-text a-text-body">`+ value.SubTitle + `</p>
														<p class="a-text a-text-small">`+ dictUkuran + ` : ` + fileSizeOnText + `</p>
													</div>
													<div class="a-card--action shine">
														<div class="m-tabs-link">
															<div class="tb-cell va-middle a-card--next shine">
																<a class="text-button undefined" href="`+ value.File + `" target="_blank">` + dictLihat + `</a>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>`;
					annualReportScript.contentWrapper.append(reportItem);
				});
				if (results.ReportCount > 0) {
					annualReportScript.generatePaginationReport(currentPage, results.ReportCount);
					annualReportScript.bindCheckButton().init();
				}
			},
			error: function (err) {
				//console.log(err);
			}
		});
	},
	generatePaginationReport: function generatePaginationReport(currentPage, itemCount) {
		var maxItem = parseInt(annualReportScript.contentWrapper.data("maxitem"));
		var pageCount = Math.ceil(itemCount / maxItem);
		var paginationHtml = ``;
		if (currentPage && currentPage != "1") {
			var pageBefore = parseInt(currentPage) - 1;
			paginationHtml += ` <li class="a-pagination_item previous"><a class="paginationCustom" href="" data-pagenum="` + pageBefore + `"><i class="a-system-icon icon-chevron-back"></i></a></li>`;
		}
		if (pageCount > 1) {
			if (pageCount > 5) {
				if (parseInt(currentPage) <= pageCount - 4) {
					for (var i = 1; i <= 5; i++) {
						var pageNum = i;
						if (pageNum == parseInt(currentPage)) {
							paginationHtml += `<li class="a-pagination_item is-active"><a class="paginationCustom" href="" data-pagenum="` + pageNum + `">` + pageNum + `</a></li>`;
						}
						else {
							paginationHtml += `<li class="a-pagination_item"><a class="paginationCustom" href="" data-pagenum="` + pageNum + `">` + pageNum + `</a></li>`;
						}
					}
					//	paginationHtml += `<li class="a-pagination_item" > <a href="#">...</a></li>`;
					//	paginationHtml += `<li class="a-pagination_item"><a class="paginationCustom" href="" data-pagenum="` + pageCount + `">` + pageCount + `</a></li>`;
				}
				else {
					//paginationHtml += `<li class="a-pagination_item"><a class="paginationCustom" href="" data-pagenum="1">1</a></li>`;
					//paginationHtml += `<li class="a-pagination_item" > <a href="#">...</a></li>`;
					for (var i = pageCount - 4; i <= pageCount; i++) {
						var pageNum = i;
						if (pageNum <= pageCount) {
							if (pageNum == parseInt(currentPage)) {
								paginationHtml += `<li class="a-pagination_item is-active"><a class="paginationCustom" href="" data-pagenum="` + pageNum + `">` + pageNum + `</a></li>`;
							}
							else {
								paginationHtml += `<li class="a-pagination_item"><a class="paginationCustom" href="" data-pagenum="` + pageNum + `">` + pageNum + `</a></li>`;
							}
						}
					}
				}
			}
			else {
				for (var i = 0; i < pageCount; i++) {
					var pageNum = i + 1;
					if (pageNum == parseInt(currentPage)) {
						paginationHtml += `<li class="a-pagination_item is-active"><a class="paginationCustom" href="" data-pagenum="` + pageNum + `">` + pageNum + `</a></li>`;
					}
					else {
						paginationHtml += `<li class="a-pagination_item"><a class="paginationCustom" href="" data-pagenum="` + pageNum + `">` + pageNum + `</a></li>`;
					}
				}
			}
		}
		//else {
		//	paginationHtml += `<li class="a-pagination_item is-active"><a class="paginationCustom" href="" data-pagenum="1">1</a></li>`;
		//}
		if (currentPage && currentPage != pageCount) {
			var pageNext = parseInt(currentPage) + 1;
			paginationHtml += `<li class="a-pagination_item next" ><a class="paginationCustom" href="" data-pagenum="` + pageNext + `"><i class="a-system-icon icon-chevron-next"></i></a></li>`;
		}
		annualReportScript.paginationWrapper.append(paginationHtml);
		$(".paginationCustom").on('click', function (e) {
			e.preventDefault();
			$(this).hide();
			var $loader = $('<i class="loader-spin is-active no-margin" style="margin: 0 !important">');
			$(this).parent().append($loader);
			var page = $(this).data('pagenum');
			var searchKey = $("#searchAnnualReport").val();
			var arrYear = $("input[name='reportYear']:checked").map(function () { return this.value }).get();
			var filterKey = arrYear.join("|");
			annualReportScript.filteredReportItems(searchKey, filterKey, page);
			$('html, body').animate({
				scrollTop: annualReportScript.contentWrapper.offset().top
			}, 1000);
		});
	},
	bindCheckButton: function bindCheckButton() {
		var $tableReport = $('.m-table--report'),
			$tableHead = $tableReport.find('thead'),
			$tableBody = $tableReport.find('tbody'),
			$downloadBar = $('.o-bar--download'),
			$checkboxHead = $tableHead.find('input'),
			$checkboxBodyAll = $tableBody.find('input'),
			$downloadButton = $('.JS-report-download'),
			$clearButton = $('.JS-report-clear');
		var $cardContent = $('.a-card--card-report'),
			$cardBody = $cardContent.find('.a-card--check'),
			$checkBoxCard = $cardBody.find('input');

		var checkedCardObject = {};

		var _totalFile, _totalCheckbox, _totalSize;

		var downloadEvent = function downloadEvent() {
			$downloadButton.off();
			$downloadButton.on('click', function () {
				var arrFile = [];
				var objFile = {};
				var title = annualReportScript.contentWrapper.data("pagetitle");
				var zip = new JSZip();
				var count = 0;

				function formatAMPM(date) {
					var hours = date.getHours();
					var minutes = date.getMinutes();
					var ampm = hours >= 12 ? 'pm' : 'am';
					hours = hours % 12;
					hours = hours ? hours : 12; // the hour '0' should be '12'
					minutes = minutes < 10 ? '0' + minutes : minutes;
					var strTime = hours + '.' + minutes + ampm;
					return strTime;
				}

				var d = new Date();
				var date = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
				var time = formatAMPM(d);
				var zipFilename = title + "-" + date + "-" + time + ".zip";


				checkboxArrAnnualReport.forEach(function (url, index) {
					//console.log(url);
					var host = $(location).attr('host');
					//console.log(host + url.File);
					var fileUrl = host + url.File;
					var fileExt = url.File.split(/[#?]/)[0].split('.').pop().trim();
					//var fileName = url.Title.replace(" ", "-") + "." + fileExt;
					var file = url.File.split('/').pop();
					//fileName = file.split('.').slice(0, -1).join('.') +"("+index+ ")." + fileExt;
					var fileName = file.split('.').slice(0, -1).join('.') + "." + fileExt;
					objFile = {
						url: fileUrl,
						filename: file.split('.').slice(0, -1).join('.'),
						ext: fileExt
					}
					arrFile.push(objFile);
				});

				function renameFiles(arr) {
					var count = {};
					var arrRes = [];
					var objRes = {};
					arr.forEach(function (value, i) {
						if (arr.indexOf(value.filename) !== i) {
							var c = value.filename in count ? count[value.filename] = count[value.filename] + 1 : count[value.filename] = 1;
							var j = c;
							var filename = "";
							if (j > 1) {
								filename = value.filename + '(' + j + ').' + value.ext;
							}
							else {
								filename = value.filename + '.' + value.ext;
							}

							while (arr.indexOf(filename) !== -1) filename = value.filename + '(' + (++j) + ').' + value.ext;
							arr[i] = filename;
						}
						objRes = {
							url: value.url,
							filename: arr[i]
						}
						arrRes.push(objRes);
					});
					return arrRes;
				}

				//loading a file and add it in a zip file
				$.each(renameFiles(arrFile), function (index, value) {
					JSZipUtils.getBinaryContent(value.url, function (err, data) {
						if (err) {
							console.log(err); // or handle the error
						}
						zip.file(value.filename, data, { binary: true });
						count++;
						if (count == checkboxArrAnnualReport.length) {
							zip.generateAsync({ type: 'blob' }).then(function (content) {
								saveAs(content, zipFilename);
							});
							checkboxArrAnnualReport = [];
							$downloadBar.removeClass('is-active');
							$checkBoxCard.prop('checked', false);
						}
					});
				});
			});
		};

		var eventPickCard = function eventPickCard() {
			$checkBoxCard.off();
			$checkBoxCard.on('change', function () {
				var $this = $(this),
					_value = $this.is(':checked'),
					_type = 'one';

				checkActiveCard(_value, _type, $this);

				var dataValue = {};
				var idReport = $this.attr('item-id');
				if (_value) {
					dataValue = {
						ID: "{" + $this.attr('item-id') + "}",
						Title: $this.val(),
						File: $this.attr('data-file'),
						Size: $this.attr('data-size')
					}
					if ($this.attr('data-file')) {
						checkboxArrAnnualReport.push(dataValue);
					}

				}
				else {
					checkboxArrAnnualReport.splice($.inArray(dataValue, checkboxArrAnnualReport), 1);
				}
			});
		};

		var eventDownload = function eventDownload() { };

		var eventClearAll = function eventClearAll() {
			$clearButton.on('click', function () {
				clearAll();
			});
		};

		var checkActiveCard = function checkActiveCard(value, type, $selector) {
			var $parentCard = $selector.parents('.group-card').find('.a-card--card-report'),
				$checkboxCard = $parentCard.find('input[type="checkbox"]'),
				_dataValueCard = [];
			$checkboxCard.each(function () {
				var $this = $(this),
					_value = $this.is(':checked');

				_dataValueCard.push(_value);
			});

			if (value) {
				$selector.prop('checked', true);

				if (!$downloadBar.hasClass('is-active')) {
					$downloadBar.addClass('is-active');
				}
			} else {
				$selector.prop('checked', false);

				if (!_dataValueCard.includes(true)) {
					clearAll();
				}
			}

			downloadBarChart(value, type, $selector);
		};

		var clearAll = function clearAll() {
			checkboxArrAnnualReport = [];
			$downloadBar.removeClass('is-active');
			$checkBoxCard.prop('checked', false);
		};

		var downloadBar = function downloadBar(value, type, $selector) {
			var $parent = $selector.parents('table').find('tbody'),
				$checkboxAll = $parent.find('input[type="checkbox"]'),
				_dataValue = [],
				$totalFile = $downloadBar.find('*[data-totalFile]'),
				_totalFile = 0,
				_totalFileText = $totalFile.attr('data-copy'),
				$totalSize = $downloadBar.find('*[data-totalSize]'),
				_totalSize = 0,
				_copyByte = 'KB'; // $checkBoxCard.each(function() {
			//   console.log('fungsi checkbox');
			// });


			$checkboxAll.each(function () {
				var $this = $(this),
					_value = $this.is(':checked');

				_dataValue.push(_value);

				if (_value) {
					_totalSize = _totalSize + parseInt($this.attr('data-size'));
					_totalFile = _totalFile + 1;
				}
			});

			if (_totalSize > 1023999) {
				_totalSize = _totalSize / 1024000;
				_copyByte = 'MB';
			}
			else if (_totalSize > 1023) {
				_totalSize = _totalSize / 1024;
				_copyByte = 'KB';
			}

			$totalFile.find('h3').text(_totalFile + ' ' + _totalFileText);
			$totalSize.find('h3').text(Math.round(_totalSize) + ' ' + _copyByte);
		};

		var downloadBarChart = function downloadBarChart(value, type, $selector) {
			var $parentCard = $selector.parents('.group-card').find('.a-card--card-report'),
				$checkboxCards = $parentCard.find('input[type="checkbox"]'),
				_dataValueCard = [],
				$totalFileCard = $downloadBar.find('*[data-totalFile]'),
				_totalFileCard = 0,
				_totalFileCardText = $totalFileCard.attr('data-copy'),
				$totalSize = $downloadBar.find('*[data-totalSize]'),
				_totalSize = 0,
				_copyByte = 'KB';

			var totalSize = 0;

			$checkboxCards.each(function () {
				var $this = $(this),
					_value = $this.is(':checked');

				_dataValueCard.push(_value);

				if (_value) {
					totalSize = totalSize + parseInt($this.attr('data-size'));
					_totalSize = _totalSize + parseInt($this.attr('data-size'));
					_totalFileCard = _totalFileCard + 1;
				}
			});

			if (totalSize > 1023999) {
				totalSize = totalSize / 1024000;
				_copyByte = 'MB';
			}
			else if (totalSize > 1023) {
				totalSize = totalSize / 1024;
				_copyByte = 'KB';
			}

			$totalFileCard.find('h3').text(_totalFileCard + ' ' + _totalFileCardText);
			$totalSize.find('h3').text(Math.round(totalSize) + ' ' + _copyByte);
		};

		var init = function init() {
			if ($cardContent.length) {
				eventPickCard();
				downloadEvent();
				eventClearAll();
			}
		};

		return {
			init: init
		};
	},
	annualReportButtonBind: function annualReportButtonBind() {
		$("#searchAnnualReport").on('keyup focus', function (e) {
			var searchKey = $(this).val();
			var arrYear = $("input[name='reportYear']:checked").map(function () { return this.value }).get();
			var filterKey = arrYear.join("|");

			if (e.keyCode === 13) {
				e.preventDefault();
				annualReportScript.filteredReportItems(searchKey, filterKey, 1);
			}

		});

		$(".paginationCustom").on('click', function (e) {
			e.preventDefault();
			$(this).hide();
			var $loader = $('<i class="loader-spin is-active no-margin" style="margin: 0 !important">');
			$(this).parent().append($loader);
			var page = $(this).data('pagenum');
			var searchKey = $("#searchAnnualReport").val();
			var arrYear = $("input[name='reportYear']:checked").map(function () { return this.value }).get();
			var filterKey = arrYear.join("|");
			annualReportScript.filteredReportItems(searchKey, filterKey, page);
			$('html, body').animate({
				scrollTop: annualReportScript.contentWrapper.offset().top
			}, 1000);
		});

		$(".annualFilter").on('click', function (e) {
			e.preventDefault();
			var searchKey = $("#searchAnnualReport").val();
			var arrYear = $("input[name='reportYear']:checked").map(function () { return this.value }).get();
			var filterKey = arrYear.join("|");
			annualReportScript.filteredReportItems(searchKey, filterKey, 1);
		});

		$(".annualReset").on('click', function (e) {
			e.preventDefault();
			var searchKey = $("#searchAnnualReport").val();
			annualReportScript.filteredReportItems(searchKey, "", 1);
		});

		$(".annualSearch").on('click', function (e) {
			e.preventDefault();
			var searchKey = $("#searchAnnualReport").val();
			var arrYear = $("input[name='reportYear']:checked").map(function () { return this.value }).get();
			var filterKey = arrYear.join("|");
			annualReportScript.filteredReportItems(searchKey, filterKey, 1);
		});
	},
	init: function init() {
		annualReportScript.constanta();
		annualReportScript.annualReportButtonBind();
		annualReportScript.bindCheckButton().init();
	}
};

if ($('.m-table--report').length) {
	ReportStandard.init();
}

if ($('.a-card--card-report').length) {
	annualReportScript.init();
}
