var infiniteLoad=function(){var t=function(t,a){if(""!=t&&void 0!==t){$("#"+t.replace(/-/g,"")).prop("checked",!0),$(".JS__filter-dropdown").addClass("has-filter");var e=$(".JS__filter-dropdown .badge").text();""===e&&(e=0),$(".JS__filter-dropdown .badge").html(parseInt(e)+1),$('ul.m-filter__dropdown-modal__header-tab li a[data-target="'+a+'"]').append('<span class="badge">1</span>')}},a=function(){for(var t,a=[],e=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),o=0;o<e.length;o++)t=e[o].split("="),a.push(t[0]),a[t[0]]=t[1];return a},e={api:"",startPage:0,postsPerPage:4},o=document.querySelector("#infinite-list"),n=$(".btn-load-more"),i=$("body"),r=function(t){return'\n    <div class="col-xs-12 col-sm-12 col-md-3 infinite-promo" id="promo-'.concat(t.ID,'">\n      <div class="a-card a-card--small shine--load shadow0">\n        <a target ="_blank" href="').concat(t.url,'">\n          <div class="a-card--img shine">\n            <img src="').concat(t.ThumbnailImage,'" alt="image">\n            <div class="a-card--logo shine">\n              <img src="').concat(t.IconPromo,'" alt="image logo">\n            </div>\n          </div>\n          <div class="a-card--content">\n            <div class="a-card--title shine">\n              <p class="a-text a-text--ellipsis a-text-subtitle mt-8">').concat(t.Title).concat('</p>\n            </div>\n            <div class="a-card--action shine">\n              <p class="a-text a-text-small mt-16">\n                <div><i class="a-system-icon icon-clock"></i><span class="a-text a-text-micro">').concat(t.PromoDurationThumbail,"</span></div>\n              </p>\n            </div>\n          </div>\n        </a>\n      </div>\n    </div>")},l=!1,s=function(t){var a=$(".a-card");setTimeout(function(){a.length&&$(".shine--load").removeClass("shine--load")},2e3),e.startPage+=1;e.startPage,e.postsPerPage;var i=function(t){l=!0;var a="/api/promo/getpromo";"criteria"==$(".land-promo").data("mode")&&(a="/api/promo/GetPromoCriteria",t={dsID:$(".land-promo").data("dsid"),filter:promoRender.getfiltervalue(),page:$(".land-promo").data("page"),take:$(".land-promo").data("take"),pID:$(".land-promo").data("pid")}),$.ajax({url:a,type:"POST",data:JSON.stringify(t),dataType:"json",contentType:"application/json; charset=utf-8",beforeSend:function(t){if($("[name=__RequestVerificationToken]").length>0){var a=$("[name=__RequestVerificationToken]").val();t.setRequestHeader("__RequestVerificationToken",a)}},success:function(a){var e=infiniteLoad.checkRepeat($("#promoSearching").val(),__totalresult=a.TotalResult);if(1==e&&(__totalresult=0),promo.showResultText($("#promoSearching").val(),__totalresult),a.IsCompleted&&a.Data.length>0&&0==e){$(".land-promo").data("posts-length",a.Data.length);var n=function(t){for(var a="",e=0;e<t.length;e+=1){var o=t[e];a+=r(o)}return a}(a.Data);o.innerHTML+=n,$(".land-promo").data("page",t.page+1),promo.showInfinite(),!(a.Data.length<t.take)}else 1==$(".land-promo").data("page")||" 1"==$(".land-promo").data("page")?promo.showNoResult():$(".land-promo").data("page")>1&&a.Data.length<=0&&($(".land-promo").data("page",t.page+1),promo.showInfinite(),!1)},error:function(t){}}).done(function(t){$(".land-promo").data("reset",!1);var a=$(".land-promo").data("take");t.Data.length<a?n.addClass("hide"):n.removeClass("hide"),setTimeout(function(){l=!1,$(".shine--load").removeClass("shine--load")},100)})};o&&(l||function(t){var a=$(".land-promo").data("near"),e=null;if("true"==a||1==a)bca.modules.lokasi.getCurrentLocation(function(t){lat=t.lat,lng=t.lng,e={longitude:lng,latitude:lat};var a=$("#promoSearching").val(),o={dsID:$(".land-promo").data("dsid"),filter:{DaerahPromoID:promoRender.getfilter(".cklocation"),LOBID:promoRender.getfilter(".ckcategory"),Product:promoRender.getfilter(".ckproduct"),Keyword:a},page:$(".land-promo").data("page"),take:$(".land-promo").data("take"),pID:$(".land-promo").data("pid"),loc:e};i(o)});else{var o=$("#promoSearching").val(),n={dsID:$(".land-promo").data("dsid"),filter:{DaerahPromoID:promoRender.getfilter(".cklocation"),LOBID:promoRender.getfilter(".ckcategory"),Product:promoRender.getfilter(".ckproduct"),Keyword:o},page:$(".land-promo").data("page"),take:$(".land-promo").data("take"),pID:$(".land-promo").data("pid")};i(n)}}())};if(o){i[0].classList.value.includes("popup-disclaimer-show");var d=$(".promo-search--wrapper"),c=$(".m-filter__action"),p=$(".m-filter__wrapper");$(window).scroll(function(){var t=$(window).scrollTop(),a=function(){return window.screen.availWidth>560?$(document).height()-$(window).height()-140:window.screen.availWidth<560?$(document).height()-$(window).height()-560:void 0},e=t+50,o=$(document.getElementById("infinite-list").childElementCount)[0],n=$(".land-promo").data("posts-length"),r=$(".popup--disclaimer").outerHeight();if(d.length>0){var l=d.offset().top;i[0].classList.value.includes("popup-disclaimer-show")?t>=l+r-140?(p.addClass("fixed--popup"),d.css({position:"relative",height:"58px"})):t<=l&&(p.removeClass("fixed--popup"),d.removeAttr("style"),c.removeAttr("style")):t>=l-58?(p.addClass("fixed"),d.css({position:"relative",height:"58px"}),c.removeClass("hide-filter")):t<=l&&(p.removeClass("fixed"),d.removeAttr("style"))}e>a()&&o<3*n?(!0,s()):(a()>3500||o>3*n)&&!1,o==3*n&&$(".btn-load-more").removeClass("none")})}return{init:function(t){var a;s(),n&&n.on("click",function(t){$(".btn-load-more span").addClass("hide"),$("#loader").addClass("is-active"),setTimeout(function(){$(".btn-load-more span").removeClass("hide"),$(".btn-load-more span").removeClass("none"),$("#loader").removeClass("is-active"),!0,s()},2e3),t.preventDefault()}),(a=$(".scroll-indicator")).length>0&&(i[0].classList.value.includes("popup-disclaimer-show")?a.css({top:"calc(100vh - 60)"}):a.removeAttr("style"))},initquerystring:function(){var e=a();t(e.p,"product"),t(e.c,"category"),t(e.l,"location")},checkRepeat:function(t){if(""!=t){for(var a=t.split(""),e=0,o=0;o<a.length;o++)a[0]!==a[o]&&"!"!=a[o]&&"&"!=a[o]&&"*"!=a[o]&&"-"!=a[o]||"&"!=a[0]&&"!"!=a[0]&&"*"!=a[0]&&"-"!=a[o]||e++;return a.length==e}return!1}}}(),promo=function(){var t=$(".section-banner");list=$("#listPromo"),resultPositive=$("#resultFilterpositive"),resultNegative=$("#resultFilterNegative"),promoPopuler=$("#promoPopuler");var a=function(){var t=window.screen.availWidth,a=$(".card-carousel-wrapper");a.length&&($(".card-carousel-wrapper").addClass("show").trigger("destroy.owl.carousel").removeClass("owl-carousel owl-loaded owl-hidden"),window.screen.availWidth<480?($(".carousel-load .col-md-4.product-item").css({width:t+"px"}),a.hasClass("autoplay")&&a.owlCarousel({items:1,dots:!0,autoplay:!1,loop:!0})):a.each(function(){$(this).addClass("show").trigger("destroy.owl.carousel").removeClass("owl-carousel owl-loaded owl-hidden")}))},e=function(t){t.addClass("show-promo"),t.removeClass("hide-promo")},o=function(t){t.removeClass("show-promo"),t.addClass("hide-promo")};return{init:function(){},showNoResult:function(){o(t),o(list),o(resultPositive),e(resultNegative),e(promoPopuler)},loadByCoordinate:function(t){var e=t,o=e.attr("dsid"),n=e.data("binding"),i=(e.find(".row"),e.data("radius")),r=$("#card-"+n+" .card-carousel-wrapper");i>0&&bca.modules.lokasi.getCurrentLocation(function(t){$.ajax({url:"/api/promo/SortByCoordinate",type:"POST",data:{dsid:o,longitude:t.lng,latitude:t.lat},success:function(t){if(t.IsCompleted&&t.Data.length>0)for(var a=0;a<t.Data.length;a++)r.append('<div class="col-md-3"><div class="a-card a-card--small shine--load shadow0"><a href="'+t.Data[a].url+'"><div class="a-card--img shine"><img loading="lazy" src="'+t.Data[a].ThumbnailImage+'"><div class="a-card--logo shine"><img loading="lazy" src="'+t.Data[a].IconPromo+'"></div></div><div class="a-card--content"><div class="a-card--title shine"><h2 class="a-text a-text--ellipsis a-text-subtitle">'+t.Data[a].Title+'</h2></div><div class="a-card--action shine"><p class="a-text a-text-small"><i class="a-system-icon icon-clock"></i><span>'+t.Data[a].PromoDurationThumbail+"</span></p></div></div></a></div></div>")},error:function(t){}}).done(function(t){a()})})},showInfinite:function(){var a=$(".land-promo").data("reset"),n=$("#promoSearching").val(),i=promoRender.getfilter(".ckproduct"),r=promoRender.getfilter(".ckcategory"),l=promoRender.getfilter(".cklocation");i.length&&void 0!==i&&"undefined"!=i||r.length&&void 0!==r&&"undefined"!=r||l.length&&void 0!==l&&"undefined"!=l||(a=!0),!0!==a&&"true"!==a&&"undefined"!=a&&void 0!==a||""!=n&&void 0!==n&&"undefined"!=n?o(t):e(t),e(list),o(promoPopuler),o(resultNegative),o(resultPositive)},showResultText:function(a,n){var i=$("#listPromo>.a-text-subtitle"),r=$("#resultFilterNegative>.a-text-subtitle"),l=i.data("msg"),s=i.data("subtitle");l=(l=l.replace("[total]",n)).replace("[keyword]",a),""==a||null==a||"undefined"==a?(e(t),i.text(s),r.css({display:"none"})):(o(t),r.text(l),i.text(l),r.css({display:"block"}))},latestPromoLanding:function(){var t=$("#latestPromoLanding").data("did");$.ajax({type:"GET",url:"/api/promo/SmartbarLatestPromo",data:{idDatasource:t,longitude:0,latitude:0},success:function(t){$.each(JSON.parse(t),function(t,a){a.Title;var e=a.ID,o=a.Title,n=t+1,i='<div class="col-md-3 gtmpromo-'+a.ID+' ">\n\t\t\t\t\t\t\t\t\t\t<div class="a-card a-card--small">\n\t\t\t\t\t\t\t\t\t\t\t<a href="'+a.url+'">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="a-card--img shine">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img loading="lazy" src="'+a.ThumbnailImage+'">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="a-card--logo shine"><img loading="lazy" src="'+a.IconPromo+'"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="a-card--content">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="a-card--title shine">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h3 class="a-text a-text--ellipsis a-text-subtitle">'+a.Title+'</h3>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="a-card--action shine">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p class="a-text a-text-small"><i class="a-system-icon icon-clock"></i><span class="a-text a-text-micro"> '+a.PromoDurationThumbail+"</span></p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>";$("#latestPromoLanding").append(i),$(".gtmpromo-"+e).click(function(){dataLayer.push({event:"promotionengagement",promotion_name:""+o,promotion_id:""+e,promotion_creative:"Promo Terbaru",promotion_location:""+n})})})},error:function(t){}}).done(function(){a()})}}}(),promoRender=function(){var t=function(t){return'\n    <div class="col-xs-12 col-sm-12 col-md-3 infinite-promo" id="promo-'.concat(t.ID,'">\n      <div class="a-card a-card--small shine--load shadow0">\n        <a href="').concat(t.url,'">\n          <div class="a-card--img shine">\n            <img src="').concat(t.ThumbnailImage,'" alt="image">\n            <div class="a-card--logo shine">\n              <img src="').concat(t.IconPromo,'" alt="image logo">\n            </div>\n          </div>\n          <div class="a-card--content">\n            <div class="a-card--title shine">\n              <p class="a-text a-text--ellipsis a-text-subtitle mt-8">').concat(t.Title).concat('</p>\n            </div>\n            <div class="a-card--action shine">\n              <p class="a-text a-text-small mt-16">\n                <div><i class="a-system-icon icon-clock"></i><span class="a-text a-text-micro">').concat(t.PromoDurationThumbail,"</span></div>\n              </p>\n            </div>\n          </div>\n        </a>\n      </div>\n    </div>")};return{getfilter:function(t){var a=$(".land-promo").data("reset"),e=[];if("true"!=a&&!a){var o=document.querySelectorAll(t+":checked");for(var n of o)e.push(n.id.toLowerCase())}return e},getquerystring:function(){for(var t,a=[],e=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),o=0;o<e.length;o++)t=e[o].split("="),a.push(t[0]),a[t[0]]=t[1];return a},renderPostHtml:function(a){for(var e="",o=0;o<a.length;o+=1){var n=a[o];e+=t(n)}return e},config:{api:"",startPage:0,postsPerPage:4},currentLoc:function(){$(".land-promo")},getfiltervalue:function(){var t=$(".land-promo").data("reset"),a=[];return $(".filter-value").each(function(){var e=$(this).prop("type");if("checkbox"==e){if("true"!=t&&!t&&1==$(this).prop("checked")){var o={targetfield:$(this).data("target"),targetvalue:$(this).data("id"),targettype:e};a.push(o)}}else""!=$(this).val()&&(o={targetfield:$(this).data("target"),targetvalue:$(this).val(),targettype:e},a.push(o))}),a}}}(),landpromo=$(".land-promo"),inputPromo=$("#promoSearching");if(landpromo.length>0){var _take=landpromo.data("take");landpromo.data("posts-length",_take),promoRender.currentLoc(),infiniteLoad.initquerystring(),infiniteLoad.init(),$("#promoFormSearch").submit(function(t){t.preventDefault(),inputPromo.blur(),$(".btn-load-more").addClass("none"),setTimeout(function(){$("html, body").animate({scrollTop:$(".promo-search--wrapper").offset().top-80},100)},100),$("#infinite-list").html(""),$(".land-promo").data("page",1),infiniteLoad.init()}),$(".JS_filter-apply").on("click",function(t){$(".btn-load-more").addClass("none"),$(".land-promo").data("page",1),$("#infinite-list").html(""),infiniteLoad.init()}),$(".JS_filter-reset").on("click",function(t){$(".btn-load-more").addClass("none"),$(".land-promo").data("page",1),$(".land-promo").data("reset",!0),$("#infinite-list").html(""),infiniteLoad.init()}),$("#promoSearching").on("keyup blur",function(t){var a=$(this).val();1==infiniteLoad.checkRepeat(a)?$("#promoFormSearch button.submit-form").prop("disabled",!1):($("#promoFormSearch button.submit-form").prop("disabled",!1),13===t.keyCode&&($("#infinite-list").html(""),$(".land-promo").data("page",1),infiniteLoad.init()))})}var promoContainer=$(".promo.container");promoContainer.length>0&&promoContainer.each(function(){promo.loadByCoordinate($(this))}),$("#latestPromoLanding").length>0&&promo.latestPromoLanding();