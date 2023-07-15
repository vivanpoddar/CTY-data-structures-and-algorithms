class VivanAI extends PlayerAI {

    constructor(name) {
        super(name)
        this.name = "Vivan AI"
    }
    makeMove( gameState, move ){
        let myTurn = gameState.whoseTurn();

        class MMNode {
            constructor(gameState, alpha, beta, isMax){
                this.gs = gameState;
                this.alpha = alpha;
                this.beta = beta;
                this.isMax = isMax;
                this.positions = new Map();
                this.kings = new Map();
            }

            alphabeta( depth, alpha, beta, startTime, maxTime ){
                if( depth === 0 ){
                    return this.score();
                }

                let validMoves = this.gs.getValidMoves();
                for( let vm of validMoves ){
                    if( this.alpha >= this.beta ){ break; }
                    
                    // Make a copy of the gamestate and make a move on it
                    let newGameState = this.gs.deepCopy();
                    newGameState.makeMove(vm);

                    // Create a child MMNode appropriately
                    let child = new MMNode(newGameState, this.alpha, this.beta, !this.isMax);

                    // run alphabeta with depth-1
                    let rtn = child.alphabeta(depth - 1, alpha, beta, startTime, maxTime);

                    // use the return to change alpha or beta correctly
                    if( this.isMax ){
                        if( rtn > this.alpha ){
                            this.alpha = rtn;
                        }
                    }
                    else {
                        if( rtn < this.beta ){
                            this.beta = rtn;
                        }
                    }
                }
                return this.isMax ? this.alpha : this.beta;
            }

            score() {
                for( let i = 1; i < 33; i++ ){
                    this.positions.set(i, gameState.getOwner(""+i));
                }

                let myPieces = 0;
                let score = 0;  
                let oppPieces = 0;
                let kingCount = 0;
                for(let value of this.positions.values()) {
                    if(value != 0) {
                        if(value == myTurn) {
                            myPieces += 1;
                        } else {
                            oppPieces += 1;
                        }
                    }
                }
                console.log(myPieces, oppPieces)
                score = myPieces - oppPieces;
                return score;
            }
        }

        // Set up for the root
        let alpha = Number.NEGATIVE_INFINITY;
        let beta = Number.POSITIVE_INFINITY;
        let maxDepth = 5;

        let vms = gameState.getValidMoves();
        for( let vm of vms ){

            // copy the gamestate and make a move
            let newGS = gameState.deepCopy();
            newGS.makeMove( vm );

            // Make an MMNode appropriately and run alphabeta on it
            let child = new MMNode(newGS, alpha, beta, true);
            let rtn = child.alphabeta(maxDepth);


            if( rtn > alpha ){
                alpha = rtn;

                // clear the array
                move.length = 0;

                // Copy the valid move into move
                for( let m of vm ){
                    move.push(m);
                }
            }
        }

        let rootNode = new MMNode(gameState, -Infinity, Infinity, true);
        let bestScore = -Infinity;
        let bestMove = null;
        let timeLimit = 1000;
        let startTime = Date.now();
        for (let depth = 1; depth <= 3; depth++) {
            let score = rootNode.alphabeta(depth, -Infinity, Infinity, startTime, timeLimit);
            if (score > bestScore) {
                bestScore = score;
                let bestMoves = rootNode.gs.getBestMoves();
                bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
            }
        }

        move.push(bestMove)
    }
}