import '../styles/UserEntry.scss';
import { Player } from '../types/Player.ts';
import {GameResult} from '../types/GameResult.ts';
import {getActivePlayers, validateForDiscard, validateForSelfDraw} from '../lib/ValidityUtil.ts';

export interface IUserEntryProps {
    players: Player[];
    onChange: (playerDelta: Player) => void;
    onGameWin: (gameResult: GameResult) => void;
}

export const UserEntry = (props: IUserEntryProps) => {
    const {
        players: allPlayers,
        onChange,
        onGameWin,
    } = props;
    
    const players = getActivePlayers(allPlayers);
    
    return (
<div className="user-entry">
    <div
        className="user-entry__main"
    >
        <div className="user-entry__player-wrapper">
            { players.map((player) => {
                const faanInputId = `faan-input--${player.id}`;
                return (<div
                    className="user-entry__player"
                    key={player.id}
                >
                    {/*
                    <div className="player__score-display">
                        <div className="user-entry__title">Score:</div>
                        <div className="user-entry__value">
                            {player.scoreTotal}
                        </div>
                    </div>
                    */}
                    
                    <div className="player__name">
                        <div className="user-entry__title">Name:</div>
                        <div className="user-entry__value">{player.name}</div>
                    </div>
                    
                    <div
                        className="player__faan"
                    >
                        <label 
                            className="user-entry__title"
                            htmlFor={faanInputId}
                        >Faan:</label>
                        <input
                            id={faanInputId}
                            className="user-entry__value player__faan-input"
                            type="text"
                            inputMode="numeric"
                            value={player.curScoreInput}
                            onChange={(event) => {
                                const newPlayer: Player = {
                                    ...player,
                                    curScoreInput: event.target.value,
                                };
                                onChange(newPlayer);
                            }}
                        />
                    </div>
                
                </div>);
            })}
        </div>
    </div>
    
    <div className="user-entry__triggers">
        <button
            type="button"
            onClick={() => {
                const gameResult = validateForDiscard(players);
                onGameWin(gameResult);
            }}
        >Discard win</button>
        <button
            type="button"
            onClick={() => {
                const gameResult = validateForSelfDraw(players);
                onGameWin(gameResult);
            }}
        >Self-draw win</button>
        
        <button
            type="button"
        >Undo</button>
    </div>
</div>
    );
};

