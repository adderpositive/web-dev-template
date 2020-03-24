import $ from 'cash-dom';
import Swiper from 'swiper';

export default () => {
  $('.swiper').not('.noinit').each((indexSw, elementSw) => {
    const $swiper = $(elementSw);
    const $container = $swiper.children('.swiper-container');
    const $prev = $swiper.find('.swiper-button-prev');
    const $next = $swiper.find('.swiper-button-next');
    const data = $swiper.data();
    const config = {};
    let $pagination = $swiper.find('.swiper-pagination');
    let i;
    let j;
    let count;
    let countParts;

    if ($swiper.hasClass('swiper-work')) {
      $pagination = $swiper.parents('.reference-big').find('.swiper-pagination-work');
    }

    // add pagination
    if ($pagination.length) {
      config.pagination = {
        el: $pagination[0],
        clickable: true,
        renderBullet: (index, className) => (`<span class="${className}"><span></span></span>`),
      };
    }

    // prev&next button
    if ($prev.length || $next.length) {
      config.navigation = {
        nextEl: $next,
        prevEl: $prev,
      };
    }

    // slides per view
    if (typeof data.count !== 'undefined') {
      count = $swiper.data('count');

      if (typeof count === 'string' && count.indexOf('|') !== -1) {
        config.breakpoints = { };
        countParts = count.split('|');

        for (i = 0; i < countParts.length; i + 1) {
          j = countParts[i].indexOf('-');
          if (j !== -1) {
            config.breakpoints[countParts[i].slice(0, j)] = {
              slidesPerView: countParts[i].slice(j + 1),
            };
          } else {
            config.slidesPerView = countParts[i].slice(j + 1);
          }
        }
      } else {
        config.slidesPerView = count;
      }

      delete data.count;
    } else {
      config.slidesPerView = 'auto';
    }

    // space between slides
    if (typeof data.space !== 'undefined') {
      config.spaceBetween = $swiper.data('space');
      delete data.space;
    }

    // put data atributes to config
    $.extend(config, data);

    // init
    const sw = new Swiper($container, config);

    return sw;
  });
};
