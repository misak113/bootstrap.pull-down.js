
(function ($) {
	
	var pullDown = function () {
		var self = this;
		this.enabled = true;
		this.container;

		var lastMoveEvent = null;
		var nowMoveEvent = null;
		var moving = false;

		var TOUCHSTART = 'touchstart mousedown';
		var TOUCHMOVE = 'touchmove mousemove';
		var TOUCHEND = 'touchend mouseup';


		this.start = function (options) {
			if (typeof options === 'undefined') options = {};
			if (typeof options.pullDown === 'undefined') options.pullDown = $('.pull-down');
			if (typeof options.container === 'undefined') {
				this.container = $('body');
			} else {
				this.container = options.container;
			}

			stopListen(options.pullDown);
			listen(options.pullDown);
			return {
				start: self.start,
				enable: function () {
					self.enable(options.pullDown);
				},
				disable: function () {
					self.disable(options.pullDown);
				},
				loading: function (status) {
					self.loading(status, options.pullDown);
				},
				element: options.pullDown,
				container: this.container
			};
		};

		this.enable = function (pullDown) {
			pullDown.removeClass('disabled');
			this.enabled = true;
			this.start();
		};

		this.disable = function (pullDown) {
			pullDown.addClass('disabled');
			this.enabled = false;
			this.start();
		};

		this.loading = function (status, pullDown) {
			if (status === true) {
				pullDown.addClass('working');
				stopListen(pullDown);
				statusUpdate(pullDown);
			} else {
				stopWorking($.Event("pullDownStopWorking"), pullDown);
			}

		};

		var listen = function (pullDown) {
			// Když je vypnuto
			if (self.enabled === false) return unprepare();;
			
			prepare();

			// turn-on css
			pullDown.addClass('turn-on');
			hidePullDown(pullDown);

			// on scroll do
			self.container.on(TOUCHMOVE, function (ev) {
				if (moving === false) return;
				scrollAction(ev, pullDown);
			});
			self.container.on(TOUCHEND, function (ev) {
				// do scrolled action
				scrolledAction(pullDown);
			});
			pullDown.find('.stop').off('click');

			statusUpdate(pullDown);
		};

		var stopListen = function (pullDown) {

			// turn-on css
			pullDown.removeClass('turn-on');
			hidePullDownAbove(pullDown);

			// on scroll do
			self.container.off(TOUCHMOVE);
			self.container.off(TOUCHEND);
			pullDown.find('.stop').off('click').on('click', function (ev) {
				ev.preventDefault();
				moving = false;
				stopWorking(ev, pullDown);
			});

			pullDown.find('.work').off('click').on('click', function (ev) {
				ev.preventDefault();
				eventTriggerPullDown(pullDown);
				pullDown.addClass('working');
				stopListen(pullDown);
			});
		};

		var movingDuration = function (ev) {
			lastMoveEvent = nowMoveEvent;
			nowMoveEvent = ev;
		};
		var movingStart = function (ev) {
			lastMoveEvent = null;
			moving = true;
		};
		var movingEnd = function (ev) {
			lastMoveEvent = null;
			nowMoveEvent = null;
			moving = false;
		};

		var prepare = function () {
			// bind store moving
			self.container.off(TOUCHMOVE, movingDuration).on(TOUCHMOVE, movingDuration);
			// Mouse fix
			self.container.off(TOUCHSTART, movingStart).on(TOUCHSTART, movingStart);
			self.container.off(TOUCHEND, movingEnd).on(TOUCHEND, movingEnd);
		};
		var unprepare = function () {
			// bind store moving
			self.container.off(TOUCHMOVE, movingDuration);
			// Mouse fix
			self.container.off(TOUCHSTART, movingStart);
			self.container.off(TOUCHEND, movingEnd);
		};

		var scrollAction = function (ev, pullDown) {
			var scrollTop = getScrollUp();
			var deltaY = getDeltaY(ev);
			var marginTop = getMarginTop(pullDown);
			if (scrollTop == 0 
				&& marginTop+deltaY > -getHeightPullDown(pullDown)
				) {
				if (typeof document.selection !== 'undefined') document.selection.empty();
    			if (typeof window.getSelection() !== 'undefined') window.getSelection().removeAllRanges()
				ev.preventDefault();
				pullDown.css('margin-top', (marginTop+deltaY)+'px');
				scrollToTop();
				statusUpdate(pullDown);
			}
		};

		var scrolledAction = function (pullDown) {
			if (pullDown.hasClass('pulled')) {
				eventTriggerPullDown(pullDown);
				pullDown.addClass('working');
				stopListen(pullDown);
			} else if (pullDown.hasClass('down')) {
				hidePullDown(pullDown);
			}
			statusUpdate(pullDown);
		};

		var statusUpdate = function (pullDown) {
			var pullDownMarginTop = getMarginTop(pullDown);

			if (pullDownMarginTop > 200) {
				pullDown.addClass('pulled');
			} else {
				pullDown.removeClass('pulled');
			}

			var height = getHeightPullDown(pullDown);
			if (pullDownMarginTop > -height) {
				pullDown.addClass('down');
			} else {
				pullDown.removeClass('down');
			}
		};

		var scrollToTop = function () {
			$('html, body').scrollTop(0);
		};

		var getMarginTop = function (pullDown) {
			return pullDown.outerHeight(true) - pullDown.innerHeight();
		};

		var hidePullDown = function (pullDown) {
			var height = getHeightPullDown(pullDown);
			$(pullDown).animate({marginTop: -height-1}, 500);
		};
		var hidePullDownAbove = function (pullDown) {
			var height = getHeightPullDown(pullDown);
			$(pullDown).animate({marginTop: 0}, 500);
		};

		var getHeightPullDown = function (pullDown) {
			//padding-top se nezapočítáva
			return pullDown.height();
		};
		var getPaddingTop = function (pullDown) {
			return parseInt(pullDown.css('padding-top').replace('px', ''));
		}

		var getScrollUp = function () {
			return $(window).scrollTop();
		};

		var stopWorking = function (ev, pullDown) {
			eventTriggerStopWorking(ev, pullDown);
			pullDown.removeClass('working');
			listen(pullDown);
		};

		var eventTriggerStopWorking = function (ev, pullDown) {
			pullDown.trigger('pullDownStopWorking', ev);
		};

		var eventTriggerPullDown = function (pullDown) {
			var ev = $.Event("pullDown");
			ev.pullDownElement = pullDown;
			self.container.trigger('pullDown', ev);
		};

		var getDeltaY = function (ev) {
			if (lastMoveEvent === null) return 0;

			var touch = ev;
			var lastTouch = lastMoveEvent;
			if (ev.type === "touchmove") {
				// For multitouch mobile
				try {
					touch = ev.originalEvent.targetTouches[0];
					lastTouch = lastMoveEvent.originalEvent.targetTouches[0];
				} catch (e) {
					return 0;
				}
			}

			var deltaY = touch.clientY - lastTouch.clientY;
			// ošetření o podezřele velké skoky
			if (deltaY > 100) return 0;
			return deltaY;
		};

		//prepare();

	};
	// add to jQuery
	$.pullDown = new pullDown();

})(jQuery);