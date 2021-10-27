$(document).ready(function () {
  // Keep Bootstrap Dropdown Open
  $('.dropdown.keep-open').on({
    "shown.bs.dropdown": function () { this.closable = false; },
    "click": function () { this.closable = true; },
    "hide.bs.dropdown": function () { return this.closable; }
  });

  // Make page unscrollable when mobile menu is open
  $('.navbar-toggle').click(function () {
    $('body').toggleClass('menu-open');
  });

  // Hide mobile menu when opening search panel
  $('.navbar-search').on('show.bs.dropdown', function () {
    if ($('body').hasClass('menu-open')) {
      $(".navbar-toggle").trigger("click");
    }
  });

  // Toggle class checked after clicking button.
  $('.i_btn a').click(function (e) {
    $(this).toggleClass('checked');
    e.preventDefault();
  });

  // Remove class checked for all .i_btn's button.
  $('.i_select a').click(function (e) {
    $(this).parent().siblings().find('a').removeClass('checked');
    e.preventDefault();
  });

  //Dynamic affix offset for responsive
  $('#InnerNav').affix({
    offset: {
      top: function () { return $('#Header').height() + $('#Top').outerHeight() }
    }
  });
  $('#InnerNav').on('affixed.bs.affix', function () {
    $(this).next().addClass('padding_affixed');
  });
  $('#InnerNav').on('affixed-top.bs.affix', function () {
    $(this).next().removeClass('padding_affixed');
  });
  // Scrollable Tab Navigation on mobile
  $('.inner_nav_wrapper').horizontalTabs();

  $(".user_list li a").on('mouseenter mouseleave', function (e) {
    if ($('.user_hover', this).length) {
      var elm = $('.user_hover', this);
      var off = elm.offset();
      var l = off.left;
      var w = elm.width();
      var docH = $('.data_contributions').height();
      var docW = $('.data_contributions').width();

      var isEntirelyVisible = (l + w <= docW);

      if (!isEntirelyVisible) {
        $(this).addClass('edge');
      } else {
        $(this).removeClass('edge');
      }
    }
  });
  // Chart Default Font Family
  Chart.defaults.global.defaultFontFamily = "'museo_sans',sans-serif";



  //Knowledge Breakdown Bar - Define by value added on ladt td automatically
  function breakDown() {
    $('.bar_fill').attr('class', 'bar_fill');

    $('.table_breakdown').each(function () {
      var oldValue = 0,
        currentValue = 0,
        $highest;
      var $trs = $(this).find('tr');

      $trs.each(function (index, element) {
        $(this).find('td:last-child').each(function () {
          if (currentValue > oldValue)
            oldValue = currentValue;
          currentValue = parseFloat($(this).html());
          if (currentValue > oldValue) {
            $highest = $(this);
            $highest.siblings().find('.bar_fill').width(100 + '%');
          }
          if ('$(this).html() * 100 / $highest.html())' < 66.6666) {
            $(this).siblings().find('.bar_fill').addClass("light");
          }
          if ('$(this).html() * 100 / $highest.html())' < 33.3333) {
            $(this).siblings().find('.bar_fill').addClass("lighter");
          }
          else {
            $(this).siblings().find('.bar_fill').width($(this).html() * 100 / $highest.html() + '%');
          }
        });
        $(this).find('.bar_fill').each(function () {
          var width = $(this).width();
          var parentWidth = $(this).parent().width();

          var percent = 100 * width / parentWidth;
          if (percent > 50 && percent < 75) {
            $(this).addClass("light");
          }
          if (percent > 25 && percent < 50) {
            $(this).addClass("lighter");
          }
          if (percent < 25) {
            $(this).addClass("lightest");
          }
        });
      });
    });
  } breakDown();

  $('.data_tab_nav a').on('shown.bs.tab', breakDown);
});
