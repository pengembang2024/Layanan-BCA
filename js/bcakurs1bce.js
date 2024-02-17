$(document).ready(function () {

	function convertLocaleCurrency(rate, locale) {
		return rate.toLocaleString(locale, { minimumFractionDigits: 2 });
	}


	function formatNumber(num, locale) {
		var res;
		//console.log(num);
		//console.log(locale);
		if (locale == "id-ID") {
			res = num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
			return "" + res;
		} if (locale == "en-US") {
			res = num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
			return "" + res;
		}
	}

	function convertToJavaScriptDate(value, locale) {
		var pattern = /Date\(([^)]+)\)/;
		var results = pattern.exec(value);
		var dt = new Date(parseFloat(results[1]));

		var objDate = new Date();
		objDate.setDate(1);
		objDate.setMonth(dt.getMonth());
		var monthLocale = objDate.toLocaleString(locale, { month: "long" });

		var dateFormat = "", _date = dt.getDate(), _datetxt = '' + _date, _hour = dt.getHours(), _minutes = dt.getMinutes(), _hourtxt = '' + _hour, _minutestxt = '' + _minutes;
		if (_hour < 10) {
			_hourtxt = '0' + _hour;
		} else { }
		if (_minutes < 10) {
			_minutestxt = '0' + _minutes;
		}
		if (_date < 10) {
			_datetxt = '0' + _date;
		}
		dateFormat = _datetxt + " " + monthLocale + " " + dt.getFullYear() + " " + _hourtxt + ":" + _minutestxt;
		//dateFormat = dt.getDate() + " " + monthLocale + " " + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
		return dateFormat;
	}

	var kursHariIni = $('#kurs-hari-ini-content');
	var dsid = kursHariIni.attr('dsid');
	var lang = kursHariIni.attr('lang');
	//var lang = "id-ID";

	var refreshBtn = kursHariIni.find('.o-kurs-refresh-icon');
	var refreshDate = kursHariIni.find('.refresh-date');
	var table = kursHariIni.find('table.m-table-kurs');
	var tbody = table.find('tbody');
	var trRow = tbody.find('tr');

	refreshBtn.click(function (e) {
		e.preventDefault();
		//console.log('test refresh click');
		$.ajax({
			url: '/api/sitecore/currencies/RefreshKurs',
			data: { dsid: dsid },
			type: 'POST',
			success: function (res) {
				//console.log("ajax call success");

				//get refresh date
				refreshDate.text(convertToJavaScriptDate(res.LastUpdateFinal, lang));

				//get arr type currency
				var kursRates = res.KursRates;

				trRow.each(function () {
					var $this = $(this);
					var item = kursRates.find(x => x.CurrencyCode == $this.attr('code'));

					var firstCol = $this.find('td.sticky-col.first-col');
					firstCol.find('span img').attr('src', item.CurrencyImageUrl);
					firstCol.find('span p').text(item.CurrencyCode);

					var ERate = item.Rates.find(x => x.RateType == 0);
					var TT = item.Rates.find(x => x.RateType == 1);
					var BN = item.Rates.find(x => x.RateType == 2);

					if (ERate) {
						$this.find('td p[rate-type="ERate-buy"]').text(convertLocaleCurrency(ERate.BuyRate, lang));
						$this.find('td p[rate-type="ERate-sell"]').text(convertLocaleCurrency(ERate.SellRate, lang));
					}
					if (TT) {
						$this.find('td p[rate-type="TT-buy"]').text(convertLocaleCurrency(TT.BuyRate, lang));
						$this.find('td p[rate-type="TT-sell"]').text(convertLocaleCurrency(TT.SellRate, lang));
					}
					if (BN) {
						$this.find('td p[rate-type="BN-buy"]').text(convertLocaleCurrency(BN.BuyRate, lang));
						$this.find('td p[rate-type="BN-sell"]').text(convertLocaleCurrency(BN.SellRate, lang));
					}

				});
			}
		});
	});

	var KursToday = (function () {
		var calcKursWrap = $('.o-kurs-calc-content');
		var beliContent = calcKursWrap.find('.m-tabs-content#Beli');
		var jualContent = calcKursWrap.find('.m-tabs-content#Jual');

		var calcKursWrapMobile = $('.m-kurs-responsive');
		var beliContentMobile = calcKursWrapMobile.find('.m-tabs-content#beli');
		var jualContentMobile = calcKursWrapMobile.find('.m-tabs-content#jual');
		var ddCurrency1 = beliContent.find('#select-kurs-1');
		var ddCurrency2 = beliContent.find('#select-kurs-2');
		var _ddCurrency1 = ddCurrency1.val();
		var _ddCurrency2 = ddCurrency2.val();

		var _calcKursBuy = function () {
			var selectTypeRateWrap = beliContent.find('.select-kurs-type-rate');

			var inpCurrency1 = beliContent.find('#input-kurs-1');

			var inpCurrency2 = beliContent.find('#input-kurs-2');
			var submitCalc = beliContent.find('#submit-calculator-beli');
			var jenisKurs = selectTypeRateWrap.find('#jenis-kurs-calc-new-1');

			selectTypeRateWrap.find('.jenis-kurs-data').on('change', function () {
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if ($this.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if ($this.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if ($this.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			ddCurrency1.on('change', function () {
				var $this = $(this);
				var valueSelect = "";
				_ddCurrency1 = $this.val().split('-')
				var strValuedd1 = _ddCurrency1;
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = _ddCurrency2;
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			ddCurrency2.on('change', function () {
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = _ddCurrency1;
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}
				_ddCurrency2 = $this.val().split('-');
				var strValuedd2 = $this.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			inpCurrency1.on('keypress keyup', function () {
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			submitCalc.on('click', function () {
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
		};
		var _calcKursBuyMobile = function () {
			var selectTypeRateWrap = beliContentMobile.find('.select-kurs-type-rate');
			var ddCurrency1 = beliContentMobile.find('#select-kurs-mobile-1');
			var inpCurrency1 = beliContentMobile.find('#input-kurs-mobile-1');
			var ddCurrency2 = beliContentMobile.find('#select-kurs-mobile-2');
			var inpCurrency2 = beliContentMobile.find('#input-kurs-mobile-2');
			var submitCalc = beliContentMobile.find('#a-submit-calc-mobile-buy');
			var jenisKurs = selectTypeRateWrap.find('#jenis-kurs-calc-mobile-1');

			selectTypeRateWrap.find('.jenis-kurs-data').on('change', function () {
				//console.log("selectTypeRateWrap");
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if ($this.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if ($this.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if ($this.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			ddCurrency1.on('change', function () {
				//console.log("ddCurrency1");
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = $this.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			ddCurrency2.on('change', function () {
				//console.log("ddCurrency2");
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = $this.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			inpCurrency1.on('keypress keyup', function () {

				var $this = $(this);
				var valueSelect = "";
				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			submitCalc.on('click', function () {
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
		};
		var _calcKursSell = function () {
			var selectTypeRateWrap = jualContent.find('.select-kurs-type-rate');
			var ddCurrency1 = jualContent.find('#select-kurs-3');
			var inpCurrency1 = jualContent.find('#input-kurs-3');
			var ddCurrency2 = jualContent.find('#select-kurs-4');
			var inpCurrency2 = jualContent.find('#input-kurs-4');
			var submitCalc = jualContent.find('#submit-calculator-jual');
			var jenisKurs = selectTypeRateWrap.find('#jenis-kurs-calc-new-2');

			selectTypeRateWrap.find('.jenis-kurs-data').on('change', function () {
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if ($this.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if ($this.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if ($this.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			ddCurrency1.on('change', function () {
				var $this = $(this);
				var valueSelect = "";
				//console.log(jenisKurs.val());
				var strValuedd1 = $this.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			ddCurrency2.on('change', function () {
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = $this.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			inpCurrency1.on('keypress keyup', function () {
				var $this = $(this);
				var valueSelect = "";
				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			submitCalc.on('click', function () {
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
		};
		var _calcKursSellMobile = function () {
			var selectTypeRateWrap = jualContentMobile.find('.select-kurs-type-rate');
			var ddCurrency1 = jualContentMobile.find('#select-kurs-mobile-3');
			var inpCurrency1 = jualContentMobile.find('#input-kurs-mobile-3');
			var ddCurrency2 = jualContentMobile.find('#select-kurs-mobile-4');
			var inpCurrency2 = jualContentMobile.find('#input-kurs-mobile-4');
			var submitCalc = jualContentMobile.find('#a-submit-calc-mobile-jual');
			var jenisKurs = selectTypeRateWrap.find('#jenis-kurs-calc-mobile-2');

			selectTypeRateWrap.find('.jenis-kurs-data').on('change', function () {
				//console.log("selectTypeRateWrap");
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if ($this.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if ($this.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if ($this.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			ddCurrency1.on('change', function () {
				//console.log("ddCurrency1");
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = $this.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			ddCurrency2.on('change', function () {
				//console.log("ddCurrency2");
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = $this.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			inpCurrency1.on('keypress keyup', function () {

				var $this = $(this);
				var valueSelect = "";
				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = ($this.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
			submitCalc.on('click', function () {
				var $this = $(this);
				var valueSelect = "";

				var strValuedd1 = ddCurrency1.val().split('-');
				var val1 = [];
				for (var i = 0; i < strValuedd1.length; i++) {
					val1[i] = strValuedd1[i];
				}

				var strValuedd2 = ddCurrency2.val().split('-');
				var val2 = [];
				for (var ii = 0; ii < strValuedd2.length; ii++) {
					val2[ii] = strValuedd2[ii];
				}

				if (jenisKurs.val() == "e-Rate") {
					valueSelect = 0;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "TT Counter") {
					valueSelect = 1;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
				if (jenisKurs.val() == "Bank Notes") {
					valueSelect = 2;
					var eRateVal = (inpCurrency1.val().split('.').join('') * val1[valueSelect]) / val2[valueSelect];
					inpCurrency2.val(formatNumber(eRateVal, lang));
				}
			});
		};
		var _loadPage = function () {
			_calcKursBuy();
			_calcKursSell();
			_calcKursBuyMobile();
			_calcKursSellMobile();
		};
		var _init = function () {
			_loadPage();
			//console.log("init");
		};
		return {
			init: _init
		};
	})();

	KursToday.init();


	var kursForward = $('#kurs-forward-content');
	var kf_dsid = kursForward.attr('dsid');
	var kf_lang = kursForward.attr('lang');
	//var kf_lang = "id-ID";

	var kf_refreshBtn = kursForward.find('.o-kurs-refresh-icon');
	var kf_refreshDate = kursForward.find('.refresh-date');
	var kf_table = kursForward.find('table.m-table-kurs');
	var kf_tbody = kf_table.find('tbody');
	var kf_trRow = kf_tbody.find('tr');


	kf_refreshBtn.click(function (e) {
		e.preventDefault();
		//console.log('test refresh click');
		$.ajax({
			url: '/api/sitecore/KursForward/RefreshKursForward',
			data: { dsid: kf_dsid },
			type: 'POST',
			success: function (res) {
				//console.log("ajax call suiccess");
				//get refresh date
				kf_refreshDate.text(convertToJavaScriptDate(res.LastUpdateFinal, kf_lang));

				//get arr type currency
				var kursRates = res.KursRates;
				//console.log(res);
				//console.log(kursRates);

				kf_trRow.each(function () {
					var $this = $(this);
					var item = kursRates.find(x => x.CurrencyCode == $this.attr('code'));

					var firstCol = $this.find('td.sticky-col.first-col');
					firstCol.find('span img').attr('src', item.CurrencyImageUrl);
					firstCol.find('span p').text(item.CurrencyCode);

					var OneWeek = item.Rates.find(x => x.RateType == 0);
					var OneMonth = item.Rates.find(x => x.RateType == 1);
					var ThreeMonth = item.Rates.find(x => x.RateType == 2);
					var SixMonth = item.Rates.find(x => x.RateType == 3);

					if (OneWeek) {
						$this.find('td p[rate-type="OneWeek-buy"]').text(convertLocaleCurrency(OneWeek.BuyRate, kf_lang));
						$this.find('td p[rate-type="OneWeek-sell"]').text(convertLocaleCurrency(OneWeek.SellRate, kf_lang));
					}
					if (OneMonth) {
						$this.find('td p[rate-type="OneMonth-buy"]').text(convertLocaleCurrency(OneMonth.BuyRate, kf_lang));
						$this.find('td p[rate-type="OneMonth-sell"]').text(convertLocaleCurrency(OneMonth.SellRate, kf_lang));
					}
					if (ThreeMonth) {
						$this.find('td p[rate-type="ThreeMonth-buy"]').text(convertLocaleCurrency(ThreeMonth.BuyRate, kf_lang));
						$this.find('td p[rate-type="ThreeMonth-sell"]').text(convertLocaleCurrency(ThreeMonth.SellRate, kf_lang));
					} if (SixMonth) {
						$this.find('td p[rate-type="SixMonth-buy"]').text(convertLocaleCurrency(SixMonth.BuyRate, kf_lang));
						$this.find('td p[rate-type="SixMonth-sell"]').text(convertLocaleCurrency(SixMonth.SellRate, kf_lang));
					}
				});
			}
		});
	});

	$('#submit-calculator-forward-desktop').click(function (e) {
		//var TanggalJatuhTempo = document.getElementById("KursDate").value;
		var TanggalJatuhTempo = $('#datetenor-desktop').val();
		$('#widget-kurs-1-desktop').val("");
		$('#widget-kurs-2-desktop').val("");

		if (TanggalJatuhTempo != "" && TanggalJatuhTempo != "dd/mm/yyyy") {
			//document.getElementsByClassName('errorMessage errorRequired')[0].innerHTML = "";

			//var FormatTanggal = new Date(TanggalJatuhTempo);
			//var BulanAngka = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
			//var TanggalFormat = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

			//var Hari = FormatTanggal.getDate();
			//var Bulan = FormatTanggal.getMonth() + 1;
			//var Tahun = FormatTanggal.getFullYear();

			var Hari = TanggalJatuhTempo.substring(0, 2);
			var Bulan = TanggalJatuhTempo.substring(3, 5);
			var Tahun = TanggalJatuhTempo.substring(6, 10);
			//TanggalJatuhTempo = Tahun + '/' + BulanAngka[Bulan] + '/' + TanggalFormat[Hari - 1];

			//if(Bulan == "Jan")
			//	Bulan = "01";
			//else if(Bulan == "Feb")
			//	Bulan = "02";
			//else if(Bulan == "Mar")
			//	Bulan = "03";
			//else if(Bulan == "Apr")
			//	Bulan = "04";
			//else if(Bulan == "May")
			//	Bulan = "05";
			//else if(Bulan == "Jun")
			//	Bulan = "06";
			//else if(Bulan == "Jul")
			//	Bulan = "07";
			//else if(Bulan == "Aug")
			//	Bulan = "08";
			//else if(Bulan == "Sep")
			//	Bulan = "09";
			//else if(Bulan == "Oct")
			//	Bulan = "10";
			//else if(Bulan == "Nov")
			//	Bulan = "11";
			//else
			//	Bulan = "12";

			TanggalJatuhTempo = Tahun + '/' + Bulan + '/' + Hari;

			var CurrCode = $('#select-kurs-forward-1').val();
			var DefaultIDR = "/IDR";
			CurrCode = CurrCode + DefaultIDR;

			var datasource = $('#hdDatasource').val();

			//alert(TanggalJatuhTempo + "...."+CurrCode);

			$(document).ready(function () {
				//$('#loading-image').show();
				//$("#ddlKurs").prop('disabled', true);
				//$("#KursDate").prop('disabled', true);
				//$("#btnHitungEForward").prop('disabled', true);
			});

			$.ajax({
				url: '/api/sitecore/KursForward/GetSellAndBuy_ByCurrencyAndDate',
				data: JSON.stringify({ "CurrencyCode": CurrCode, "TransactionDate": TanggalJatuhTempo, "datasource": datasource }),
				type: "POST",
				cache: false,
				dataType: 'json',
				contentType: 'application/json; charset=utf-8',
				success: function (data) {
					//alert("berhasil " + data.message + " .... " + TanggalJatuhTempo + "...."+CurrCode);
					//alert(data.CurrencyCode+"...."+data.TransactionDate);
					//alert(data.Sell + ">>> Sell ... Buy <<< " + data.Buy + " error code " + data.ErrorCode);
					if (data.ErrorCode == "Success") {
						$('#error-desktop').html("");
						$('#widget-kurs-1-desktop').val(data.Sell);
						$('#widget-kurs-2-desktop').val(data.Buy);
					}
					else {
						$('#error-desktop').html(data.ErrorCode);
						//alert(data.ErrorCode)
						$('#widget-kurs-1-desktop').val("");//sell
						$('#widget-kurs-2-desktop').val("");//buy
					}
				},
				error: function (err) {
					alert("Error Message >> " + err.responseText);
				}
				, complete: function () {
					//$('#loading-image').hide();
					//$("#ddlKurs").prop('disabled', false);
					//$("#KursDate").prop('disabled', false);
					//$("#btnHitungEForward").prop('disabled', false);
				}
			});
		}
		else
			$('#error-desktop').html("Tanggal Jatuh Tempo harus diisi");
	});

	$('#submit-calculator-forward-mobile').click(function (e) {
		//var TanggalJatuhTempo = document.getElementById("KursDate").value;
		var TanggalJatuhTempo = $('#datetenor-mobile').val();
		$('#widget-kurs-1-mobile').val("");
		$('#widget-kurs-2-mobile').val("");

		if (TanggalJatuhTempo != "" && TanggalJatuhTempo != "dd/mm/yyyy") {
			//document.getElementsByClassName('errorMessage errorRequired')[0].innerHTML = "";

			var FormatTanggal = new Date(TanggalJatuhTempo);
			var BulanAngka = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
			var TanggalFormat = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

			//var Hari = FormatTanggal.getDate();
			//var Bulan = FormatTanggal.getMonth() + 1;
			//var Tahun = FormatTanggal.getFullYear();

			var Hari = TanggalJatuhTempo.substring(0, 2);
			var Bulan = TanggalJatuhTempo.substring(3, 5);
			var Tahun = TanggalJatuhTempo.substring(6, 10);
			//TanggalJatuhTempo = Tahun + '/' + BulanAngka[Bulan] + '/' + TanggalFormat[Hari - 1];

			//if(Bulan == "Jan")
			//	Bulan = "01";
			//else if(Bulan == "Feb")
			//	Bulan = "02";
			//else if(Bulan == "Mar")
			//	Bulan = "03";
			//else if(Bulan == "Apr")
			//	Bulan = "04";
			//else if(Bulan == "May")
			//	Bulan = "05";
			//else if(Bulan == "Jun")
			//	Bulan = "06";
			//else if(Bulan == "Jul")
			//	Bulan = "07";
			//else if(Bulan == "Aug")
			//	Bulan = "08";
			//else if(Bulan == "Sep")
			//	Bulan = "09";
			//else if(Bulan == "Oct")
			//	Bulan = "10";
			//else if(Bulan == "Nov")
			//	Bulan = "11";
			//else
			//	Bulan = "12";

			TanggalJatuhTempo = Tahun + '/' + Bulan + '/' + Hari;

			var CurrCode = $('#select-kurs-forward-mobile-1').val();
			var DefaultIDR = "/IDR";
			CurrCode = CurrCode + DefaultIDR;

			var datasource = $('#hdDatasource').val();

			//alert(TanggalJatuhTempo + "...."+CurrCode);

			$(document).ready(function () {
				//$('#loading-image').show();
				//$("#ddlKurs").prop('disabled', true);
				//$("#KursDate").prop('disabled', true);
				//$("#btnHitungEForward").prop('disabled', true);
			});

			$.ajax({
				url: '/api/sitecore/KursForward/GetSellAndBuy_ByCurrencyAndDate',
				data: JSON.stringify({ "CurrencyCode": CurrCode, "TransactionDate": TanggalJatuhTempo, "datasource": datasource }),
				type: "POST",
				cache: false,
				dataType: 'json',
				contentType: 'application/json; charset=utf-8',
				success: function (data) {
					//alert("berhasil " + data.message + " .... " + TanggalJatuhTempo + "...."+CurrCode);
					//alert(data.CurrencyCode+"...."+data.TransactionDate);
					//alert(data.Sell + ">>> Sell ... Buy <<< " + data.Buy + " error code " + data.ErrorCode);
					if (data.ErrorCode == "Success") {
						$('#error-mobile').html("");
						$('#widget-kurs-1-mobile').val(data.Sell);
						$('#widget-kurs-2-mobile').val(data.Buy);
					}
					else {
						$('#error-mobile').html(data.ErrorCode);
						//alert(data.ErrorCode)
						$('#widget-kurs-1-mobile').val("");//sell
						$('#widget-kurs-2-mobile').val("");//buy
					}
				},
				error: function (err) {
					alert("Error Message >> " + err.responseText);
				}
				, complete: function () {
					//$('#loading-image').hide();
					//$("#ddlKurs").prop('disabled', false);
					//$("#KursDate").prop('disabled', false);
					//$("#btnHitungEForward").prop('disabled', false);
				}
			});
		}
		else
			$('#error-mobile').html("Tanggal Jatuh Tempo harus diisi");
	});

	//SMARTBAR KURS
	var smartBarWrapper = $('.o-smartbar');
	var smartBarKursWrapper = smartBarWrapper.find('.o-kurs-refresh-wrapper');
	var refreshKursBtnSmartBar = smartBarKursWrapper.find('.kurs-refresh-icon');
	var refreshDateSmartBar = smartBarKursWrapper.find('.refresh-date');
	var langSmartBar = smartBarKursWrapper.attr('lang');
	var smartBarKursRow = $('.smartbar-kurs-row');
	var smartBarDsid = smartBarKursRow.attr('dsid');
	refreshKursBtnSmartBar.click(function (e) {
		e.preventDefault();
		//console.log("refresh kurs button");
		$.ajax({
			url: '/api/sitecore/currencies/RefreshKursSmartBar',
			data: { dsid: smartBarDsid },
			type: 'POST',
			success: function (res) {
				//get refresh date
				refreshDateSmartBar.text(convertToJavaScriptDate(res.LastUpdateFinal, langSmartBar));
				//get arr type currency
				var columnBuy = res.ColumnBuy;
				var columnSell = res.ColumnSell;
				var kursRates = res.KursRates;
				//console.log(kursRates);
				var html = "";
				smartBarKursRow.empty();

				for (var i = 0; i < kursRates.length; i++) {
					var ERate = kursRates[i].Rates.find(x => x.RateType == 0);
					html +=
						'<div class="col-xs-6 col-sm-6 col-md-6">' +
						'<div class="m-card-kurs-data-wrapper">' +
						'<div class="a-text a-text-subtitle">' +
						'<div class="m-card-kurs-currency">' +
						'<i class="a-system-icon tb-cell va-middle ' + kursRates[i].CurrencyFontImage + '"></i>' +
						'<span class="tb-cell va-middle a-text a-text-subtitle">' + kursRates[i].CurrencyCode + '</span>' +
						'</div>' +
						'</div>' +
						'<div class="transaction-data">' +
						'<div class="a-text a-text-body transaction-data-header">' + columnBuy + ' </div>' +
						'<div class="a-text a-text-subtitle transaction-data-body">' + convertLocaleCurrency(ERate.BuyRate, lang) + '</div>' +
						'<div class="a-text a-text-body transaction-data-header">' + columnSell + '</div>' +
						'<div class="a-text a-text-subtitle transaction-data-body">' + convertLocaleCurrency(ERate.SellRate, lang) + '</div>' +
						'</div>' +
						'</div>' +
						'</div>';
				}
				//console.log(html);


				smartBarKursRow.append(html);

			}
		});
	});

});