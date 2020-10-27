'use strict';

window.ChessBoard = function(boardId, config) {
  var self = this;

  var options = {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
	size: 20,
    resize: true,
    orientation: 'w',
    minSquareSize: 20,
    maxSquareSize: 64
  };

  for (var key in config) {
    options[key] = config[key];
  }

  var boardBorderWidth, squareSize, boardWidthFix, selectedSquares = [];
  var board = {};
  var promotion = {
    pieces: [],
    selectedElement: null
  };

  function calcSquare(row, column) {
    return String.fromCharCode(97 + column) + row;
  }

  function createBoard() {
    var boardElement = document.getElementById(boardId);

    boardElement.classList.add('chessboard');

    if (options.orientation === 'b') {
      boardElement.classList.add('flipped');
    }

    board.element = boardElement;

    for (var r = 8; r >= 1; r--) {
      var rowElement = document.createElement('div');

      board[r] = {
        element: rowElement
      };

      for (var c = 0; c < 8; c++) {
        var squareElement = document.createElement('div');
        
        if ((r + c) % 2 === 0) {
          squareElement.className = 'white square';
        } else {
          squareElement.className = 'black square';
        }

        squareElement.setAttribute('data-square', calcSquare(r, c));

        if (options.onSquareClick) {
          squareElement.addEventListener('click', onSquareClick);
        }

        board[r][c] = {
          element: squareElement,
          piece: null
        };
        
        rowElement.appendChild(squareElement);
      }

      boardElement.appendChild(rowElement);
    }
  }

  function createPromotionPiece(piece) {
    var pieceElement = document.createElement('div');

    pieceElement.className = 'square ' + piece;
    pieceElement.setAttribute('data-piece', piece);

    promotion.pieces.push({ piece: piece, element: pieceElement });

    return pieceElement;
  }

  function createPromotionPieces(color) {
    var piecesWrapper = document.createElement('div');
    piecesWrapper.className = 'pieces';

    piecesWrapper.appendChild(createPromotionPiece(color + 'Q'));
    piecesWrapper.appendChild(createPromotionPiece(color + 'R'));
    piecesWrapper.appendChild(createPromotionPiece(color + 'N'));
    piecesWrapper.appendChild(createPromotionPiece(color + 'B'));

    if (color === 'w') {
      promotion.whitePiecesWrapper = piecesWrapper;
    } else {
      promotion.blackPiecesWrapper = piecesWrapper;
    }
  }

  function createPromotion() {
    // Pieces
    createPromotionPieces('w');
    createPromotionPieces('b');

    // Promote button
    var promoteButton = document.createElement('button');
    var promoteButtonText = document.createTextNode('Promote');

    promoteButton.appendChild(promoteButtonText);
    promotion.promoteButton = promoteButton;

    var promoteButtonWrapper = document.createElement('div');

    promoteButtonWrapper.appendChild(promoteButton);
    promotion.promoteButtonWrapper = promoteButtonWrapper;

    // Promotion wrapper
    var promotionWrapper = document.createElement('div');
    promotionWrapper.className = 'promotion-wrapper';

    promotionWrapper.appendChild(promotion.whitePiecesWrapper);
    promotionWrapper.appendChild(promotion.blackPiecesWrapper);
    promotionWrapper.appendChild(promoteButtonWrapper);

    promotion.wrapper = promotionWrapper;

    // Promotion overlay
    var overlay = document.createElement('div');
    overlay.className = 'promotion-overlay';
    promotion.overlay = overlay;

    overlay.appendChild(promotionWrapper);
    board.element.appendChild(overlay);

    // Set click handlers
    for (var i = 0, len = promotion.pieces.length; i < len; i++) {
      promotion.pieces[i].element.addEventListener('click', onPromotionPieceClick);
    }

    promoteButton.addEventListener('click', onPromotionButtonClick);
  }

  function onPromotionPieceClick(event) {
    var clickedElement = event.target;

    // Selected piece clicked
    if (clickedElement === promotion.selectedElement) {
      return;
    }

    // First time piece is selected
    if (promotion.selectedElement === null) {
      promotion.selectedElement = clickedElement;
      clickedElement.classList.add('selected');
      promotion.promoteButton.disabled = false;
      return;
    }

    // Selecting another piece
    promotion.selectedElement.classList.remove('selected');
    promotion.selectedElement = clickedElement;
    clickedElement.classList.add('selected');
  }

  function onPromotionButtonClick() {
    var piece = promotion.selectedElement.getAttribute('data-piece');
    var shortPiece = String.fromCharCode(piece.charCodeAt(1) + 32);

    promotion.overlay.style.display = 'none';

    if (promotion.callback) {
      promotion.callback(shortPiece);
    }
  }

  function calcSquareSize() {
    var parentStyle = getComputedStyle(board.element.parentNode);
    var parentWidth = parseInt(parentStyle.width) - parseInt(parentStyle.paddingLeft)
                                                  - parseInt(parentStyle.paddingRight);
    
    squareSize = Math.floor((parentWidth - 2 * boardBorderWidth) / 8);
    squareSize = Math.min(squareSize, options.maxSquareSize);
    squareSize = Math.max(squareSize, options.minSquareSize);
  }

  function setBoardSize(size) {
    calcSquareSize();
	if(size) squareSize = size;

    var squareSizePx = squareSize + 'px';
    var rowWidthPx = (8 * squareSize) + 'px';
    var backgroundSizePx = (6 * squareSize) + 'px';

    // Update board elements
    board.element.style.width = (8 * squareSize) + boardWidthFix + 'px';

    for (var r = 8; r >= 1; r--) {
      board[r].element.style.width = rowWidthPx;
      board[r].element.style.height = squareSizePx;

      for (var c = 0; c < 8; c++) {
        board[r][c].element.style.width = squareSizePx;
        board[r][c].element.style.height = squareSizePx;
        board[r][c].element.style.backgroundSize = backgroundSizePx;
        board[r][c].element.style.backgroundPosition = backgroundPosition(board[r][c].piece);
      }
    }

    // Update promotion elements
    promotion.wrapper.style.width = (4 * squareSize) + 'px';
    promotion.wrapper.style.height = (2 * squareSize) + 'px';
    promotion.wrapper.style.marginTop = (3 * squareSize) + 'px';

    promotion.whitePiecesWrapper.style.height = squareSizePx;
    promotion.blackPiecesWrapper.style.height = squareSizePx;

    for (var i = 0, len = promotion.pieces.length; i < len; i++) {
      var piece = promotion.pieces[i].piece;
      var element = promotion.pieces[i].element;

      element.style.width = squareSizePx;
      element.style.height = squareSizePx;
      element.style.backgroundSize = backgroundSizePx;
      element.style.backgroundPosition = backgroundPosition(piece);
    }

    promotion.promoteButtonWrapper.style.height = squareSizePx;
    promotion.promoteButtonWrapper.style.lineHeight = squareSizePx;
    promotion.promoteButton.style.fontSize = squareSize / 2.5 + 'px';
  }

  function backgroundPosition(piece) {
    switch (piece) {
      case 'wP': return '0 0';
      case 'wB': return -1 * squareSize + 'px 0';
      case 'wN': return -2 * squareSize + 'px 0';
      case 'wR': return -3 * squareSize + 'px 0';
      case 'wQ': return -4 * squareSize + 'px 0';
      case 'wK': return -5 * squareSize + 'px 0';
      case 'bP': return '0 ' + -1 * squareSize + 'px';
      case 'bB': return -1 * squareSize + 'px ' + -1 * squareSize + 'px';
      case 'bN': return -2 * squareSize + 'px ' + -1 * squareSize + 'px';
      case 'bR': return -3 * squareSize + 'px ' + -1 * squareSize + 'px';
      case 'bQ': return -4 * squareSize + 'px ' + -1 * squareSize + 'px';
      case 'bK': return -5 * squareSize + 'px ' + -1 * squareSize + 'px';
    }
  }

  function getBoardSquare(square) {
    var c = square[0].charCodeAt(0) - 97;
    var r = +square[1];

    return board[r][c];
  }

  this.selectSquare = function(square) {
    if (selectedSquares.indexOf(square) > -1) {
      return;
    }

    var boardSquare = getBoardSquare(square);

    boardSquare.element.classList.add('selected');
    selectedSquares.push(square);
  };

  this.unselectSquare = function(square) {
    var index = selectedSquares.indexOf(square);

    if (index === -1) {
      return;
    }

    var boardSquare = getBoardSquare(square);

    boardSquare.element.classList.remove('selected');
    selectedSquares.splice(index, 1);
  };

  this.unselectAllSquares = function() {
    for (var i = 0, len = selectedSquares.length; i < len; i++) {
      var boardSquare = getBoardSquare(selectedSquares[i]);

      boardSquare.element.classList.remove('selected');
    }

    selectedSquares = [];
  };

  function onSquareClick(event) {
    var clickedSquare = event.target.getAttribute('data-square');

    options.onSquareClick(clickedSquare, selectedSquares);
  }

  function clearSquare(square) {
    var boardSquare = getBoardSquare(square);
    var piece = boardSquare.piece;

    if (piece !== null) {
      boardSquare.element.classList.remove(piece);
    }

    boardSquare.piece = null;
  }

  function repeatChar(char, count) {
    for (var result = ''; result.length < count;) {
      result += char;
    }

    return result;
  }

  function putPiece(square, piece) {
    var boardSquare = getBoardSquare(square);
    var currentPiece = boardSquare.piece;

    if (currentPiece !== null) {
      boardSquare.element.classList.remove(currentPiece);
    }

    boardSquare.element.classList.add(piece);
    boardSquare.element.style.backgroundPosition = backgroundPosition(piece);
    boardSquare.piece = piece;
  }

  function calcPieceFromFenPiece(fenPiece) {
    var fenPieceCharCode = fenPiece.charCodeAt(0);

    if (fenPieceCharCode >= 97) { // Black
      return 'b' + String.fromCharCode(fenPieceCharCode - 32);
    } else { // White
      return 'w' + fenPiece;
    }
  }

  this.setPosition = function(fen) {	
    var fenFields = fen.split(' ');
    var rows = fenFields[0].split('/');

    for (var r = 0; r < 8; r++) {
      rows[r] = rows[r].replace(/\d/g, function(number) { 
        return repeatChar('.', +number);
      });

      for (var c = 0; c < 8; c++) {
        var square = calcSquare(8 - r, c);

        if (rows[r][c] === '.') {
          clearSquare(square);
        } else {
          putPiece(square, calcPieceFromFenPiece(rows[r][c]));
        }
      }
    }
  };

  this.askPromotion = function(color, callback) {
    promotion.callback = callback;
    promotion.whitePiecesWrapper.style.display = (color === 'w' ? 'block' : 'none');
    promotion.blackPiecesWrapper.style.display = (color === 'b' ? 'block' : 'none');

    promotion.promoteButton.disabled = true;

    if (promotion.selectedElement !== null) {
      promotion.selectedElement.classList.remove('selected');
    }

    promotion.selectedElement = null;

    promotion.overlay.style.display = 'block';
  };

  createBoard();
  createPromotion();

  setTimeout(function() { // Without setTimeout, boxSizing is not set yet.
    var boardStyle = getComputedStyle(board.element);

    // Assumption: all 4 borders have the same width
    boardBorderWidth = parseInt(boardStyle.borderTopWidth);

    if (boardStyle.boxSizing === 'border-box') {
      boardWidthFix = 2 * boardBorderWidth;
    } else  {
      boardWidthFix = 0;
    }

    setBoardSize(options.size);
    
    self.setPosition(options.fen);
  });

  if (options.resize) {
    //window.addEventListener('resize', setBoardSize);
  }
};
