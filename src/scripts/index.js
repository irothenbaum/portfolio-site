;(function ($, window, undefined) {
  $(document).ready(function () {
    $('.item').click(function (e, elem) {
      const $elem = $(this).closest('.item')

      if ($elem.hasClass('selected')) {
        $elem.removeClass('selected')
      } else {
        $elem.addClass('selected')
        $elem.siblings().removeClass('selected')
      }
    })
  })
})(jQuery, window)
