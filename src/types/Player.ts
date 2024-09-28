export type Player = {
    id: number,
    
    name: string,
    isActive: boolean,
    
    /**
     * Total player score
     */
    scoreTotal: number,
    scoreList: number[],
    
    /**
     * Current round score input.
     * 
     * Needs to be a string because we want to 
     * allow shorthand score entry.
     */
    curScoreInput: string,
};
