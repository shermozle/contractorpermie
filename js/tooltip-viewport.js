/**
 * Keeps Bootstrap 2 tooltips inside the viewport on narrow screens.
 */
(function ($) {
	var VIEWPORT_MARGIN = 12;
	var DEFAULT_TIP_WIDTH = 200;

	function measureTip($tip) {
		if (!$tip || !$tip.length) {
			return { width: DEFAULT_TIP_WIDTH, height: 40 };
		}

		var wasHidden = !$tip.is(':visible') || $tip.css('display') === 'none';
		if (wasHidden) {
			$tip.appendTo(document.body).css({
				position: 'absolute',
				visibility: 'hidden',
				display: 'block',
				top: -9999,
				left: -9999
			});
		}

		var size = { width: $tip.outerWidth(), height: $tip.outerHeight() };

		if (wasHidden) {
			$tip.detach().css({
				position: '',
				visibility: '',
				display: '',
				top: '',
				left: ''
			});
		}

		return size;
	}

	window.resolveTooltipPlacement = function (tip, element) {
		var rect = element.getBoundingClientRect();
		var tipSize = measureTip($(tip));
		var tipW = tipSize.width;
		var tipH = tipSize.height;
		var vw = window.innerWidth;
		var vh = window.innerHeight;

		if (rect.right + tipW + VIEWPORT_MARGIN <= vw) {
			return 'right';
		}
		if (rect.left - tipW - VIEWPORT_MARGIN >= 0) {
			return 'left';
		}
		if (rect.bottom + tipH + VIEWPORT_MARGIN <= vh) {
			return 'bottom';
		}
		if (rect.top - tipH - VIEWPORT_MARGIN >= 0) {
			return 'top';
		}
		return 'bottom';
	};

	window.clampTooltipInViewport = function ($tip) {
		if (!$tip || !$tip.length) {
			return;
		}

		var margin = VIEWPORT_MARGIN;
		var pos = $tip.offset();
		var tipW = $tip.outerWidth();
		var tipH = $tip.outerHeight();
		var scrollLeft = $(window).scrollLeft();
		var scrollTop = $(window).scrollTop();
		var minLeft = scrollLeft + margin;
		var maxLeft = scrollLeft + $(window).width() - tipW - margin;
		var minTop = scrollTop + margin;
		var maxTop = scrollTop + $(window).height() - tipH - margin;
		var left = Math.min(Math.max(pos.left, minLeft), maxLeft);
		var top = Math.min(Math.max(pos.top, minTop), maxTop);

		if (left !== pos.left || top !== pos.top) {
			$tip.offset({ top: top, left: left });
		}
	};

	function patchTooltipShow() {
		var Tooltip = $.fn.tooltip.Constructor;
		if (Tooltip.prototype.show.__viewportPatched) {
			return;
		}

		var originalShow = Tooltip.prototype.show;
		Tooltip.prototype.show = function () {
			originalShow.apply(this, arguments);
			if (this.$tip && this.$tip.hasClass('in')) {
				clampTooltipInViewport(this.$tip);
			}
		};
		Tooltip.prototype.show.__viewportPatched = true;
	}

	window.initViewportTooltips = function (selector) {
		patchTooltipShow();
		$(selector).tooltip({ placement: resolveTooltipPlacement });
		$(window).on('resize orientationchange', function () {
			$('.tooltip.in').each(function () {
				clampTooltipInViewport($(this));
			});
		});
	};
})(jQuery);
