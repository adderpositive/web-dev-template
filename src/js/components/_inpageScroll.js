import $ from 'cash-dom';

const easings = {
  linear(t) {
    return t;
  },
  easeInQuad(t) {
    return t * t;
  },
  easeOutQuad(t) {
    return t * (2 - t);
  },
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeInCubic(t) {
    return t * t * t;
  },
  easeOutCubic(t) {
    return (t - 1) * t * t + 1;
  },
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeInQuart(t) {
    return t * t * t * t;
  },
  easeOutQuart(t) {
    return 1 - (t - 1) * t * t * t;
  },
  easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (t - 1) * t * t * t;
  },
  easeInQuint(t) {
    return t * t * t * t * t;
  },
  easeOutQuint(t) {
    return 1 + (t - 1) * t * t * t * t;
  },
  easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (t - 1) * t * t * t * t;
  },
};

const scrollIt = (destination, duration = 200, easing = 'linear', callback) => {
  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
  );
  const windowHeight = window.innerHeight
    || document.documentElement.clientHeight
    || document.getElementsByTagName('body')[0].clientHeight;
  const destinationOffset = typeof destination === 'number'
    ? destination
    : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(
    documentHeight - destinationOffset < windowHeight
      ? documentHeight - windowHeight
      : destinationOffset,
  );

  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  let lastScrollPosition;

  const scroll = () => {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easings[easing](time);
    window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

    // lastScrollPosition === window.pageYOffset - fix stuck with float numbers
    if (lastScrollPosition === window.pageYOffset
      || window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }

    lastScrollPosition = window.pageYOffset;
    requestAnimationFrame(scroll);
  };

  scroll();
};

const inpageScroll = () => {
  $('a[href^="#"]').not('a[href="#"]').not('.js-not-inpage-link').each((i, el) => {
    const $this = $(el);
    const $target = $($this.attr('href'));
    const headerHeight = $('.header').height();
    const scrollMenuHeight = $('.scroll-menu').height();

    if ($target.length) {
      $this.on('click', (e) => {
        let additionalMinusTop = headerHeight;
        e.preventDefault();

        if (scrollMenuHeight) {
          additionalMinusTop += scrollMenuHeight - 1;
        }

        scrollIt(
          $target.offset().top - additionalMinusTop,
          500,
          'linear',
        );
      });
    }
  });
};

export default inpageScroll;
