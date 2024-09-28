import {useState} from 'react'
import './styles/App.css'
import {UserEntry} from './components/UserEntry.tsx';
import {Player} from './types/Player.ts';
import {getNewPlayer} from './lib/PlayerUtil.ts';
import {GameResult} from './types/GameResult.ts';
import {distributePoints} from './lib/MahjongUtil.ts';
import {ScoreDisplay} from './components/ScoreDisplay.tsx';
import {GameState} from './types/GameState.ts';

const PLAYER_COUNT = 4;

function App() {
    const [gameState, setgameState] = useState<GameState>(() => {
        const players: Player[] = [];
        for (let i = 0; i < PLAYER_COUNT; i++){
            const player = getNewPlayer(i);
            players.push(player);
        }
        
        const gameState: GameState = {
            players: players,
            roundCount: 0,
        };
        return gameState;
    });
    const players = gameState.players;
    
    /**
     * 
     */
    function setPlayers(players: Player[]){
        const nextGameState: GameState = {
            ...gameState,
            players: players,
        };
        setgameState(nextGameState);
    }
    
    /**
     * 
     */
    // TODO: Add a new player into the game
    
    /**
     * 
     */
    function updatePlayer(playerDelta: Player){
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
        
        setPlayers(nextPlayers);
    }
    
    function handleGameWin(gameResult: GameResult){
        const nextPlayers = players.concat();
        const playerDeltas = distributePoints(gameResult);
        playerDeltas.forEach((player) => {
            nextPlayers[player.id] = player;
        });
        
        const nextGameState: GameState = {
            ...gameState,
            players: nextPlayers,
            roundCount: gameState.roundCount + 1,
        };
        setgameState(nextGameState);
    }
    
    return (
        <div>
            <UserEntry
                players={players}
                onChange={updatePlayer}
                onGameWin={handleGameWin}
            />
            <ScoreDisplay
                players={players}
            />
        </div>
    )
}

export default App
