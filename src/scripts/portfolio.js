;(function (window, $) {
  const navOpenCache = localStorage['navOpenCache']
    ? JSON.parse(localStorage['navOpenCache'])
    : // by default, open the first level of nav
      {'nav-portfolio': true}

  $(window.document).ready(() => {
    // initialize nav open state
    for (const key in navOpenCache) {
      if (navOpenCache[key]) {
        $(`#${key}`).addClass('open')
      }
    }

    // bind click event to nav items
    $('#navigation .folder').click(function (e) {
      e.stopPropagation()
      if (e.target === this || $(e.target).parent()[0] === this) {
        const $container = $(this).parent()
        $container.toggleClass('open')

        const pathname = $container.attr('id')
        if ($container.hasClass('open')) {
          navOpenCache[pathname] = true
        } else {
          navOpenCache[pathname] = false
        }

        localStorage['navOpenCache'] = JSON.stringify(navOpenCache)
      }
    })
  })
})(window, jQuery)
