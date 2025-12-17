import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {GameRunner} from '../src/game-runner';
import { Game } from '../src/game';
import fs from 'fs/promises';

async function loadFile(path: string): Promise<string> {
    try {
        return await fs.readFile(path, 'utf8');
    } catch (error) {
        throw new Error(`Failed to load file ${path}: ${error}`);
    }
}

describe('Trivia Game Golden Master', () => {
    let originalConsoleLog: (message?: any, ...optionalParams: any[]) => void;
    let originalMathRandom: () => number;
    let output = "";

    beforeEach(() => {
        originalConsoleLog = console.log;
        output = "";

        console.log = (message: string) => {
            output += message + "\n";
        }

        originalMathRandom = Math.random;
        Math.random = () => 0.5;
    });

    afterEach(() => {
        console.log = originalConsoleLog;
        Math.random = originalMathRandom;
    });

    it("should match the golden master", async () => {
        const game = new Game();
        game.add("Chet");
        game.add("Pat");
        game.add("Sue");

        let notAWinner;
        do {

            game.roll(Math.floor(Math.random() * 6) + 1);

            if (Math.floor(Math.random() * 10) == 7) {
            notAWinner = game.wrongAnswer();
            } else {
            notAWinner = game.wasCorrectlyAnswered();
            }

        } while (notAWinner);
        const expectedOutput = await loadFile("./tests/golden_master_expected_result.txt");
        expect(output).toBe(expectedOutput);
    });

});
