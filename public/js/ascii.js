;(function (window, $) {
  let $output
  let $button
  let $fileUpload
  let $fileUrl
  let $outputWidth
  let $textOnly
  let $outputText

  $(window.document).ready(() => {
    $output = $('#output')
    $button = $('#generate-button')
    $fileUpload = $('#file-upload')
    $fileUrl = $('#file-url')
    $outputWidth = $('#output-width')
    $textOnly = $('#text-only')
    $outputText = $('#output-text')

    $textOnly.on('change', () => {
      if ($textOnly.is(':checked')) {
        $outputText.show()
        $output.hide()
      } else {
        $outputText.hide()
        $output.show()
      }
    })

    $button.on('click', () => {
      const width = parseInt($outputWidth.val() || 32)

      $outputText.val('Loading...')
      $output.html('Loading...')
      $.ajax({
        url: window.location,
        method: 'POST',
        data: {
          q: $fileUrl.val(),
          w: width,
        },
        dataType: 'json',
      })
        .done(resp => {
          $output.html(resp.html)
          $outputText.val(resp.text)
          $outputText.attr('rows', resp.meta.height)
          $outputText.attr('cols', resp.meta.width)
        })
        .fail(err => {
          console.error(err)
          $output.html('Error: ' + err.responseText)
          $outputText.val('Error: ' + err.responseText)
        })
    })
  })
})(window, jQuery)
