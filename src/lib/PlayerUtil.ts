import {Player} from '../types/Player.ts';

export function getNewPlayer(id: number): Player {
    const player: Player = {
        id: id,
        isActive: true,
        name: '',
        scoreTotal: 0,
        scoreList: [],
        curScoreInput: '',
    };
    return player;
}
