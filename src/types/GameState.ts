import {Player} from './Player.ts';

export interface GameState {
    players: Player[],
    roundCount: number,
}
