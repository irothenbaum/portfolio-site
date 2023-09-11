const sharp = require('sharp')

// this is the list of characters we will use to represent the image (in order from darkest to lightest)
const ASCII_CHARS =
  '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. '

/**
 * @param {Buffer} imageData
 * @param {number} outputWidth
 * @param {boolean?} invertBrightness
 * @returns {Promise<AsciiImage>}
 */
async function imageToAscii(imageData, outputWidth, invertBrightness = false) {
  // first we load the image
  const img = await sharp(imageData)

  // then we resize it to the desired width
  const size = await img.metadata()
  const ratio = size.width / size.height
  const imageHeight = parseInt(outputWidth / ratio)
  const finalHeight = Math.ceil(imageHeight * 0.66)

  const resized = await img
    .resize({
      width: outputWidth,
      // we divide by 2 since the characters are taller than they are wide
      height: finalHeight,
      fit: 'fill',
    })
    .raw()

  // now we need to convert the pixels to ascii characters
  const redArray = await resized.extractChannel('red').toBuffer()
  const greenArray = await resized.extractChannel('green').toBuffer()
  const blueArray = await resized.extractChannel('blue').toBuffer()
  const brightnessArray = await resized.gamma().grayscale().toBuffer()

  // here we determine the brightest and darkest colors in our image to define out range
  const [minBrightness, maxBrightness] = brightnessArray.reduce(
    (acc, p) => {
      return [Math.min(acc[0], p), Math.max(acc[1], p)]
    },
    [0, 256],
  )
  const brightnessRange = maxBrightness - minBrightness
  // The interval maps our ascii characters to the range of brightness in our image
  const interval = ASCII_CHARS.length / brightnessRange

  const retVal = [...brightnessArray].map((pixel, index) => {
    let thisCharIndex = Math.floor((pixel - minBrightness) * interval)
    // if we're inverting brightness, we change our index to count from the last element
    if (invertBrightness) {
      thisCharIndex = ASCII_CHARS.length - 1 - thisCharIndex
    }
    const thisChar =
      ASCII_CHARS[Math.min(ASCII_CHARS.length - 1, Math.max(0, thisCharIndex))]

    return {
      character: thisChar,
      color: `rgb(${redArray[index]}, ${greenArray[index]}, ${blueArray[index]})`,
      brightness: pixel,
    }
  })

  return {
    characters: retVal,
    meta: {
      width: outputWidth,
      height: finalHeight,
    },
  }
}

/**
 * @param {AsciiImage} image
 * @param {boolean} grayScale
 * @return {string}
 */
function asciiImageToHTML(image, grayScale = false) {
  let buffer = ''
  for (let i = 0; i < image.meta.height; i++) {
    const start = i * image.meta.width
    buffer += `<div>${image.characters
      .slice(start, start + image.meta.width)
      .map(a =>
        grayScale
          ? a.character
          : `<span style="color:${a.color}">${a.character}</span>`,
      )
      .join('')}</div>`
  }
  return buffer
}

/**
 * @param {AsciiImage} image
 * @return {string}
 */
function asciiImageToText(image) {
  let buffer = ''
  for (let i = 0; i < image.meta.height; i++) {
    if (i > 0) {
      buffer += '\n'
    }
    const start = i * image.meta.width
    buffer += `${image.characters
      .slice(start, start + image.meta.width)
      .map(a => a.character)
      .join('')}`
  }
  return buffer
}

/**
 * @typedef AsciiCharacter
 * @property {string} character
 * @property {string} color
 * @property {number} brightness
 */

/**
 * @typedef AsciiImage
 * @property {AsciiCharacter[]} characters
 * @property {{width: number, height: number}} meta
 */

module.exports = {
  imageToAscii,
  asciiImageToText,
  asciiImageToHTML,
}
