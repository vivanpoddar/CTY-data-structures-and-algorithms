class VivanAI extends PlayerAI {
    constructor(name) {
        super(name);
        this.name = 'Checkers Grandmaster (2000)'
    }

    makeMove(gamestate, moves) {
        if (this.isMax) {
            let child = new MinmaxNode(this.gamestate, this.alpha, this.beta, !this.isMax);
            let score = child.quiescenceSearch();
        
        if (score > this.alpha) {
            this.alpha = score;
        }
        } else {
            let child = new MinmaxNode(this.gamestate, this.alpha, this.beta, !this.isMax);
            let score = child.quiescenceSearch();
        
            if (score < this.beta) {
                this.beta = score;
            }
        }

        class MinmaxNode {
            constructor(gamestate, alpha, beta, isMax) {
                this.gamestate = gamestate
                this.alpha = alpha
                this.beta = beta
                this.isMax = isMax
            }

            MrSeaAlphaBeta( depth ){
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

            alphabeta(depth) {
                if(depth===0 || this.gamestate.isGameOver()) {
                    return this.score()
                }

                if(this.isMax) {
                    let bestScore = Number.NEGATIVE_INFINITY;

                    for (let move of validMoves) {
                        let newGamestate = this.gamestate.deepcopy();
                        newGamestate.makeMove(move);

                        let child = new MinmaxNode(newGamestate, this.alpha, this.beta, !this.isMax);
                        let score = child.alphabeta(depth - 1);

                        if (score > bestScore) {
                            bestScore = score;
                        }

                        if (bestScore > this.alpha) {
                            this.alpha = bestScore;
                        }

                        if (this.alpha >= this.beta) {
                            break;
                        }
                    } 
                } else {
                    let bestScore = Number.POSITIVE_INFINITY;

                    for (let move of validMoves) {
                        let newGamestate = this.gamestate.deepcopy();
                        newGamestate.makeMove(move);

                        let child = new MinmaxNode(newGamestate, this.alpha, this.beta, !this.isMax);
                        let score = child.alphabeta(depth-1);

                        if(score < bestScore) {
                            bestScore = score;
                        }

                        if(bestScore > this.beta) {
                            this.beta = bestScore;
                        }

                        if(this.alpha >= this.beta) {  
                            break;
                        }
                    }
                }
            }

            getPieces(player) {
                let pieces = [];
              
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        let piece = this.board[row][col];
                
                        if (piece !== null && piece.player === player) {
                        pieces.push([row, col]);
                        }
                    }
                }
              
                return pieces;
            }

            getQuietMoves() {
                let moves = [];
              
                for (let piece of this.getPieces(this.currentPlayer)) {
                    let row = piece[0];
                    let col = piece[1];
                
                    if (!(this.getLevel(piece) > 1)) {
                    // Check for regular moves
                    if (this.currentPlayer === 'red') {
                      if (this.isValidMove(piece, [row + 1, col - 1])) {
                        moves.push([piece, [row + 1, col - 1]]);
                      }
              
                      if (this.isValidMove(piece, [row + 1, col + 1])) {
                        moves.push([piece, [row + 1, col + 1]]);
                      }
                    } else {
                      if (this.isValidMove(piece, [row - 1, col - 1])) {
                        moves.push([piece, [row - 1, col - 1]]);
                      }
              
                      if (this.isValidMove(piece, [row - 1, col + 1])) {
                        moves.push([piece, [row - 1, col + 1]]);
                      }
                    }
                    } else {
                        let jumps = this.getJumps(piece);
                
                        for (let jump of jumps) {
                            moves.push([piece, jump]);
                        }
                    }
                }
                return moves;
            }

            quiescenceSearch(depth) {
                if (depth === 0 || this.gamestate.isGameOver()) {
                  return this.score();
                }
            
                if (this.isMax) {
                  let bestScore = this.score();
                  let quietMoves = this.gamestate.getQuietMoves();
            
                  for (let move of quietMoves) {
                    let newGamestate = this.gamestate.deepcopy();
                    newGamestate.makeMove(move);
            
                    let child = new MinmaxNode(newGamestate, this.alpha, this.beta, !this.isMax);
                    let score = child.quiescence(depth - 1);
            
                    if (score > bestScore) {
                      bestScore = score;
                    }
            
                    if (bestScore > this.alpha) {
                      this.alpha = bestScore;
                    }
            
                    if (this.alpha >= this.beta) {
                        break;
                    }
                }
            
                  return bestScore;
                } else {
                    let bestScore = this.score();
                    let quietMoves = this.gamestate.getQuietMoves();
                
                    for (let move of quietMoves) {
                        let newGamestate = this.gamestate.deepcopy();
                        newGamestate.makeMove(move);
                
                        let child = new MinmaxNode(newGamestate, this.alpha, this.beta, !this.isMax);
                        let score = child.quiescence(depth - 1);
                
                        if (score < bestScore) {
                            bestScore = score;
                        }
                
                        if (bestScore < this.beta) {
                            this.beta = bestScore;
                        }
                
                        if (this.alpha >= this.beta) {
                            break;
                        }
                    }
                    return bestScore;
                }
            }

            score(gamestate) {
                let score = 0;

                let validMoves = gamestate.getValidMoves();

                if(gamestate.whoseTurn() === 'red') {

                }
                let playerPieces = gamestate.getPieces(gamestate.currentPlayer);
                let opponentPieces = gamestate.getPieces(gamestate.opponent);
              
                score += (playerPieces.length - opponentPieces.length) * 10;
              
                let playerKings = gamestate.getLevel();
                let opponentKings = gamestate.getLevel();
              
                score += (playerKings.length - opponentKings.length) * 20;
                

                for (let piece of playerPieces) {
                    let row = piece[0];
                    let col = piece[1];
                
                    if (gamestate.currentPlayer === 'red') {
                        score += row * 2;
                    } else {
                        score += (7 - row) * 2;
                    }
                
                    if (gamestate.getLevel(piece) > 1) {
                        score += 10;
                    }
                }
              
                for (let piece of opponentPieces) {
                    let row = piece[0];
                    let col = piece[1];
                
                    if (gamestate.currentPlayer === 'red') {
                        score -= (7 - row) * 2;
                    } else {
                        score -= row * 2;
                    }
                
                    if (gamestate.getLevel(piece) > 1) {
                        score -= 10;
                    }
                }
              
                return score;
              }
        }
    }
}

