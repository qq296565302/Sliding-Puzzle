const APP_WIDTH = 400;
const APP_HEIGHT = 400;
const TILE_SIZE = APP_WIDTH / 3;

let app = new PIXI.Application({
    width: APP_WIDTH,
    height: APP_HEIGHT,
    backgroundColor: 0x1099bb,
    antialias: true
});
document.getElementById('game-container').appendChild(app.view);

let tiles = [];
let emptyPosition = { x: 2, y: 2 };
let isAnimating = false;

function createTiles() {
    // 创建1-8数字方块
    for (let i = 0; i < 8; i++) {
        const tile = new PIXI.Text(i + 1, {
            fontSize: 36,
            fill: 0xffffff,
            align: 'center'
        });
        
        tile.x = (i % 3) * TILE_SIZE + TILE_SIZE/2;
        tile.y = Math.floor(i / 3) * TILE_SIZE + TILE_SIZE/2;
        tile.anchor.set(0.5);
        tile.interactive = true;
        tile.buttonMode = true;
        tile.originalX = (i % 3) * TILE_SIZE + TILE_SIZE/2;
        tile.originalY = Math.floor(i / 3) * TILE_SIZE + TILE_SIZE/2;
        
        tile.on('pointerdown', () => {
            if (isAnimating || !isValidMove(tile)) return;
            
            // 立即锁定空白格位置
            const tempEmpty = { ...emptyPosition };
            emptyPosition = { x: -1, y: -1 }; // 临时无效位置
            
            isAnimating = true;
            const targetX = tempEmpty.x * TILE_SIZE + TILE_SIZE/2;
            const targetY = tempEmpty.y * TILE_SIZE + TILE_SIZE/2;
            
            const animate = (delta) => {
                tile.x += (targetX - tile.x) * 0.2 * delta;
                tile.y += (targetY - tile.y) * 0.2 * delta;
                
                // 实时检测碰撞
                tiles.forEach(otherTile => {
                    if (otherTile !== tile && 
                        Math.abs(otherTile.x - tile.x) < TILE_SIZE/2 &&
                        Math.abs(otherTile.y - tile.y) < TILE_SIZE/2) {
                        // 强制分离重叠方块
                        otherTile.x = otherTile.originalX;
                        otherTile.y = otherTile.originalY;
                    }
                });
                
                if (Math.abs(tile.x - targetX) < 1 && Math.abs(tile.y - targetY) < 1) {
                    tile.x = targetX;
                    tile.y = targetY;
                    isAnimating = false;
                    app.ticker.remove(animate);
                    
                    // 原子更新位置
                    emptyPosition = {
                        x: Math.floor(tile.originalX / TILE_SIZE),
                        y: Math.floor(tile.originalY / TILE_SIZE)
                    };
                    tile.originalX = targetX;
                    tile.originalY = targetY;
                    checkWin();
                }
            };
            app.ticker.add(animate);
        });
        
        app.stage.addChild(tile);
        tiles.push(tile);
    }
}

function createGrid() {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0xffffff, 0.5);
    
    for (let i = 1; i < 3; i++) {
        // 垂直线
        graphics.moveTo(i * TILE_SIZE, 0);
        graphics.lineTo(i * TILE_SIZE, APP_HEIGHT);
        // 水平线
        graphics.moveTo(0, i * TILE_SIZE);
        graphics.lineTo(APP_WIDTH, i * TILE_SIZE);
    }
    app.stage.addChild(graphics);
}

function isValidMove(tile) {
    const tileX = Math.floor(tile.x / TILE_SIZE);
    const tileY = Math.floor(tile.y / TILE_SIZE);
    return (
        (Math.abs(tileX - emptyPosition.x) === 1 && tileY === emptyPosition.y) ||
        (Math.abs(tileY - emptyPosition.y) === 1 && tileX === emptyPosition.x)
    );
}

function checkWin() {
    const isCorrect = tiles.every((tile, index) => {
        const x = Math.floor(tile.x / TILE_SIZE);
        const y = Math.floor(tile.y / TILE_SIZE);
        return x === index % 3 && y === Math.floor(index / 3);
    });
    if (isCorrect) {
        alert('恭喜！你赢了！');
    }
}

function shuffleTiles() {
    // Fisher-Yates洗牌算法
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i].x, tiles[j].x] = [tiles[j].x, tiles[i].x];
        [tiles[i].y, tiles[j].y] = [tiles[j].y, tiles[i].y];
    }
    
    // 更新空白格位置
    emptyPosition = { x: 2, y: 2 };
    
    // 确保谜题可解（偶数逆序数）
    // 这里需要添加逆序数校验逻辑
}

createTiles();
createGrid();
shuffleTiles();
