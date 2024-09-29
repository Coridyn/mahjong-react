import {Player} from './Player.ts';

export const WIN_DISCARD = 'discard';
export const WIN_SELF_DRAW = 'selfDraw';

export type GameResult = {
    type: typeof WIN_DISCARD | typeof WIN_SELF_DRAW,
    faan: number,
    players: Player[],
    winnerId: number,
    loserPlayers: Set<number>,
};
