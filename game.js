// 初始化游戏
function initPuzzle() {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; // 清空旧元素
    const puzzleTiles = []; // 初始化拼图块数组

    // 定义数字块
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 表示空白块
    numbers.sort(() => Math.random() - 0.5); // 随机打乱顺序

    numbers.forEach((num, index) => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = num === 0 ? '' : num; // 空白块不显示数字

        // 基础样式配置
        Object.assign(tile.style, {
            width: '100px',
            height: '100px',
            border: '2px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            cursor: 'pointer',
            background: num ? '#f0f0f0' : 'transparent',
            position: 'absolute',
            transition: 'transform 0.3s ease'
        });

        // 初始化位置
        const col = index % 3;
        const row = Math.floor(index / 3);
        tile.style.transform = `translate(${col * 100}%, ${row * 100}%)`;

        tile.addEventListener('click', () => handleTileClick(index, puzzleTiles));
        container.appendChild(tile);
        puzzleTiles.push(tile);
    });
}

// 处理拼图块点击事件
function handleTileClick(clickedIndex, puzzleTiles) {
    const emptyIndex = puzzleTiles.findIndex(tile => tile.textContent === '');
    console.log('点击位置:', clickedIndex, '空白位置:', emptyIndex);

    if (isAdjacent(clickedIndex, emptyIndex)) {
        console.log('允许移动：交换位置', clickedIndex, '和', emptyIndex);

        // 交换数值数组
        [puzzleTiles[clickedIndex].textContent, puzzleTiles[emptyIndex].textContent] = 
        [puzzleTiles[emptyIndex].textContent, puzzleTiles[clickedIndex].textContent];

        updatePuzzleDisplay(puzzleTiles);
        checkWinCondition(puzzleTiles);
    } else {
        console.log('拒绝移动：非相邻位置');
    }
}

// 判断两个块是否相邻
function isAdjacent(a, b) {
    const rowA = Math.floor(a / 3);
    const colA = a % 3;
    const rowB = Math.floor(b / 3);
    const colB = b % 3;

    // 检查是否水平相邻或垂直相邻
    return (rowA === rowB && Math.abs(colA - colB) === 1) || 
           (colA === colB && Math.abs(rowA - rowB) === 1);
}

// 更新拼图显示
function updatePuzzleDisplay(puzzleTiles) {
    puzzleTiles.forEach((tile, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        tile.style.transform = `translate(${col * 100}%, ${row * 100}%)`;
    });
}

// 检查游戏胜利条件
function checkWinCondition(puzzleTiles) {
    const isWin = puzzleTiles.every((tile, index) => {
        const num = tile.textContent === '' ? 0 : parseInt(tile.textContent);
        return num === index + 1 || (index === 8 && num === 0);
    });

    if (isWin) {
        alert('恭喜，你赢了！');
    }
}

// 初始化游戏
initPuzzle();