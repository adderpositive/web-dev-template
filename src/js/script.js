const $ = window.$;

// svgforeverybody
(function () {
  window.svg4everybody()
}());

// main
(function () {
  const test = () => 'ahoj světe'
  console.log(test())
}());

// gallery
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
}());

// popup
(function () {
  const popupClass = '.js-popup'
  const $wrap = $(popupClass)

  const createLightbox = (wrapClass) => {
    const options = {
      selector: wrapClass,
      closeButton: false,
      skin: 'popup',
      /*onOpen: () => {
        $('.js-popup-close').on('click', () => {
          .close()
        })
      }*/
    }

    return window.GLightbox({ ...options })
  }

  $wrap.each((index, item) => {
    createLightbox(popupClass.replace('.', ''))
  })
}())
