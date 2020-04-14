const $ = window.$;

// svgforeverybody
(function () {
  window.svg4everybody()
}());

(function () {
  const $header = $('.header')
  const $menuOpener = $('.js-menu-opener')
  const $menu = $('.js-menu')
  const $window = $(window)
  const windowHeight = $window.height()

  $window.on('scroll', () => {
    const scrollTop = window.pageYOffset

    if (windowHeight / 2 < scrollTop) {
      $header.addClass('is-active')
      setTimeout(() => {
        $header.addClass('is-animate-in is-animate')
      }, 100)
    } else if ($header.hasClass('is-active')) {
      $header.addClass('is-animate-out')
      setTimeout(() => {
        $header.removeClass('is-active is-animate is-animate-in is-animate-out')
      }, 400)
    }
  })

  $menuOpener.on('click', () => {
    if ($menuOpener.hasClass('is-active')) {
      $menuOpener.removeClass('is-active')
      $menu.removeClass('is-active')
    } else {
      $menuOpener.addClass('is-active')
      $menu.addClass('is-active')
    }
  })
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
      // closeButton: false,
      skin: 'popup'
      /*
      onOpen: () => {
        $('.js-popup-close').on('click', () => {
          .close()
        })
      }
      */
    }

    return window.GLightbox({ ...options })
  }

  $wrap.each((index, item) => {
    createLightbox(popupClass.replace('.', ''))
  })
}());

// swiper
(function () {
  $('.swiper').not('.noinit').each((indexSw, elementSw) => {
    const $swiper = $(elementSw)
    const $container = $swiper.find('.swiper-container')
    const $prev = $swiper.find('.swiper-button-prev')
    const $next = $swiper.find('.swiper-button-next')
    const data = $swiper.data()
    const config = {}
    let $pagination = $swiper.find('.swiper-pagination')
    let i
    let j
    let count
    let countParts

    if ($swiper.hasClass('swiper-work')) {
      $pagination = $swiper.parents('.reference-big').find('.swiper-pagination-work')
    }

    // add pagination
    if ($pagination.length) {
      config.pagination = {
        el: $pagination[0],
        clickable: true,
        renderBullet: (index, className) => (`<span class="${className}"><span></span></span>`)
      }
    }

    // prev&next button
    if ($prev.length || $next.length) {
      config.navigation = {
        nextEl: $next,
        prevEl: $prev
      }
    }

    // slides per view
    if (typeof data.count !== 'undefined') {
      count = $swiper.data('count')

      if (typeof count === 'string' && count.indexOf('|') !== -1) {
        config.breakpoints = { }
        countParts = count.split('|')

        for (i = 0; i < countParts.length; i + 1) {
          j = countParts[i].indexOf('-')
          if (j !== -1) {
            config.breakpoints[countParts[i].slice(0, j)] = {
              slidesPerView: countParts[i].slice(j + 1)
            }
          } else {
            config.slidesPerView = countParts[i].slice(j + 1)
          }
        }
      } else {
        config.slidesPerView = count
      }

      delete data.count
    } else {
      config.slidesPerView = 'auto'
    }

    // space between slides
    if (typeof data.space !== 'undefined') {
      config.spaceBetween = $swiper.data('space')
      delete data.space
    }

    // put data atributes to config
    $.extend(config, data)

    // init
    const sw = new window.Swiper($container, config)

    return sw
  })
}());

// main
(function () {
  const test = () => 'ahoj světe'
  console.log(test())
}())
