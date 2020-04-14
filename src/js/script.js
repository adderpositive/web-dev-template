// svgforeverybody
(function () {
  window.svg4everybody()
}());

// main
(function () {
  const test = () => 'ahoj světe'
  console.log(test())
}());

(function () {
  const wrapClass = '.js-gallery'
  const $wrap = $(wrapClass)

  const createLightbox = (imageClass) => {
    const options = {
      selector: imageClass,
      loop: true
    }

    return window.GLightbox({ ...options })
  }

  $wrap.each((index, item) => {
    const imageClass = `${wrapClass.replace('.', '')}-item-${index}`
    $(item)
      .find('a')
      .not('.is-not-gallery-item')
      .addClass(imageClass)

    createLightbox(imageClass)
  })
}())
