;(function (window, $) {
  // const $renderCover = $('#render-cover')
  // $renderCover.addClass('fade-out')
  // setTimeout(() => {
  //   $renderCover.remove()
  // }, 500)

  $(window.document).ready(() => {
    configureNav()

    // configureIDELines()
  })

  // ----------------------------------------------------------------------
  // IDE line styling
  // ----------------------------------------------------------------------

  function configureIDELines() {
    let totalLines = 0
    $('[data-ide-lines]').each(function () {
      const $line = $(this)
      console.log($line)
      let lineValue = $line.data('ide-lines') || 1
      if (lineValue === 'auto') {
        // TODO: determine dynamic number of lines (i.e., for paragraph tags)
        console.log(
          'TODO: determine dynamic number of lines (i.e., for paragraph tags)',
        )
        lineValue = 1
      }

      const lineNumberContainer = $(
        '<div class="ide-line-number-container"></div>',
      )
      const toAppend = []
      for (let i = 0; i < lineValue; i++) {
        const lineNum = totalLines + i + 1
        toAppend.push(
          `<span class="ide-line-number" data-ide-line-number="${lineNum}">${lineNum}</span>`,
        )
      }
      lineNumberContainer.append(toAppend.join(''))

      totalLines += lineValue
      $line.prepend(lineNumberContainer)
    })
  }

  // ----------------------------------------------------------------------
  // Navigation interactions
  // ----------------------------------------------------------------------

  const navOpenCache = localStorage['navOpenCache']
    ? JSON.parse(localStorage['navOpenCache'])
    : // by default, open the first level of nav
      {'nav-portfolio': true}
  function configureNav() {
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
  }
})(window, jQuery)
