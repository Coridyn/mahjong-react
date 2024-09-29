import {Player} from '../types/Player.ts';
import {GameResult, WIN_DISCARD, WIN_SELF_DRAW} from '../types/GameResult.ts';

export function getActivePlayers(players: Player[]) {
    const activePlayers = players.filter((player) => {
        return player.isActive;
    });
    return activePlayers;
}

export function validateForDiscard(players: Player[]): GameResult {
    const gameResult: GameResult = {
        type: 'discard',
        faan: 0,
        players: players,
        winnerId: -1,
        loserPlayers: new Set<number>(),
    };
    
    players.forEach((player) => {
        const rawScore = player.curScoreInput;
        const faanValue = parseInt(rawScore, 10);
        
        const isNegative = (rawScore + '').trim().startsWith('-');
        if (isNegative) {
            _collectSinglePayerDetails(player, gameResult);
            
        } else if (faanValue > 0) {
            _collectWinnerDetails(player, faanValue, gameResult);
        }
    });
    
    // make sure the inputs are valid (e.g. not too many values)
    assertValidDiscard(gameResult);
    
    return gameResult;
}

export function validateForSelfDraw(players: Player[]) {
    const gameResult: GameResult = {
        type: WIN_SELF_DRAW,
        faan: 0,
        players: players,
        winnerId: -1,
        loserPlayers: new Set<number>(),
    };
    players.forEach((player) => {
        const rawScore = player.curScoreInput;
        const faanValue = parseInt(rawScore, 10);
        
        const isNegative = (rawScore + '').trim().startsWith('-');
        if (isNegative) {
            // Optional single-payer penalty for self-draw win
            _collectSinglePayerDetails(player, gameResult);
            
        } else if (faanValue > 0) {
            _collectWinnerDetails(player, faanValue, gameResult);
        }
    });
    
    // If the self-draw is being shared amongst all other players
    // put their player index into the list.
    if (gameResult.loserPlayers.size === 0) {
        players.forEach((player) => {
            if (player.id !== gameResult.winnerId) {
                gameResult.loserPlayers.add(player.id);
            }
        });
    }
    
    // make sure the inputs are valid (e.g. not too many values)
    assertValidSelfDraw(gameResult);
    
    return gameResult;
}

function _collectWinnerDetails(player: Player, faanValue: number, gameResult: GameResult) {
    if (gameResult.winnerId !== -1) {
        assertMessage("getDiscardResults()", `Invalid data: cannot have multiple winners. (Player ${gameResult.winnerId + 1} has already been set as the winner; cannot set player ${player.id + 1} as the winner)`)
    }
    
    gameResult.faan = faanValue;
    gameResult.winnerId = player.id;
    return gameResult;
}

function _collectSinglePayerDetails(player: Player, gameResult: GameResult) {
    gameResult.loserPlayers.add(player.id);
}

/**
 *
 */
function assertValidDiscard(gameResult: GameResult) {
    _assertGameWinCommon(gameResult);
    
    let errorMessage = '';
    if (gameResult.type !== WIN_DISCARD) {
        errorMessage = `Invalid result type="${gameResult.type}" (expected "${WIN_DISCARD}")`;
        
    } else if (gameResult.loserPlayers.size > 1) {
        errorMessage = `Invalid loserIndexList.length; expected exactly 1 but received length=${gameResult.loserPlayers.size} (make sure a negative number or dash has been entered for a single discarding player)`;
    }
    
    if (errorMessage) {
        assertMessage('assertValidDiscard()', errorMessage);
    }
}

/**
 *
 */
function assertValidSelfDraw(gameResult: GameResult) {
    _assertGameWinCommon(gameResult);
    
    let errorMessage = '';
    if (gameResult.type !== WIN_SELF_DRAW) {
        errorMessage = `Invalid result type="${gameResult.type}" (expected "${WIN_SELF_DRAW}")`;
        
    } else if (gameResult.loserPlayers.size !== 1 && gameResult.loserPlayers.size !== 3) {
        errorMessage = `Invalid loserPlayers.length; expected exactly 1 or 3 players but received length=${gameResult.loserPlayers.size} (make sure all paying players have an empty score, or single paying player has a "-" in their column)`;
    }
    
    if (errorMessage) {
        assertMessage('assertValidDiscard()', errorMessage);
    }
}

const FAAN_MIN = 3;
const FAAN_MAX = 13;

/**
 * Assert game result values common to discard and self-draw.
 */
function _assertGameWinCommon(gameResult: GameResult) {
    let errorMessage = '';
    if (gameResult.faan === 0) {
        errorMessage = `Winning faan value hasn't been entered`;
        
    } else if (gameResult.faan < FAAN_MIN) {
        errorMessage = `Winning faan value is too low - received ${gameResult.faan} but min is ${FAAN_MIN}`;
        
    } else if (gameResult.faan > FAAN_MAX) {
        errorMessage = `Winning faan value is too high - received ${gameResult.faan} but max is ${FAAN_MAX}`;
        
    } else if (gameResult.winnerId === -1) {
        errorMessage = `Winning player has not been set (make sure a positive number has been entered for the winner player)`;
        
    } else if (!gameResult.loserPlayers.size) {
        errorMessage = `Paying player has not been set (make sure a negative number or dash has been entered for the discarding player)`;
        
    }
    
    if (errorMessage) {
        assertMessage('_assertGameWinCommon()', errorMessage);
    }
}

export function assertMessage(context: string, msg: string): asserts msg {
    alert(`(${context}) ${msg}`);
    throw new Error(`(${context}) ${msg}`);
}

/**
 * 
 */
export function validateActivePlayerCount(players: Player[]){
    const activePlayers = getActivePlayers(players);
    const isValid = activePlayers.length === 4;
    return ({
        isValid: isValid,
        activePlayersCount: activePlayers,
        message: [
            activePlayers.length < 4 ? `Not enough active players: ${activePlayers.length}` : '',
            activePlayers.length > 4 ? `Too many active players: ${activePlayers.length}` : '',
        ],
    });
}
