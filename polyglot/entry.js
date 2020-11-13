"use strict";
const { peiceTypes, Random64,  RandomPiece,RandomCastle, RandomEnPassant,RandomTurn,PromotionPieces,encode_move, decode_move} = require("./encoding.js")
const Uint64BE = require("int64-buffer").Uint64BE;
class PolyglotEntry {
    static fromBuffer(buffer) {
      let dataView = new DataView(buffer);
      let e = new PolyglotEntry();
      e._key = new Uint64BE(buffer.slice(0, 8)).toString(16);
      if (e._key.length < 16) {
        let pad = 16 - e._key.length;
        for (let x=0; x < pad; x++) {
          e._key = '0'+ e._key;
        }
  
      }
      e._encoded_move = dataView.getUint16(8, false);
      e._algebraic_move = decode_move(dataView.getUint16(8, false));
      e._weight = dataView.getUint16(10, false);
      e._learn = dataView.getUint32(12,false);
      return e;
    }
    static withFEN(fen, algebraic_move, weight, learn) {
      e._key = hash(fen);
      e.algebraic_move = algebraic_move;
      e.weight = weight;
      e.learn = learn;
    }
    constructor() {
  
    }
    get key() {
      return this._key;
    }
    get algebraic_move() {
      return this._algebraic_move;
    }
    get encoded_move() {
      return this._encoded_move;
    }
    set algebraic_move(move) {
      this._algebraic_move = move;
      this._encoded_move = encode_move(move);
    }
    get weight() {
      return this._weight;
    }
    set weight(weight) {
      this._weight = weight;
    }
    get learn() {
      return this._learn;
    }
    set learn(learn) {
      this._learn = learn;
    }
    toJSON() {
      return {
        key : this._key,
        aglebraic_move : this._aglebraic_move,
        encoded_move : this._encoded_move,
        weight : this._weight,
        learn : this._learn
      };
    }
    toString() {
      return JSON.stringify(this, null, " ");
    }
  }
  module.exports = PolyglotEntry;