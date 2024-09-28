import { Player } from '../types/Player.ts';

export interface IScoreProps {
    players: Player[];
}

export const ScoreDisplay = (props: IScoreProps) => {
    const {
        players,
    } = props;
    
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
    <table>
        {rows.map((row, rowIndex) => {
            return (<tr>
                <td>{rowIndex+1}</td>
                {row.map((score) => {
                    return (<td>{score}</td>);
                })}
            </tr>);
        })}
    </table>
</div>
    );
};

