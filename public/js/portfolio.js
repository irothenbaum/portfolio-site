;(function (window, $) {
  let $heroText
  $(window.document).ready(() => {
    $heroText = $('#animate-type')

    animatedHeroText()
    configureNavBar()
    configureBacklitSection()
  })

  function animatedHeroText() {
    const text = $heroText.text()
    let $container = $heroText.parent()
    $container.css({
      height: $container.height(),
      width: $container.width(),
    })

    $heroText.next().hide()
    $('#down-arrow').hide()

    $heroText.text('')

    $container.css({opacity: 1})

    const recurse = () => {
      const currentText = $heroText.text()
      const nextText = text.substring(0, currentText.length + 1)
      $heroText.text(nextText)

      if (nextText.length === text.length) {
        $heroText.next().show()
        setTimeout(() => $('#down-arrow').show(), 500)
        return
      }

      setTimeout(recurse, Math.random() * 100 + 10)
    }

    setTimeout(recurse, 3000)
  }

  function configureNavBar() {
    const $navBar = $('#projects-summary-container')
    const $window = $(window)

    // should resize on resize
    const breakPoints = []
    const $portfolioPieces = $('#projects-section ul li')
    $portfolioPieces.each((i, e) => {
      const $elem = $(e)
      breakPoints.push({
        top: $elem.offset().top,
        bottom: $elem.innerHeight() + $elem.offset().top,
      })
    })

    $window.on('scroll', () => {
      const scrollPos = $window.scrollTop()
      if (scrollPos > window.innerHeight) {
        $navBar.addClass('sticky')
      } else {
        $navBar.removeClass('sticky')
      }

      const scrollCenter = scrollPos + window.innerHeight / 2
      const activeIndex = breakPoints.findIndex(points => {
        return scrollCenter >= points.top && scrollCenter <= points.bottom
      })

      $navBar.find('a').removeClass('active')

      if (activeIndex >= 0) {
        $navBar.find('a').eq(activeIndex).addClass('active')
      }
    })
  }

  function configureBacklitSection() {
    const $container = $('#backlit')
    const $button = $('#backlit-button')

    $button.on('mouseenter touchstart', () => {
      $container.addClass('light')
    })
    $button.on('mouseleave touchend', () => {
      $container.removeClass('light')
    })
  }
})(window, jQuery)
