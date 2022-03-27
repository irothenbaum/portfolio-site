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
  const CLASS_spin = 'fa-spin'
  const CLASS_open = 'open'
  const spinDuration = 200

  let settingsOpenTimeout
  let $light
  let $settingsButton
  let $settingsContainer
  let $colorWheel
  let $colorPreview

  $(window.document).ready(() => {
    configureLight($('body'))
    configureSettingsButton($('#settings-button'))
    configureColorWheel($('#color-wheel'))
    configureSettingsContainer($('#settings-container'))
    configureColorPreview($('#color-preview'))
    setBacklitColor(colors[0])

    $(window).on('keydown', ev => {
      console.log(ev.key)
      if (['Escape', ' ', 'Enter'].includes(ev.key)) {
        $settingsButton.click();
      }
    })
  })

  // --------------------------------------------------

  function configureColorWheel($e) {
    $colorWheel = $e
    let canvas = $colorWheel[0]
    let context = canvas.getContext('2d')
    context.canvas.width = $colorWheel.width()
    context.canvas.height = $colorWheel.height()

    const wedgeSize = TAU / colors.length
    canvas.addEventListener('click', event => {
      const center = context.canvas.width / 2
      const mousePos = oMousePos(canvas, event)
      const mouseAngle = (angle(center, center, mousePos.x, mousePos.y) + TAU) % TAU

      const wedgeIndex = Math.floor(mouseAngle / wedgeSize)
      console.log(mousePos, mouseAngle, wedgeIndex)
      setBacklitColor(colors[wedgeIndex])
    })

    let wedges = colors.map((c, i, a) => createWedge(context, c, i, a))
  }

  function configureLight($e) {
    $light = $e
  }

  function configureSettingsButton($e) {
    $settingsButton = $e

    $settingsButton.click(() => {
      if (settingsOpenTimeout) {
        return
      }

      $settingsButton.addClass(CLASS_spin)
      $settingsContainer.toggleClass(CLASS_open)
      settingsOpenTimeout = setTimeout(() => {
        $settingsButton.removeClass(CLASS_spin)
        settingsOpenTimeout = null
      }, spinDuration)
    })
  }

  function configureSettingsContainer($e) {
    $settingsContainer = $e
  }

  function configureColorPreview($e) {
    $colorPreview = $e
  }

  // -----------------------------------------------
  /**
   * @param {string} color
   */
  function setBacklitColor(color) {
    $colorPreview.css({backgroundColor: color})
    $light.css({backgroundColor: color})
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