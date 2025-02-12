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

    // 绑定求解按钮事件
    const solveButton = document.createElement('button');
    solveButton.id = 'solve-btn';
    solveButton.textContent = '显示解决方案';
    document.body.appendChild(solveButton);
    solveButton.addEventListener('click', () => showSolution(puzzleTiles));

    return puzzleTiles;
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
        setTimeout(() => {
            alert('恭喜，你赢了！');
        }, 100); // 延迟 100 毫秒
    }
}

// 计算从当前状态到目标状态的解决方案
function findSolution(puzzleTiles) {
    // 定义目标状态，表示拼图的完成状态
    const targetState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    // 获取当前拼图的初始状态，将空白块表示为0
    const startState = puzzleTiles.map(tile => tile.textContent === '' ? 0 : parseInt(tile.textContent));
    // 初始化搜索队列，包含初始状态和路径
    const queue = [{ state: startState, path: [] }];
    // 使用集合记录已访问的状态，避免重复计算
    const visited = new Set();

    // 开始广度优先搜索
    while (queue.length > 0) {
        // 从队列中取出第一个状态进行处理
        const { state, path } = queue.shift();
        // 找到空白块在当前状态中的索引
        const emptyIndex = state.indexOf(0);

        // 检查当前状态是否为目标状态
        if (state.toString() === targetState.toString()) {
            // 如果是目标状态，返回路径，表示找到解决方案
            return path;
        }

        // 初始化可能的移动方向数组
        const possibleMoves = [];
        // 检查空白块是否可以向左移动
        if (emptyIndex % 3 !== 0) possibleMoves.push(emptyIndex - 1); // 左
        // 检查空白块是否可以向右移动
        if (emptyIndex % 3 !== 2) possibleMoves.push(emptyIndex + 1); // 右
        // 检查空白块是否可以向上移动
        if (emptyIndex > 2) possibleMoves.push(emptyIndex - 3); // 上
        // 检查空白块是否可以向下移动
        if (emptyIndex < 6) possibleMoves.push(emptyIndex + 3); // 下

        // 遍历每个可能的移动方向
        for (const move of possibleMoves) {
            // 生成新的状态，通过交换空白块和目标块
            const newState = [...state];
            [newState[emptyIndex], newState[move]] = [newState[move], newState[emptyIndex]];
            // 将新状态转换为字符串形式，便于记录
            const newStateStr = newState.toString();

            // 检查新状态是否已被访问过
            if (!visited.has(newStateStr)) {
                // 如果未访问过，将其加入访问记录
                visited.add(newStateStr);
                // 将新状态和路径加入队列，以便后续处理
                queue.push({ state: newState, path: [...path, move] });
            }
        }
    }

    // 如果搜索完成仍未找到目标状态，返回null表示无解
    return null;
}

function showSolution(puzzleTiles) {
    const solution = findSolution(puzzleTiles);
    if (solution) {
        alert(`解决方案路径: ${solution.map(index => puzzleTiles[index].textContent).join(' -> ')}`);
    } else {
        alert('无解');
    }
}

// 初始化游戏
const puzzleTiles = initPuzzle();