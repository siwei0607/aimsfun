/*jshint undef:false */
(function (window, document, $) {
	"use strict";

	window.$ = window.$ = $;
	var pageRefresh = true,
        skills_animated = false,
        scroll_effect_at_once = true; // Effects to be run only one time

	$(document).ready(function () {
		"use strict";

        $('a.page-scroll').on('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });

        /* Initialize Skills */
        if($('html').hasClass('touch')) {
            initSkills();
        }

		var currentScrollPos = 0;
		$('.projects-container').magnificPopup({
			delegate: 'figure', // child items selector, by clicking on it popup will open
			type: 'image',
			// other options
			gallery:{enabled:true},
			callbacks: {
				beforeOpen: function() {
				    currentScrollPos = $('body').scrollTop();
			  	},
				afterClose: function() {
					$('body').scrollTop(currentScrollPos);
				}}
		});

        /* Initialize Google Map */
        $.fn.initialize();

        /* Initialize members slider */
        $('.testimonial-slider').bxSlider({
            maxSlides: 1,
            minSlides: 1,
            moveSlides: 1,
            startSlide: 0,
            slideMargin : 10,
            auto: true,
            autoStart: true,
            autoHover: true,
            nextText: '',
            prevText: '',
            pager : false
        });

        $('#work-list').children().on('click', function() {
            var index = $(this).index();

            $('#projects-viewport').slideDown( "slow", function() {


            });
        });

        $('#close-viewport').on('click', function(){
             $('#projects-viewport').slideUp( 'slow' );
        });

    
    
	});

    $.fn.mdFilters = function(filterWrapper, itemsWrapper) {
        "use strict";
        var itemElemetns = $(itemsWrapper).find('.mix');

        $(filterWrapper).children().on('click', function() {
            var filter = $(this).data('filter');
            $(filterWrapper).children().removeClass('active');
            $(this).addClass('active');

            $(itemElemetns).each(function(){
                if(! $(this).hasClass(filter) )
                {
                    $(this).css({
						'opacity': 0.1,
						'-moz-opacity':0.2, /* Old Mozilla */
						'-khtml-opacity': 0.1, /* Safari 1 */
                        'filter': 'alpha(opacity=10)', /* for IE7 */
						'-ms-filter':'progid:DXImageTransform.Microsoft.Alpha(Opacity=10)', /* for IE8 */

						'-webkit-transform': 'scale(1)',
                        '-moz-transform': 'scale(1)',
						'-ms-transform': 'scale(1)',
                        'transform': 'scale(1)'
                    })
                    .addClass('inactive');
                }
                else {
                     $(this).css({
                        opacity: 1,
                        filter: 'alpha(opacity=100)',
                        '-moz-transform': 'scale(1)',
                        transform: 'scale(1)'
                    })
                    .removeClass('inactive');
                }

                if(filter === 'all') {
					$(itemElemetns).css({
                        opacity: 1,
                        filter: 'alpha(opacity=100)',
                        '-moz-transform': 'scale(1)',
                        transform: 'scale(1)'
                    })
                    .removeClass('inactive');
                }
            });
        });
    };

    $.fn.initialize = function () {
		"use strict";

        if( $('#map-canvas').length == 0 ) {
            return false;
        }

		var address = 'Sundgauallee, Freiburg im Breisgau, DE'; // YOUR-ADDRESS-HERE
		var geocoder = new google.maps.Geocoder();

		var settings = {
			zoom : 15, // Map zoom
            scrollwheel: false,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'), settings);

		geocoder.geocode({
			'address' : address
		},
			function (results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				var gm = new google.maps.Marker({
					position : results[0].geometry.location,
					map : map
				});
				map.setCenter(results[0].geometry.location);
			}
		});

		$.fn.mdFilters('#work-filters', '#work-list');
	}

	/* Send contact form to email */
	$('#contact-form').on('submit', function() {
		"use strict";
		$(this).addClass('sending');
		var form_data = $(this).serialize() + '&submit=send';
		window.setTimeout(function() {
			$.ajax({
				type: "POST",
				url: "contact_form.php", // Path to contact_form.php
				data: form_data,
				dataType: 'jsonp'
			})
			.done(function(data){
					$('#callback').html(data.msg).show('slow');
					if(data.status)
					{
						$('#contactform').find('input[type=text], textarea, select').val('');
                        $('#callback').addClass('alert alert-success');
					}
                    else {
                        $('#callback').addClass('alert alert-danger');
                    }
			});
			$('#contact-form').removeClass('sending');
		}, 2000);
		return false;
	});

	$(window).on('load', function() {
		"use strict";

		if( !$('html').hasClass('touch') ) {
		    $('.scroll-effect').each(function(){
		        var effect = $(this).data('scroll-effect');
		        $(this)
		            .removeClass("hidden")
		            .viewportChecker({
		                classToAdd: 'visible animated '+effect,
		                offset: 100
		            });
		    });
		}

        $( window ).on('scroll', function() {
            var w_height = $(window).height(),
                scrollY = window.pageYOffset || window.document.documentElement.scrollTop,
                pm = 50;


            $('.scroll-effect').each(function(){
                if( $(this).hasClass('animated') && !scroll_effect_at_once )
                {
                    var height = $(this).height() > w_height ? $(this).height():w_height,
                        scrollUp = $(this).offset().top - height + pm,
                        scrollDown = $(this).offset().top + height + pm,
                        effect = $(this).data('scroll-effect');
                        
                    if( scrollY < scrollUp || scrollY > scrollDown ) {
                        $(this).removeClass('animated').removeClass('visible').removeClass(effect);
                    }
                    
                    $('body').getNiceScroll().resize();
                }
            });

            if( $('.skills').length > 0 ) {
                if(
                    ($(this).scrollTop() > $('.skills').offset().top-150) &&
                    ($(this).scrollTop() < $('.skills').offset().top-100) &&
                    !skills_animated
                ) {
                    initSkills();
                    skills_animated=true;
                }
            }


            if ($(window).scrollTop() > 50) {
                $(".navbar-fixed-top").addClass("top-nav-collapse");
            }
			else {
                $(".navbar-fixed-top").removeClass("top-nav-collapse");
            }
        });

        $('body').removeClass('loading');

	});

    /* Function for skill level */
	function initSkills() {
		if ($('.progresscircles').length) {
			$('.progresscircles').find('svg').remove();

			$('.progresscircles').each(function(i) {
				var s = $(this);
				var contWidth = s.width();
				var arc = s.find('.arc');
				arc.attr('id', 'arc'+i);

				var amount = $(arc).data('percent');
				var strkw = $(arc).data('stokewidth');
				var sign = $(arc).data('sign');
				var fontSize = $(arc).data('fontsize');
				var circleColor = $(arc).data('circlecolor');
				var strokeInnerColor = $(arc).data('innerstrokecolor');
				var strokeColor = $(arc).data('strokecolor');
				var textColor = $(arc).data('textcolor');
				var circleSize = $(arc).data('size');

				if(parseInt(circleSize, 10)+parseInt(strkw, 10)>contWidth) {
					circleSize = contWidth-strkw;
				}

				var fullSize = parseInt(circleSize, 10)+parseInt(strkw, 10);
				var interval;

                //Create raphael object
				var r = new Raphael('arc'+i, fullSize, fullSize);

				//draw inner circle
				r.circle(fullSize/2, fullSize/2, circleSize/2).attr({ stroke: strokeInnerColor, "stroke-width": strkw*0.6, fill:  circleColor });

				//add text to inner circle
				var title = r.text(fullSize/2, fullSize/2, 0+sign).attr({
					font: 'normal normal 300 ' + fontSize+'px Lato',
					fill: textColor
				}).toFront();

				r.customAttributes.arc = function (xloc, yloc, value, total, R) {

					var alpha = 360 / total * value,
						a = (90 - alpha) * Math.PI / 180,
						x = xloc + R * Math.cos(a),
						y = yloc - R * Math.sin(a),
						path;
					if (total == value) {
						path = [
							["M", xloc, yloc - R],
							["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
						];
					}
                    else {
						path = [
							["M", xloc, yloc - R],
							["A", R, R, 0, +(alpha > 180), 1, x, y]
						];
					}
					return {
						path: path
					};
				};

				//make an arc at 150,150 with a radius of 110 that grows from 0 to 40 of 100 with a bounce
				var my_arc = r.path().attr({
					"stroke": strokeColor,
					"stroke-width": strkw,
					arc: [fullSize/2, fullSize/2, 0, 100, circleSize/2]
				});

				var anim = new Raphael.animation({
					arc: [fullSize/2, fullSize/2, amount, 100, circleSize/2]
				}, 1500, "easeInOut");

				eve.on("raphael.anim.frame.*", onAnimate);

				function onAnimate() {
					var howMuch = my_arc.attr("arc");
					title.attr("text", Math.floor(howMuch[2]) + sign);
				}

				var animateSkills = false;
				var isIE8 = false;

				//if(animateSkills || isIE8)
				//{
					my_arc.animate(anim.delay(i*200));
				//}

			});

		}

	}

    $(window).on('load', function() {
        $('#carousel-example-generic')
            .css({
                overflow: 'hidden',
                height: $(window).height(),
                width: '100%'
            });

        $('.carousel-inner').children().each(function(){
            var theImage = new Image();
                theImage.src = $(this).find('img').attr("src");

            var imageWidth = theImage.width,
                imageHeight = theImage.height,
                windowWidth = $(window).width(),
                windowHeight = $(window).height(),
                imgRation = imageWidth/imageHeight,
                currRation = windowWidth/windowHeight,
                h_const = imageWidth/imageHeight, // w>h
                w_const = imageHeight/imageWidth; // h>w

            if(imgRation<=currRation)
            {
                $(this)
                    .width( windowWidth )
                    .height( windowWidth*w_const );
            }
            else
            {
                var new_width = windowHeight*h_const;
                $(this)
                    .height( windowHeight )
                    .find('img')
                    .css({
                        width: new_width,
                        '-webkit-backface-visibility': 'hidden',
                        position: 'absolute',
                    //    'z-index': -1,
                        'max-width': 'none',
                        height: windowHeight,
                        left: -((new_width-windowWidth)/2),
                        top: 0
                    });
            }
        });

        $('.carousel-inner')
            .find('.carousel-caption')
                .each(function(){
                    var paddingTop = ($(window).height()/2)-70;
                    $(this).css({
                        'padding-top': paddingTop
                    });
                });
    });

})(window, document, jQuery);
