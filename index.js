currency = [
  { v: '$', p: 16.35 },
  { v: '€', p: 18.45 },
  { v: 'Lei', p: 0.95 },
];

let timerID, tick = 100;
startTimer();
function startTimer() {
  timerID = setInterval(() => {
    document.querySelectorAll('.ls-detail_price, .item_title_price').forEach((e) => {
      currency.forEach((i) => {
        if (e.textContent.includes(i.v)) {
          e.innerHTML =
            Math.trunc(parseInt(e.textContent.split(' ').join('')) * i.p).toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + ' ') + ' руб';
        }
      });
    });
    tick *= 2;
    clearInterval(timerID);
    startTimer();
  }, tick);
}

document.querySelectorAll('input, a').forEach((e) => {
  addEventListener('click', () => {
    (tick = 100), clearInterval(timerID), startTimer();
  });
});
