import {Player} from '../types/Player.ts';

export function getNewPlayer(id: number): Player {
    const playerNumber = id + 1;
    const player: Player = {
        id: id,
        isActive: true,
        name: `Player ${playerNumber}`,
        scoreTotal: 0,
        scoreList: [],
        curScoreInput: '',
    };
    return player;
}
