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
        players,
        onChange,
        onGameWin,
    } = props;
    
    // TODO: validate data-entry
    
    return (
<div className="user-entry">
    <div className="user-entry__triggers">
        <button
            type="button"
            onClick={() => {
                const activePlayers = getActivePlayers(players);
                const gameResult = validateForDiscard(activePlayers);
                onGameWin(gameResult);
            }}
        >Discard win</button>
        <button
            type="button"
            onClick={() => {
                const activePlayers = getActivePlayers(players);
                const gameResult = validateForSelfDraw(activePlayers);
                onGameWin(gameResult);
            }}
        >Self-draw win</button>
    </div>
    
    <div className="user-entry__title">
        <div className="title__active">
            Active?
        </div>
        <div className="title__score-display">
            Score
        </div>
        <div className="title__name">
            Name
        </div>
        <div className="title__score-input">
            Faan
        </div>
    </div>
    
    { players.map((player) => {
        return (<div
            className="user-entry__player"
            key={player.id}
        >
            <div className="player__active">
                <input
                    type="checkbox"
                    checked={player.isActive}
                    onChange={(event) => {
                        const checked = event.target.checked
                        const newPlayer: Player = {
                            ...player,
                            isActive: checked,
                        };
                        onChange(newPlayer);
                    }}
                />
            </div>
            <div className="player__score-display">
                {player.scoreTotal}
            </div>
            
            <div className="player__name">
                <input
                    type="text"
                    value={player.name}
                    onChange={(event) => {
                        const newPlayer: Player = {
                            ...player,
                            name: event.target.value,
                        };
                        onChange(newPlayer);
                    }}
                />
            </div>
            
            <div
                className="player__score-input"
            >
                <input
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
    );
};

