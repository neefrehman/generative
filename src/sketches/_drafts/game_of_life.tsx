// https://medium.com/hypersphere-codes/conways-game-of-life-in-typescript-a955aec3bd49

import React from "react";

import type {
    Canvas2DRendererSettings,
    Canvas2DSetupFn,
} from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { rgbaToString } from "Utils/libs/canvas2d";
import { createMatrix } from "Utils/math";
import { inRange } from "Utils/random";

const settings: Canvas2DRendererSettings = {
    dimensions: [window.innerWidth - 100, window.innerHeight - 100],
};

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const TILE_SIZE = 20;
    const TILES_X = Math.floor(width / TILE_SIZE);
    const TILES_Y = Math.floor(height / TILE_SIZE);
    const INITIAL_LIVING_CELLS = 10;

    let board = createMatrix([TILES_X, TILES_Y], false);

    for (let i = 0; i < INITIAL_LIVING_CELLS; i++) {
        const x = inRange(0, TILES_X, { isInteger: true });
        const y = inRange(0, TILES_Y, { isInteger: true });
        board[x][y] = true;
    }

    const isAlive = (x: number, y: number): number => {
        if (x < 0 || x >= TILES_X || y < 0 || y >= TILES_Y) {
            return 0;
        }
        return board[x][y] === true ? 1 : 0;
    };

    const getNeighbourCount = (x: number, y: number): number => {
        let count = 0;
        [-1, 0, 1].forEach(i => {
            [-1, 0, 1].forEach(j => {
                if (!(i === 0 && j === 0)) {
                    count += isAlive(x + i, y + j);
                }
            });
        });
        return count;
    };

    const computeNextGeneration = () => {
        const newBoard = createMatrix([TILES_X, TILES_Y], false);

        for (let i = 0; i < TILES_X; i++) {
            for (let j = 0; j < TILES_Y; j++) {
                const count = getNeighbourCount(i, j);

                if (!isAlive(i, j)) {
                    if (count === 3) newBoard[i][j] = true;
                } else if (count === 2 || count === 3) {
                    newBoard[i][j] = true;
                }
            }
        }
        board = newBoard;
    };

    ctx.fillStyle = rgbaToString(100, 240, 150);
    ctx.strokeStyle = rgbaToString(90, 90, 90);
    ctx.lineWidth = 1;

    const drawBorders = () => {
        for (let i = 0; i < TILES_X; i++) {
            ctx.beginPath();
            ctx.moveTo(i * TILE_SIZE - 0.5, 0);
            ctx.lineTo(i * TILE_SIZE - 0.5, height);
            ctx.stroke();
        }
        for (let j = 0; j < TILES_Y; j++) {
            ctx.beginPath();
            ctx.moveTo(0, j * TILE_SIZE - 0.5);
            ctx.lineTo(width, j * TILE_SIZE - 0.5);
            ctx.stroke();
        }
    };

    const drawCells = () => {
        for (let i = 0; i < TILES_X; i++) {
            for (let j = 0; j < TILES_Y; j++) {
                if (isAlive(i, j)) {
                    ctx.fillRect(
                        i * TILE_SIZE,
                        j * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE
                    );
                }
            }
        }
    };

    return () => {
        ctx.clearRect(0, 0, width, height);

        drawBorders();
        drawCells();
        computeNextGeneration();
    };
};

const DGameOfLife = () => (
    <Canvas2DRenderer sketch={sketch} settings={settings} />
);

export default DGameOfLife;
