/*
 * 	Easy Zoom 1.0 - jQuery plugin
 *	written by Alen Grakalic	
 *	http://cssglobe.com/post/9711/jquery-plugin-easy-image-zoom
 *
 *	Copyright (c) 2011 Alen Grakalic (http://cssglobe.com)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
 
 /*
 
 Required markup sample
 
 <a href="large.jpg"><img src="small.jpg" alt=""></a>
 
 */
 
(function($) {

	var easyZoomDefaults = {	
			id: 'easy_zoom',
			parent: 'body',
			append: true,
			preload: 'Загрузка...',
			error: 'Невозможно загрузить изображение',
			duration: 'fast',
			winheight: 250,
			winwidth: false,
			cursor: 'crosshair',
		};

	function easyZoom(element, options) {
		this.obj = element;
		this.img = new Image();
		
		this.options = $.extend(easyZoomDefaults, options); 

		this.init();
	}

	$.extend(easyZoom.prototype, {
		loaded: false,		// флаг, изображение загружено
		found: true,		// флаг, изображение не найдено
		small: false, 		// флаг, если высота изображения меньше высоты окна просмотра
		timeout: null,		// таймаут, интервал проверки загрузки изображения
		over: false,		// изображение просматривается
		closeprocess: null,	// изображение скрывается
		w1: null,			// ширина изображения
		w2: null,			// высота ...
		h1: null,			// ширина окна просмотра
		h2: null,			// высота ...
		rw: null,			// отступ изображения от окна просмотра по ширине
		rh: null,			// ... по высоте
		init : function() {

			var z = this;

			var tagName = z.obj.tagName.toLowerCase();
			if(tagName == 'a'){			   
				
				var href = $(z.obj).attr('href');			
				z.img.src = href + '?' + (new Date()).getTime() + ' =' + (new Date()).getTime();
				$(z.img).error(function(){ found = false; })
				z.img.onload = function(){
					if(this.height < z.options.winheight) {
						z.small = false;
						$(z.obj).css('cursor','default').unbind();
					}
					z.loaded = true;
					this.onload=function(){};
				};

				if($(z.obj).attr('data-zoomwidth')) {
					this.options.winwidth = $(z.obj).attr('data-zoomwidth');
				}
				
				$(z.obj)
					.css('cursor',z.options.cursor)
					.click(function(e){ e.preventDefault(); })
					.mouseenter(function(e){ z.start(e); })
					.mouseleave(function(){ z.hide(); })		
					.mousemove(function(e){ z.move(e); });
			};

		},
		start: function(e) {
			var z = this;
			z.hide();

			if(!$('#'+ z.options.id).length) {
				var zoom = $('<div id="'+ z.options.id +'">'+ z.options.preload +'</div>').css({'opacity':0});

				if(this.options.winwidth) {
					zoom.css({'width':this.options.winwidth+'px'});
				}

				if(z.options.append) {
					zoom.appendTo(z.options.parent)
				} else {
					zoom.prependTo(z.options.parent)
				};
			}
			if(!z.found){
				z.error();
			} else {
				if(z.loaded){
					z.show(e);
				} else {
					z.loop(e);
				};
			};
		},
		loop: function(e) {
			var z = this;
			if(z.loaded){
				z.show(e);
				clearTimeout(z.timeout);
			} else {
				z.timeout = setTimeout(function(){z.loop(e)},200);
			};
		},
		show: function(e) {
			var z = this;

			if(z.small) return;

			z.over = true;
			z.closeprocess = false;
			$('#'+ z.options.id).stop();
			$(z.img).css({'position':'absolute','top':'0','left':'0'});
			$('#'+ z.options.id)
				.html('')
				.append(z.img)
				.fadeTo(z.options.duration, 1);
			z.w1 = $('img', z.obj).width();
			z.h1 = $('img', z.obj).height();
			z.w2 = $('#'+ z.options.id).width();
			z.h2 = $('#'+ z.options.id).height();
			z.w3 = $(z.img).width();
			z.h3 = $(z.img).height();	
			z.w4 = $(z.img).width() - z.w2;
			z.h4 = $(z.img).height() - z.h2;	
			z.rw = z.w4/z.w1;
			z.rh = z.h4/z.h1;
			z.move(e);
		},
		hide: function() {
			var z = this;

			if(z.small) return;

			z.closeprocess = true;
			$('#'+ z.options.id).stop().fadeOut(z.options.duration, function(){
				z.closeprocess = false;
				z.over = false;
				$('#'+ z.options.id).html('');
			})
		},
		error: function() {
			var z = this;
			$('#'+ z.options.id).html(z.options.error);
		},
		move: function(e) {
			var z = this;
			if(z.over && !z.small){
				// target image movement
				var p = $('img',z.obj).offset();
				var pl = e.pageX - p.left;
				var pt = e.pageY - p.top;	
				var xl = pl*z.rw;
				var xt = pt*z.rh;
				xl = (xl>z.w4) ? z.w4 : xl;
				xt = (xt>z.h4) ? z.h4 : xt;	
				//console.log('xl:'+xl+' xt:'+xt);
				$('#'+ z.options.id + ' img').css({'left':xl*(-1),'top':xt*(-1)});
			};
		}
	}, {});
		  
	$.fn.easyZoom = function(options){
		this.each(function(){ 
			var zoom = new easyZoom(this, options);
		});
	};

})(jQuery);
