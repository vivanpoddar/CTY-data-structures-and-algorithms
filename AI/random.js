class RandomAI extends PlayerAI {
    constructor(name){
        super(name);
        this.name = 'Random AI';
    }

    makeMove( gamestate, moves ){

        if( gamestate.isGameOver() ) { return [] };
        let validMoves = gamestate.getValidMoves();
        let pick = Math.floor(Math.random() * validMoves.length);

        for( let move of validMoves[pick] ) {
            moves.push( move )
        }
        
        return validMoves[pick];
    }
}