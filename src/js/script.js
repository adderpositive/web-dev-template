import $ from 'cash-dom';
import svg4everybody from 'svg4everybody';
import test from './components/test';

svg4everybody();

$(function () {
  $(document).find('body').addClass('tesst');
  test();
}());
