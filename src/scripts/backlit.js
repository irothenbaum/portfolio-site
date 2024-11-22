(function($, window) {
  const colors = [
    '#9900ff',
    '#d000ff',
    '#ff00ea',
    '#ff0073',
    '#ff2f00',
    '#ff7c00',
    '#ffae00',
    '#ffea00',
    '#b7ff00',
    '#00ffb2',
    '#00eaff',
    '#00b1ff',
    '#4c4fff',
    '#7300ff',
    '#000',
    '#000fff',
    '#ff0000',
    '#00ff00',
    '#ffffff',
  ]
  const TAU = Math.PI * 2
  const CLASS_cursor = 'special-cursor'
  const CLASS_spin = 'fa-spin'
  const CLASS_open = 'open'
  const CACHE_color = 'backlit-color'
  const spinDuration = 200

  let settingsOpenTimeout
  let $light
  let $settingsButton
  let $settingsContainer
  let $colorWheel
  let $colorPreview
  let $eyeDropper

  $(window.document).ready(() => {
    configureLight($('body'))
    configureSettingsButton($('#settings-button'))
    configureColorWheel($('#color-wheel'))
    configureSettingsContainer($('#settings-container'))
    configureColorPreview($('#color-preview'))
    configureEyeDropper($('#eye-dropper'))
    setBacklitColor(localStorage[CACHE_color] || colors[Math.floor(Math.random()) * colors.length])

    $(window).on('keydown', () => $settingsButton.click())
    $(window).click((e) => {
      e.stopPropagation()
      $settingsButton.click()
    })

    $('.modal').click(ev => {
      ev.stopPropagation()
    })
  })

  // --------------------------------------------------

  function configureColorWheel($e) {
    $colorWheel = $e
    let canvas = $colorWheel[0]
    let context = canvas.getContext('2d')
    context.canvas.width = $colorWheel.width()
    context.canvas.height = $colorWheel.height()

    // determine size of each wedge
    const wedgeSize = TAU / colors.length

    // create our color slices
    colors.forEach((c, i, a) => createWedge(context, c, i, a))

    // handle clicking a color slice
    canvas.addEventListener('click', event => {
      if (!$settingsContainer.hasClass(CLASS_open)) {
        return
      }

      const center = context.canvas.width / 2

      // determine angle of click from cetner
      const mousePos = oMousePos(canvas, event)
      const mouseAngle = (angle(center, center, mousePos.x, mousePos.y) + TAU) % TAU

      // determine which wedge that would be in our array
      const wedgeIndex = Math.floor(mouseAngle / wedgeSize)

      // set the color
      setBacklitColor(colors[wedgeIndex])
    })

    // handle cursor change
    canvas.addEventListener('mouseenter', () => {
      $colorWheel.addClass(CLASS_cursor)
      $eyeDropper.show()
    })
    canvas.addEventListener('mouseleave', () => {
      $colorWheel.removeClass(CLASS_cursor)
      $eyeDropper.hide()
    })

   // handle placing the eye dropper
   canvas.addEventListener('mousemove', event => {
     const mousePo = oMousePos(canvas, event)
     $eyeDropper.css({
       left: mousePo.x + 3,
       top: mousePo.y - $eyeDropper.height() - 3,
     })
   })
  }


  function configureLight($e) {
    $light = $e
  }

  function configureSettingsButton($e) {
    $settingsButton = $e

    $settingsButton.click(ev => {
      if (ev) {
        ev.stopPropagation()
      }
      if (settingsOpenTimeout) {
        return
      }

      settingsOpenTimeout = setTimeout(() => {
        $settingsButton.removeClass(CLASS_spin)
        settingsOpenTimeout = null
      }, spinDuration)
      $settingsButton.addClass(CLASS_spin)
      $settingsContainer.toggleClass(CLASS_open)
    })
  }

  function configureSettingsContainer($e) {
    $settingsContainer = $e
  }

  function configureColorPreview($e) {
    $colorPreview = $e
  }

  function configureEyeDropper($e) {
    $eyeDropper = $e
  }

  // -----------------------------------------------
  /**
   * @param {string} color
   */
  function setBacklitColor(color) {
    $colorPreview.css({backgroundColor: color})
    $light.css({backgroundColor: color})
    // $eyeDropper.css({fill: color})
    window.localStorage[CACHE_color] = color
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @param {string} color
   * @param {number} index
   * @param {Array<string>} allColors
   */
  function createWedge(context, color, index, allColors) {
    const radius = context.canvas.width / 2
    const arcDistance = TAU / allColors.length
    context.beginPath()
    context.moveTo(radius, radius)
    context.fillStyle = color
    context.arc(radius, radius, radius * 0.95, index * arcDistance, (index + 1) * arcDistance)
    context.fill()
    context.closePath()
  }

  function oMousePos(canvas, evt) {
    let ClientRect = canvas.getBoundingClientRect();
    return {
      x: Math.round(evt.clientX - ClientRect.left),
      y: Math.round(evt.clientY - ClientRect.top)
    }
  }

  function angle(cx, cy, ex, ey) {
    let dy = ey - cy;
    let dx = ex - cx;
    return Math.atan2(dy, dx);
  }

})(jQuery, window)