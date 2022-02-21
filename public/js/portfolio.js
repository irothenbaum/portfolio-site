;(function (window, $) {
  let $heroText
  $(window.document).ready(() => {
    $heroText = $('#animate-type')

    animatedHeroText()
  })

  function animatedHeroText() {
    $heroText.next().hide()
    $('#down-arrow').hide()
    $heroText.html('&nbsp;')
    const text = 'Unless you were looking for this'

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
})(window, jQuery)
