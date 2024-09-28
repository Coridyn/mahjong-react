import {GameResult, WIN_DISCARD, WIN_SELF_DRAW} from '../types/GameResult.ts';
import {
    DISCARD_INDEX,
    FAAN_INDEX,
    scoreTable,
    SELF_DRAW_PER_PERSON_INDEX,
    SELF_DRAW_TOTAL_INDEX
} from './score-table.ts';
import {assertMessage} from './ValidityUtil.ts';
import {Player} from '../types/Player.ts';

/**
 * Take the win representation and distribute points accordingly
 */
export function distributePoints(gameResult: GameResult) {
    let winPointsIndex = -1;
    let losePointsIndex = -1;
    switch (gameResult.type) {
        case WIN_DISCARD: {
            winPointsIndex = DISCARD_INDEX;
            losePointsIndex = DISCARD_INDEX;
            break;
        }
        
        case WIN_SELF_DRAW: {
            winPointsIndex = SELF_DRAW_TOTAL_INDEX;
            if (gameResult.loserPlayers.length === 1) {
                // Single-payer penalty
                losePointsIndex = SELF_DRAW_TOTAL_INDEX;
            } else {
                // Self-draw shared amongst remaining players
                losePointsIndex = SELF_DRAW_PER_PERSON_INDEX;
            }
            break;
        }
        
        default: {
            assertMessage('distributePoints()', `Unknown winResult.type="${gameResult.type}" (expected "${WIN_DISCARD}" or "${WIN_SELF_DRAW}")`);
            break;
        }
    }
    
    // Convert faan into points
    const faanRow = getPointsRowForFaan(gameResult.faan);
    
    // Now do the distribution
    const winPoints = faanRow[winPointsIndex];
    const losePointsPerPlayer = -faanRow[losePointsIndex];
    
    // Build up values list
    const players = gameResult.players;
    const playerDeltas: Player[] = [];
    
    /**
     * TODO: keep track of the type of wins, etc.
     */
    
    // Score winner
    const winnerPlayer = players[gameResult.winnerId];
    const winnerDelta = updatePlayerScore(winnerPlayer, winPoints);
    playerDeltas.push(winnerDelta);
    
    // Score losers
    gameResult.loserPlayers.forEach((loserIndex) => {
        const player = players[loserIndex];
        const playerDelta = updatePlayerScore(player, losePointsPerPlayer);
        playerDeltas.push(playerDelta);
    });
    
    return playerDeltas;
}

/**
 * Return the row matching the number of faan.
 *
 * [faan, discardPoints, selfDrawPointsTotal, selfDrawPointsPerPerson]
 */
function getPointsRowForFaan(faanNeedle: number) {
    /**
     * 11 rows, 4 columns
     * [row][column]
     */
    const faanRow = scoreTable.find((faanRow) => {
        const faan = faanRow[FAAN_INDEX];
        return (faan === faanNeedle);
    });
    
    if (!faanRow){
        assertMessage('getPointsRowForFaan()', `Could not find valid score for faan="${faanNeedle}"`);
    }
    
    return faanRow!;
}

/**
 * 
 */
function updatePlayerScore(player: Player, points: number){
    const playerDelta: Player = {
        ...player,
        scoreTotal: player.scoreTotal + points,
        scoreList: player.scoreList.concat(points),
        curScoreInput: '',
    };
    return playerDelta;
}
