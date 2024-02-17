$(document).ready(function () {
	$('.tips-produk, .tips-produk-small').select2();
	$(".tips-produk, .tips-produk-small").on("select2:select", function (e) {
		if ($(this).hasClass('modal-trigger')) {
			$(".tips-produk-small.modal-trigger option").each(function () {
				$(this).removeAttr("selected", "selected");
			});
			//renderSlider.renderElement($(this));
		} else {
			$(".tips-button").attr('href', this.value);
		}
		checkPage()

	});
	var selectedGroup = $('.tips-produk-small.modal-trigger');
	if (selectedGroup.length > 0) {
		renderSlider.renderElement($('.tips-produk-small.modal-trigger'));
	}
});
var renderSlider = function () {
	var renderElement = function (_el) {
		_el.find("option[value='" + _el.val() + "']").attr("selected", "selected");
		var dd = $("option:selected", _el), itm = dd.data('children'), _render = '';
		for (var i = 0; i < itm.length; i++) {
			_render += renderSlider.content(itm[i], itm.length);
		}
		var classname = '.carousel-' + dd.data('id');
		$(classname).html('');
		$(classname).append(_render);
		if (itm.length > 0) {
			renderSlider.checkFlazzCarousel();
		}
	};
	var checkFlazzCarousel = function checkFlazzCarousel() {
		var $type = $('.m-check-flazz');
		if ($type.length > 0) {
			$('.m-flazz-carousel').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded owl-hidden');
			$type.owlCarousel({
				items: 1,
				margin: 16,
				responsive: {
					0: {
						items: 1
					},
					600: {
						items: 1,
						margin: 20
					},
					1000: {
						items: 1,
						margin: 22
					}
				},
				responsiveClass: true,
				dots: false,
				//nav:true,
				animateIn: 'fadeIn',
				animateOut: 'fadeOut',
				lazyload: true
			});
		}
	};
	var content = function content(_itm, length) {
		var __step = $('.m-check-flazz').data('step'),
			__steptext = __step + ' ' + _itm.StepInfo + '/' + length;
		var imgclass = '';
		if (_itm.ItemImgUrl == '') {
			imgclass = 'hide';
		}
		var el = '<div class="flazz-wrapper">';
		el += '<div class="row" >';
		el += '<div class="col-md-4 col-xs-12 fr"><img class="' + imgclass + '" loading="lazy" src="' + _itm.ItemImgUrl + '" alt="image"></div>';
		el += '<div class="col-md-8 col-xs-12 col-sm-12">';
		el += '<div class="form-flazz-wrapper">';
		el += '<p class="a-text a text-small a-text-brownish-grey">' + __steptext + '</p>';
		el += '<p class="a-text a-text-hero">' + _itm.Title + '</p>';
		el += '</div>';
		el += '</div>';
		el += '</div>';
		el += '</div>';
		return el;
	};
	return { checkFlazzCarousel: checkFlazzCarousel, content: content, renderElement: renderElement };
}();


