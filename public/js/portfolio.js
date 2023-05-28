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
        setTimeout(() => $('#down-arrow').show(), 1000)
        return
      }

      setTimeout(recurse, Math.random() * 100 + 10)
    }

    setTimeout(recurse, 1000)
  }

  function configureNavBar() {
    const $navBar = $('#projects-summary')
    $(window).on('scroll', function(e) {
      if (e > window.innerHeight) {
        $navBar.addClass('sticky')
      } else {
        $navBar.removeClass('sticky')
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
