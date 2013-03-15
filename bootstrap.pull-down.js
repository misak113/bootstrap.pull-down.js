
(function ($) {
	
	var pullDown = function () {
		var self = this;
		this.enabled = true;
		this.container = $('body');

		var lastMoveEvent = null;
		var nowMoveEvent = null;
		var moving = false;

		var TOUCHSTART = 'touchstart mousedown';
		var TOUCHMOVE = 'touchmove mousemove';
		var TOUCHEND = 'touchend mouseup';

		var movingDuration = function (ev) {
			lastMoveEvent = nowMoveEvent;
			nowMoveEvent = ev;
		};
		var movingStart = function (ev) {
			moving = true;
		};
		var movingEnd = function (ev) {
			lastMoveEvent = null;
			nowMoveEvent = null;
			moving = false;
		};

		var prepare = function () {
			// bind store moving
			self.container.unbind(TOUCHMOVE, movingDuration).on(TOUCHMOVE, movingDuration);
			// Mouse fix
			self.container.unbind(TOUCHSTART, movingStart).on(TOUCHSTART, movingStart);
			self.container.unbind(TOUCHEND, movingEnd).on(TOUCHEND, movingEnd);
		};

		this.start = function (pullDown) {
			prepare();

			// Když je vypnuto
			if (self.enabled === false) return;

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
			pullDown.find('.stop').unbind('click');

			statusUpdate(pullDown);
		};

		this.stop = function (pullDown) {

			// turn-on css
			pullDown.removeClass('turn-on');

			// on scroll do
			self.container.unbind(TOUCHMOVE);
			self.container.unbind(TOUCHEND);
			pullDown.find('.stop').unbind('click').on('click', function (ev) {
				ev.preventDefault();
				stopWorking(ev, pullDown);
			});

			pullDown.find('.work').unbind('click').on('click', function (ev) {
				ev.preventDefault();
				eventTriggerPullDown(pullDown);
				pullDown.addClass('working');
				self.stop(pullDown);
			});
		};

		this.restart = function (pullDown) {
			self.stop(pullDown);
			self.start(pullDown);
		};

		var scrollAction = function (ev, pullDown) {
			var scrollTop = getScrollUp();
			var deltaY = getDeltaY(ev);
			var marginTop = getMarginTop(pullDown);
			if (scrollTop == 0 
				&& marginTop+deltaY > -getHeightPullDown(pullDown)
				) {
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
				hidePullDownAbove(pullDown);
				self.stop(pullDown);
			} else if (pullDown.hasClass('down')) {
				hidePullDown(pullDown);
			}
			statusUpdate(pullDown);
		};

		var statusUpdate = function (pullDown) {
			var pullDownMarginTop = getMarginTop(pullDown);

			if (pullDownMarginTop > 0) {
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
			$(pullDown).animate({marginTop: -height}, 500);
		};
		var hidePullDownAbove = function (pullDown) {
			var height = getHeightPullDown(pullDown);
			$(pullDown).animate({marginTop: 0}, 500);
		};

		var getHeightPullDown = function (pullDown) {
			return pullDown.height();
		};

		var getScrollUp = function () {
			return $(window).scrollTop();
		};

		var stopWorking = function (ev, pullDown) {
			eventTriggerStopWorking(ev, pullDown);
			pullDown.removeClass('working');
			self.start(pullDown);
		};

		var eventTriggerStopWorking = function (ev, pullDown) {
			pullDown.trigger('pullDownStopWorking', ev);
		};

		var eventTriggerPullDown = function (pullDown) {
			var ev = jQuery.Event("pullDown");
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
			return deltaY;
		};

		prepare();

	};
	// add to jQuery
	$.pullDown = new pullDown();

	$(document).ready(function () {
		$.pullDown.container = $('.ng-view'); // @todo moveout of library
		var pullDown = $('.pull-down');
		$.pullDown.restart(pullDown);
	});

})(jQuery);