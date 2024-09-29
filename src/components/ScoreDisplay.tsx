import clsx from 'clsx';
import {useState} from 'react';
import { Player } from '../types/Player.ts';
import {GameState} from '../types/GameState.ts';
import '../styles/ScoreDisplay.scss';
import {getActivePlayers} from '../lib/ValidityUtil.ts';

export interface IScoreProps {
    gameState: GameState;
}

export const ScoreDisplay = (props: IScoreProps) => {
    const [showAllScores, setShowAllScores] = useState(false);
    
    const {
        gameState,
    } = props;
    const playersAll = gameState.players;
    let players = playersAll;
    if (showAllScores){
        players = playersAll
            .concat()
            .sort((a, b) => {
                const result = (a.isActive === b.isActive)
                    ? 0
                        : a.isActive && !b.isActive
                            ? -1
                            : 1;
                return result;
            });
    } else {
        players = getActivePlayers(playersAll)
    }
    
    const rows: number[][] = [];
    
    players.forEach((player, playerIndex) => {
        player.scoreList.forEach((score, index) => {
            let row = rows[index];
            if (!row){
                row = [];
                rows[index] = row;
            }
            
            row[playerIndex] = score;
        });
    });
    
    return (
<div className="score-display">
    <h2>Scores</h2>
    <div>
        <label>
            <input
                type="checkbox"
                onChange={(event) => {
                    const showAll = event.target.checked;
                    setShowAllScores(showAll);
                }}
            />
            Show all player scores
        </label>
    </div>
    
    <div className="table-responsive">
        <table
            className={clsx('table', {
                'score--show-all': showAllScores,
            })}
        >
            <thead>
                <tr>
                    <th
                        className="score-col-1"
                    >#</th>
                    {players.map((player, index) => {
                        return (<th
                            key={index}
                            className="player-score-col"
                        >{player.name}</th>);
                    })}
                </tr>
            </thead>
            <tbody>
                {playerTotalRow(players)}
                
                {rows.map((row, rowIndex) => {
                    return (<tr key={rowIndex}>
                        <td
                            className="score-col-1"
                        >{rowIndex+1}</td>
                        {row.map((score, scoreIndex) => {
                            const a = score > 0 ? 'win' : score < 0 ? 'loss' : '';
                            return (<td
                                className={a}
                                key={scoreIndex}
                            >{score}</td>);
                        })}
                    </tr>);
                })}
                
                {gameState.roundCount > 10 && playerTotalRow(players)}
                {generateStats(players)}
            </tbody>
        </table>
    </div>
</div>
    );
};

function playerTotalRow(players: Player[]){
    return (<tr
        className="score-display__total-row"
    >
        <td
            className="score-col-1"
        >Total:</td>
        {players.map((player, index) => {
            return (<td
                key={index}
                className="score-display__player-total"
            >{player.scoreTotal}</td>);
        })}
    </tr>);
}

function generateStats(players: Player[]){
    const playerStats: Array<{wins: number, losses: number}> = new Array(players.length);
    players.forEach((player, index) => {
        let wins = 0;
        let losses = 0;
        player.scoreList.forEach((score) => {
            if (score > 0){
                wins++;
            } else if (score < 0){
                losses++;
            }
        });
        
        playerStats[index] = {
            wins,
            losses,
        };
    });
    
    return (<>
    <tr
        className=""
    >
        <td
            className="score-col-1"
        >Wins</td>
        {playerStats.map((stat) => {
            return (<td>{stat.wins}</td>);
        })}
    </tr>
    <tr
        className=""
    >
        <td
            className="score-col-1"
        >Losses</td>
        {playerStats.map((stat) => {
            return (<td>{stat.losses}</td>);
        })}
    </tr>
</>);
}
