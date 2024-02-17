var App = (function () {
	//event calendar function
	var _showList = function (data) {
		let $listContent = $('.o-list-date__content'),
			$listEvent = $('.o-list-date__event'),
			_list = data.list,
			_tempList;

		$listEvent.html('');

		if (Array.isArray(_list) && _list.length) {
			$listContent.removeClass('no-result');
			//remove all list

			//append list to container
			$.each(_list, function () {
				_tempList = `<li>
          <a class="a-text a-text-subtitle" href="${this.link}">${this.title}</a>
          <div class="o-list-date__event-date">
            <span>
              <i class="a-system-icon icon-clock"></i>
              ` + (this.until ? `<span class="a-text a-text-date">${this.start} - ${this.until}</span>` :
					`<span class="a-text a-text-date">${this.start}</span>`) +
            `</span>
            <span>
              <i class="a-system-icon icon-location"></i>
              <span class="a-text a-text-date">${this.location}</span>
            </span>
          </div>
        </li>`;

				$listEvent.append(_tempList);
			});
		} else {
			$listContent.addClass('no-result');
		}
	};

	var _updateDate = function (data) {
		let $date = $('.o-list-date__content-date').children(),
			_month = ("0" + (parseInt(data.month) + 1)).slice(-2),
			_date = data.year + '-'  + _month + '-' + data.day;
		$date.text(language.getContext('date').formatLongDate(new Date(_date)));
	};

	return {
		calendar: {
			init: function () {
				var $calendar = $('.vanilla-calendar').vanillaCalendar({
					//url: 'https://api.mocki.io/v1/203e1b88/event', // -- URL Dummy (Modified for real URL)
					//- pick month and year
					onDropdown: function (data) {
						//var _url = 'https://api.mocki.io/v1/203e1b88/event'; // -- URL Dummy for change month or year (Modified for real URL)
						////- update calendar
						//$calendar.onChange({
						//	url: _url,
						//});
					},
					//- pick date
					onDayCLick: function (data) {
						App.calendar.showList(data);
						App.calendar.updateDate(data);
					},
					//- init calendar
					init: function (data) {
						App.calendar.showList(data);
						App.calendar.updateDate(data);
					},
				});

				//- trigger pre-landing-calendar
				$('.pre-landing-calendar').vanillaCalendar({
					lazyLoad: function (callback) {
						if (bca) {
							bca.modules.landing.triggerLayoutChanged();
							bca.modules.landing.getData(function (result) {
								if (typeof (callback) == 'function') {
									callback(result);
								}
							}, '.pre-landing', { page: 0, dataType: 'CalendarData', pageSize: 0, overridecontext: false });
						}
					},
					onDropdown: function (data) {
						$calendar.onChange(this);
					},
					//- pick date
					onDayCLick: function (data) {
						App.calendar.showList(data);
						App.calendar.updateDate(data);
					},
				});
			},
			showList: _showList,
			updateDate: _updateDate,
		},
	};
})();

var language = require("js/languageData.js")['default'];

const handleFocus = e => {
	const { target } = e;

	target.parentNode.classList.add('active');
	// $buttonFilter.addClass('hide-filter');
	if (
		!target.parentNode.classList.contains('m-input-text-search') &&
		!target.classList.contains('input--no-label')
	) {
		target.setAttribute('placeholder', target.getAttribute('data-placeholder'));
	}
	e.preventDefault();

	if (target.id === 'locationSearching') {
		$('body').addClass('no-scroll');
		$(target)
			.parent()
			.prev()
			.addClass('active');
	}
};

const handleKursNoValue = () => {
	const sellValue = item.getAttribute('data-smart-tile-sell');
	const buyValue = item.getAttribute('data-smart-tile-buy');
	if (sellValue == 0 && buyValue == 0) {
		const getParents = $('.m-smart-tile_info-item')
			.parent()
			.parent();
		getParents.addClass('shine--load no-value');
	}
};

const handleBlur = e => {
	const { target } = e;
	target.parentNode.classList.remove('active');
	if (!target.value) {
		target.parentNode.classList.remove('active');
	}
	if (
		!target.parentNode.classList.contains('m-input-text-search') &&
		!target.classList.contains('input--no-label')
	) {
		target.removeAttribute('placeholder');
	}

	// $buttonFilter.removeClass('hide-filter');
};

const bindEvents = element => {
	const floatField = element.querySelector('input');
	floatField.addEventListener('focus', handleFocus);
	floatField.addEventListener('blur', handleBlur);
};

const handleTextEmpty = () => {
	$('#textRequired').blur(function (e) {
		e.preventDefault();
		var $this = $(this);
		if (!$this.val()) {
			$('.error-text').css('display', 'inline');
			$this.parent().css('border-bottom', '1px solid red');
		} else {
			$('.error-text').css('display', 'none');
			$this.parent().css('border-bottom', '1px solid #B0B0B0');
		}
	});
};

const validateEmail = email => {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

const handleFormEmail = () => {
	// const email = ['ilham@aleph-labs.com', 'test@aleph-labs.com', 'test@bca.co.id'];
	$('#email-subs-form').submit(function () {
		const data = $('#email-subs').val();
		// const isReady = email.indexOf(data) > -1;
		if (validateEmail(data)) {
			$('.email-subs').removeClass('is-invalid');
			$('.email-subs').addClass('is-valid');
			$('.email-subs').text('Anda berhasil mendaftar!');

			// document.getElementById('#status').innerHTML = "Anda berhasil mendaftar!";
		} else {
			$('.email-subs').removeClass('is-valid');
			$('.email-subs').addClass('is-invalid');
			$('.email-subs').text('Email yang anda masukkan salah');
			// document.getElementById('#status').innerHTML = "Email yang anda masukkan salah";
		}
		return false;
	});

	handleTextEmpty();

	const floatContainers = [].slice.call(
		document.querySelectorAll('.m-input-text')
	);

	for (let i = 0, len = floatContainers.length; i < len; i += 1) {
		const element = floatContainers[i];
		if (element.querySelector('input').value) {
			$(element).addClass('active');
			// console.log(element, 'check');
		}

		bindEvents(element);
	}
};

const handleClickSelectBoxOption = (e, val) => {
	let $this = $(e.target),
		$parent = $this.parents('.a-dropdown'),
		$parentContent = $this.parents('.a-dropdown-content'),
		_value = $this.parent().attr('data-value'),
		_text = $this.text();
	const $elDropdown = $(e.target).parents('.a-dropdown');
	const $inputForm = $elDropdown.parents('.input-form--select');
	const isNoLabelValue = $parentContent
		.siblings('select')
		.hasClass('no-label-value');
	$this
		.parents('.a-dropdown')
		.find('li')
		.removeClass('is-active');
	$this.parent().addClass('is-active');
	$parent.find('input').val(_text);
	$parent.find('select').val(_value);

	$parent.find('input').trigger('change');
	$parent.find('select').trigger('change');
	//  console.log(isNoLabelValue,'no-label-value')

	for (let i = 0, len = _value.length; i < len; i++) {
		const element = _value[i];
		// console.log(!isNoLabelValue,'check value')
		if (element && !isNoLabelValue) {
			// if(element) {
			$parent.addClass('has-value');
			$parent.find('select').trigger('change');
		} else {
			// $(element).removeClass('has-data');
			$parent.removeClass('has-value');
		}
	}

	$parent.find('input').val($this.data().text);
	// $('.a-dropdown-value').attr('placeholder', $this.data().text);
	// remove all dropdown
	$('.a-dropdown').removeClass('is-active');
	$inputForm.removeClass('backdrop-active');
	$elDropdown.find('.m-filter__backdrop').removeClass('active');

	e.stopPropagation();
};

$('body').on('click', '.a-dropdown-select-option a', e => {
	handleClickSelectBoxOption(e);
});

const handleSuggestionHeader = () => {
	const parent = $('.header-search_form');
	const childForm = parent.children('.m-smart-search_form');
	const childInput = childForm.children('.a-smart-search_input');
	const child = parent.children('.m-smart-search_suggestion-wrapper');
	const listParent = child.children('.m-smart-search_suggestion');
	const childList = child
		.children()
		.children()
		.not(':first-child')
		.not('.suggestion-list');
	const childSuggestion = child
		.children()
		.children()
		.last();

	childInput.keyup(function () {
		let valInput = $(this).val();
		console.log(valInput);
		console.log(valInput.length);
		if (valInput.length == 0) {
			listParent.removeClass('suggestion');
			childList.removeClass('suggestion');
		}

		if (valInput.length > 0) {
			setTimeout(() => {
				listParent.addClass('suggestion');
				childList.addClass('suggestion');
				childSuggestion
					.children('ul')
					.children()
					.children()
					.children()
					.html(valInput + ' ' + 'with keyword in it');
			}, 100);
		}
	});

	console.log(parent);
	console.log(childInput);
	console.log(listParent);
	console.log(childList);
	console.log(
		childSuggestion
			.children('ul')
			.children()
			.children()
			.children()
	);
};

$(document).ready(function () {
	
	//mybca
	 var urlParams = new URLSearchParams(window.location.search);
	 if(urlParams.get('type') === 'mybca') {
		 $('body').removeClass('with-smartbar')
		
		 //Remove button
		 $('.a-button').remove();
		
		 //Change href
		 var anchors = document.querySelectorAll('a');
		 Array.prototype.forEach.call(anchors, function (element, index) {
			 element.href = "#";				
		 });
	 }
	
	// console.log('this is custom scripts');

	handleFormEmail();
	//handleSuggestionHeader();
	// eventHandler();
	//- load google maps
	if ($('.map-container').length) {
		// initMap();
	}

	//input-filter
	// INFO: it seems method contentFilter() cannot run properly for quite sometime.
	if ($('.m-filter').length) {
		//- trigger filer event
		$('.m-filter').contentFilter({
			onSubmit: function (data) {
				// console.log(data);
				// console.log('submit list here');
			},
		});
	}

	//calendar event
	if ($('.vanilla-calendar').length) {
		//- trigger vanilla calendar
		App.calendar.init();
	}
	//scd-20210115
/*const hideScrollSmartbar = () => {
    var prevScroll = 0;
    const hideScrollSmartbar = (_scrollTop) => {
      var SmartBar = $('.o-smartbar-content')
     
      var bottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200);
      if(_scrollTop > prevScroll) {
        SmartBar.addClass('d-animate-none')
       
        if(bottom) {
         
          SmartBar.removeClass('d-animate-none')
        }
      }else {
        
        
        SmartBar.removeClass('d-animate-none')
      }
      prevScroll = _scrollTop
    }
    $(window).on('scroll', function() {
      var _scrollTop = $(window).scrollTop();
      if(window.screen.availWidth < 480) {
        hideScrollSmartbar(_scrollTop)
      }
    })
  }

  hideScrollSmartbar()
  */
  /*
  
  const checkIfDownloadBarIsActive = () => {
	  var $downloadBar = $('.o-bar--download'),
		  $smartbar = $('.o-smartbar')
	  if($downloadBar.hasClass('is-active')){
		$smartbar.addClass('always-show')
	  }else{
		$smartbar.removeClass('always-show')
	  }
  }
  */
  /*
  $('.checkbox-custom').click(function(){
	 setTimeout(function() {
		 checkIfDownloadBarIsActive()
	 })
  })*/
  $('.a-dropdown').click(function(e) {
    e.preventDefault();
    if(!$(this).hasClass('is-active')) {
      $('.a-dropdown').removeClass('is-active')
      setTimeout(function(){$(this).addClass('is-active');}, 100)
    }
	})
	
	//mobile types
	var urlParams = new URLSearchParams(window.location.search);

	if(urlParams.get('type') === 'mobile_apps') {
		$('body').removeClass('with-smartbar')
	}
	//search open

	$('.search-header-mobile').click(function() {
		setTimeout(function(){
			$('.header-search_form .a-smart-search_input').focus()
		}, 500)
	})


});
