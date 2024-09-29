import {useState} from 'react';
import {Player} from '../types/Player.ts';
import {updatePlayerInList} from '../lib/MahjongUtil.ts';
import {getNewPlayer} from '../lib/PlayerUtil.ts';
import {validateActivePlayerCount} from '../lib/ValidityUtil.ts';

export interface ISetupProps {
    players: Player[],
    onCommit: (players: Player[]) => void,
    onCancel: () => void,
}

export function Setup(props: ISetupProps){
    const {
        players: playersOriginal,
        onCommit,
        onCancel,
    } = props;
    
    const [players, setPlayers] = useState(() => {
        return playersOriginal.concat();
    });
    
    const activePlayersValidity = validateActivePlayerCount(players);
    const isValid = activePlayersValidity.isValid;
    
    function updatePlayer(playerDelta: Player){
        const nextPlayers = updatePlayerInList(players, playerDelta);
        setPlayers(nextPlayers);
    }
    
    function addPlayer(){
        const player = getNewPlayer(players.length);
        const nextPlayers = [
            ...players,
            player,
        ];
        setPlayers(nextPlayers);
    }
    
    return (<div
        className="mj-setup"
    >
        <div>
            <button
                type="button"
                onClick={addPlayer}
            >Add player
            </button>
        </div>
        
        <div
            className="setup__inputs"
        >
            <div
                className="setup__player-wrapper"
            >
                {players.map((player) => {
                    const nameInputId = `name-input--${player.id}`;
                    return (<div
                        className="setup__player"
                        key={player.id}
                    >
                        <div className="player__name">
                            <label
                                htmlFor={nameInputId}
                            >Name:</label>
                            <input
                                id={nameInputId}
                                className="player__name-input"
                                type="search"
                                value={player.name}
                                onChange={(event) => {
                                    const newPlayer: Player = {
                                        ...player,
                                        name: event.target.value,
                                    };
                                    updatePlayer(newPlayer);
                                }}
                            />
                        </div>
                        
                        <div className="player__active">
                            <label>
                                <input
                                    className="player__active-input"
                                    type="checkbox"
                                    checked={player.isActive}
                                    onChange={(event) => {
                                        const checked = event.target.checked
                                        const newPlayer: Player = {
                                            ...player,
                                            isActive: checked,
                                        };
                                        updatePlayer(newPlayer);
                                    }}
                                />
                                Is active?
                            </label>
                        </div>
                    </div>);
                })}
            </div>
        </div>
        
        <div>
            <button
                type="button"
                onClick={addPlayer}
            >Add player
            </button>
        </div>
        
        <div
            className="setup__action-bar"
        >
            <button
                type="button"
                onClick={onCancel}
            >Cancel
            </button>
            
            <div>
                <div>
                    {isValid ? '' : activePlayersValidity.message.join('\n')}
                </div>
                <button
                    type="button"
                    disabled={!isValid}
                    onClick={() => {
                        onCommit(players);
                    }}
                >Save</button>
            </div>
        </div>
    </div>);
}
