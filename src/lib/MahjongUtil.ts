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
            if (gameResult.loserPlayers.size === 1) {
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
    players.forEach((player) => {
        if (player.id === gameResult.winnerId){
            // Score winner
            const winnerDelta = updatePlayerScore(player, winPoints);
            playerDeltas.push(winnerDelta);
        } else if (gameResult.loserPlayers.has(player.id)){
            // Score losers
            const playerDelta = updatePlayerScore(player, losePointsPerPlayer);
            playerDeltas.push(playerDelta);
        } else {
            // Score zero
            const playerDelta = updatePlayerScore(player, 0);
            playerDeltas.push(playerDelta);
        }
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
    const scoreList = player.scoreList.concat(points);
    const scoreTotal = sum(scoreList);
    const playerDelta: Player = {
        ...player,
        scoreTotal: scoreTotal,
        scoreList: scoreList,
        curScoreInput: '',
    };
    return playerDelta;
}

function sum(scores: number[]){
    const total = scores.reduce((acc, value) => {
        const result = acc + value;
        return result;
    }, 0);
    return total;
}

/**
 * Return a new list with the associated player replaced.
 */
export function updatePlayerInList(players: Player[], playerDelta: Player): Player[] {
    const nextPlayers = players.map((player) => {
        let nextPlayer = player;
        if (player.id === playerDelta.id){
            nextPlayer = {
                ...player,
                ...playerDelta,
            };
        }
        return nextPlayer;
    });
    
    return nextPlayers;
}
