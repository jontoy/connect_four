const token = document.querySelector('.token');
const resetBtn = document.querySelector('.reset');
const gameArea = document.querySelector('.game');
const winnerBanner = document.querySelector('.winner-banner');
createConnectFour({root:gameArea, token, resetBtn, winnerBanner});

