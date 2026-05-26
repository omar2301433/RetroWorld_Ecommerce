/* ─────────────────────────────────────────────────────
   snake.js — Retro World Snake Game
   Open via any element with [data-open-snake] or window.openRetroSnake()
───────────────────────────────────────────────────── */

(function () {

  const CELL     = 15;
  const COLS     = 20;
  const ROWS     = 20;
  const BASE_SPD = 130;
  const MIN_SPD  = 55;
  const SPD_STEP = 14;
  const PTS_LVL  = 50;

  const scanFlash    = document.getElementById('scanlineFlash');
  const overlay      = document.getElementById('gameOverlay');
  const panel        = document.getElementById('gamePanel');
  const canvas       = document.getElementById('snakeCanvas');

  if (!overlay || !panel || !canvas) {
    console.warn('Retro Snake: missing #gameOverlay, #gamePanel, or #snakeCanvas');
    return;
  }

  const ctx          = canvas.getContext('2d');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const bestDisplay  = document.getElementById('bestDisplay');
  const levelDisplay = document.getElementById('levelDisplay');
  const msgBox       = document.getElementById('gameMessage');
  const closeBtn     = document.getElementById('gameCloseBtn');

  canvas.width  = COLS * CELL;
  canvas.height = ROWS * CELL;

  let snake, dir, nextDir, food, score, best = 0, level, ticker;

  function rand(n) { return Math.floor(Math.random() * n); }

  function spawnFood() {
    let f;
    do {
      f = { x: rand(COLS), y: rand(ROWS) };
    } while (snake.some(s => s.x === f.x && s.y === f.y));
    food = f;
  }

  function speed() {
    return Math.max(MIN_SPD, BASE_SPD - (level - 1) * SPD_STEP);
  }

  function bindStartButton() {
    const btn = document.getElementById('gameStartBtn');
    if (btn) btn.addEventListener('click', startGame);
  }

  function startGame() {
    snake   = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir     = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score   = 0;
    level   = 1;

    if (scoreDisplay) scoreDisplay.textContent = '0';
    if (levelDisplay) levelDisplay.textContent = '1';
    if (msgBox) msgBox.style.display = 'none';

    spawnFood();
    clearInterval(ticker);
    ticker = setInterval(tick, speed());
    draw();
  }

  function tick() {
    dir = nextDir;

    const head = {
      x: snake[0].x + dir.x,
      y: snake[0].y + dir.y,
    };

    const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
    const hitSelf = snake.some(s => s.x === head.x && s.y === head.y);

    if (hitWall || hitSelf) {
      clearInterval(ticker);
      if (score > best) {
        best = score;
        if (bestDisplay) bestDisplay.textContent = String(best);
      }
      showGameOver();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      if (scoreDisplay) scoreDisplay.textContent = String(score);

      const newLevel = Math.floor(score / PTS_LVL) + 1;
      if (newLevel !== level) {
        level = newLevel;
        if (levelDisplay) levelDisplay.textContent = String(level);
        clearInterval(ticker);
        ticker = setInterval(tick, speed());
      }

      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function drawRoundRect(x, y, w, h, r) {
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    ctx.beginPath();
    ctx.rect(x, y, w, h);
  }

  function draw() {
    ctx.fillStyle = '#2a2320';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(244,239,230,0.06)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(canvas.width, y * CELL);
      ctx.stroke();
    }

    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#00C2FF' : (i % 2 === 0 ? '#009ec2' : '#0081a0');
      drawRoundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 3);
      ctx.fill();

      if (i === 0) {
        ctx.fillStyle = '#2a2320';
        const cx = seg.x * CELL + CELL / 2 + dir.x * 3;
        const cy = seg.y * CELL + CELL / 2 + dir.y * 3;
        ctx.beginPath();
        ctx.arc(cx + dir.y * 3, cy - dir.x * 3, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx - dir.y * 3, cy + dir.x * 3, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.fillStyle = '#FF6B6B';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    drawRoundRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4, 3);
    ctx.fill();
    ctx.stroke();
  }

  function showGameOver() {
    if (!msgBox) return;
    msgBox.innerHTML = `
      <h3>GAME OVER</h3>
      <p>score: ${score}${score >= best && score > 0 ? ' — new best!' : ''}</p>
      <button type="button" class="game-start-btn" id="gameStartBtn">RETRY</button>
    `;
    msgBox.style.display = 'flex';
    bindStartButton();
  }

  function openGame() {
    if (scanFlash) {
      scanFlash.style.display = 'block';
      setTimeout(() => { scanFlash.style.display = 'none'; }, 380);
    }

    overlay.removeAttribute('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.classList.add('snake-open');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => panel.classList.add('pop'));
    });
  }

  function closeGame() {
    clearInterval(ticker);
    panel.classList.remove('pop');

    setTimeout(() => {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('snake-open');

      if (msgBox) {
        msgBox.innerHTML = `
          <h3>RETRO SNAKE</h3>
          <p>eat the pixels, don't crash!</p>
          <button type="button" class="game-start-btn" id="gameStartBtn">PLAY</button>
        `;
        msgBox.style.display = 'flex';
        bindStartButton();
      }
    }, 350);
  }

  /* Keyboard — only when game is open and dir exists */
  const keyMap = {
    ArrowUp:    { x: 0,  y: -1 },
    ArrowDown:  { x: 0,  y:  1 },
    ArrowLeft:  { x: -1, y:  0 },
    ArrowRight: { x: 1,  y:  0 },
    w: { x: 0,  y: -1 }, W: { x: 0,  y: -1 },
    s: { x: 0,  y:  1 }, S: { x: 0,  y:  1 },
    a: { x: -1, y:  0 }, A: { x: -1, y:  0 },
    d: { x: 1,  y:  0 }, D: { x: 1,  y:  0 },
  };

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeGame();
      return;
    }

    const nd = keyMap[e.key];
    if (!nd || !dir) return;
    if (nd.x === -dir.x && nd.y === -dir.y) return;
    nextDir = nd;
    e.preventDefault();
  });

  const dpadMap = {
    dpadUp:    { x: 0,  y: -1 },
    dpadDown:  { x: 0,  y:  1 },
    dpadLeft:  { x: -1, y:  0 },
    dpadRight: { x: 1,  y:  0 },
  };

  Object.entries(dpadMap).forEach(([id, nd]) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    function pressDir(e) {
      e.preventDefault();
      if (!dir) return;
      if (nd.x === -dir.x && nd.y === -dir.y) return;
      nextDir = nd;
    }

    btn.addEventListener('touchstart', pressDir, { passive: false });
    btn.addEventListener('mousedown', pressDir);
  });

  let touchStartX = 0, touchStartY = 0;

  canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;

    let nd;
    if (Math.abs(dx) > Math.abs(dy)) {
      nd = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
    } else {
      nd = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
    }
    if (!dir || (nd.x === -dir.x && nd.y === -dir.y)) return;
    nextDir = nd;
  }, { passive: true });

  /* Delegated clicks — works for navbar + all [data-open-snake] buttons */
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-snake]');
    if (!trigger) return;
    e.preventDefault();
    openGame();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeGame);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeGame();
  });

  bindStartButton();

  window.openRetroSnake = openGame;

})();
