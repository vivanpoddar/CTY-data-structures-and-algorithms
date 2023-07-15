class VivanAI extends PlayerAI {

    constructor(name) {
        super(name)
        this.name = "Vivan p"
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

            alphabeta( depth ){
                if( depth === 0 ){
                    return this.score();
                }

                let validMoves = this.gs.getValidMoves();
                for( let vm of validMoves ) {
                    if( this.alpha >= this.beta ){ break; }
                    
                    // Make a copy of the gamestate and make a move on it
                    let newGameState = this.gs.deepCopy();
                    newGameState.makeMove(vm);

                    // Create a child MMNode appropriately
                    let child = new MMNode(newGameState, this.alpha, this.beta, !this.isMax);

                    // run alphabeta with depth-1
                    let rtn = child.alphabeta(depth - 1);

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

                // Return the correct value based on me being a minimizer of maximizer
                if( this.isMax ){
                    return this.alpha;
                }
                else {
                    return this.beta;
                }

            }

            iterativeDeepening(timeLimit) {
                let bestMove = null;
                let depth = 1;
                let startTime = Date.now();
                while (Date.now() - startTime < timeLimit) {
                    let validMoves = this.gs.getValidMoves();
                    for (let vm of validMoves) {
                        let newGameState = this.gs.deepCopy();
                        newGameState.makeMove(vm);
                
                        let child = new MMNode(newGameState, -Infinity, Infinity, false);
                
                        let rtn = child.alphabeta(depth - 1);
                
                        if (bestMove === null || rtn > bestMove.score) {
                            bestMove = {
                                move: vm,
                                score: rtn,
                            };
                        }
                    }
                    depth += 1;
                }
                if (bestMove === null) {
                    return this.isMax ? -Infinity : Infinity;
                } else {
                    this.alpha = bestMove.score;
                    this.beta = bestMove.score;
                    return this.interrupted ? null : (this.isMax ? this.alpha : this.beta);
                }
            }

            score() {
                for (let i = 1; i < 33; i++) {
                    this.positions.set(i, this.gs.getOwner("" + i));
                }
                for (let i = 1; i < 33; i++) {
                    this.kings.set(i, this.gs.getLevel("" + i));
                }
            
                let myTurn = this.gs.whoseTurn();
                let myPieces = 0;
                let oppPieces = 0;
                let myKingCount = 0;
                let oppKingCount = 0;
                let myMobility = 0;
                let oppMobility = 0;
                let centerControl = 0;
                let piecePosition = 0;
                let piecePromotion = 0;
                let mySafePieces = 0;
                let oppSafePieces = 0;
                let attack = 0;

                for (let [key, value] of this.positions) {
                    if (value != 0) {
                        if (value == myTurn) {
                            if (this.kings.get(key) > 1) {
                                myKingCount += 1;
                            }
                            myPieces += 1;
                            myMobility += this.gs.getValidMoves("" + key).length;
                            if (key >= 14 && key <= 19) {
                                centerControl += 1;
                            }
                            if (key >= 20 && key <= 25) {
                                piecePosition += 1;
                            }
                            if (this.kings.get(key) == 1 && key >= 28) {
                                piecePromotion += 0.75;
                            }
                            if(this.gs.getValidMoves("" + key).length <= 3){
                                attack += 0.5;
                            }
                            // if (isSafe(key, myTurn)) {
                            //     mySafePieces += 1;
                            // }
                            } else {
                            if (this.kings.get(key) > 1) {
                                oppKingCount += 1;
                            }
                            oppPieces += 1;
                            oppMobility += this.gs.getValidMoves("" + key).length;
                            if (key >= 14 && key <= 19) {
                                centerControl -= 1;
                            }
                            if (key >= 8 && key <= 13) {
                                piecePosition -= 1;
                            }
                            if (this.kings.get(key) == 1 && key <= 5) {
                                piecePromotion -= 0.75;
                            }
                            // if(isSafe(key, myTurn)){
                            //     oppSafePieces -= 1;
                            // }
                        }
                    }
                }
                let score = 10 * (myKingCount - oppKingCount) + 5 * (myPieces - oppPieces) + 2 * (myMobility - oppMobility) + 2 * centerControl + piecePosition + piecePromotion + attack + 0.5 * (mySafePieces - oppSafePieces);
                return score;
            }

            getBestMove(maxDepth) {
                let bestMove = this.iterativeDeepening(maxDepth);
                return bestMove;
            }
        }



        // Set up for the root
        let alpha = Number.NEGATIVE_INFINITY;
        let beta = Number.POSITIVE_INFINITY;

        let vms = gameState.getValidMoves();
        for( let vm of vms ){

            // copy the gamestate and make a move
            let newGS = gameState.deepCopy();
            newGS.makeMove( vm );

            // Make an MMNode appropriately and run alphabeta on it
            let child = new MMNode(newGS, alpha, beta, true);
            let rtn = child.getBestMove(1000);


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
    }
}