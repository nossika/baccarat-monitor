import type { GameResult } from './game';
import { Lucky6Type, Winner } from './game';

export const ODDS = {
  banker: 1 + 1,
  bankerWithLucky6: 1 + 0.5,
  player: 1 + 1,
  draw: 1 + 8,
  lucky6With2: 1 + 12,
  lucky6With3: 1 + 20,
}

export enum BetType {
  Banker,
  Player,
  Draw,
  Lucky6,
}

export const getBetRate = (result: GameResult) => {
  const banker = result.winner === Winner.Banker
    ? result.lucky6Type === Lucky6Type.None 
      ? ODDS.banker
      : ODDS.bankerWithLucky6
    : result.winner === Winner.Draw
      ? 1
      : 0;

  const player = result.winner === Winner.Player
    ? ODDS.player
    : result.winner === Winner.Draw
      ? 1
      : 0;

  const draw = result.winner === Winner.Draw
    ? ODDS.draw
    : 0;

  const lucky6 = result.lucky6Type !== Lucky6Type.None
    ? result.lucky6Type === Lucky6Type.With2Cards
      ? ODDS.lucky6With2
      : ODDS.lucky6With3
    : 0;
  
  return {
    [BetType.Banker]: banker,
    [BetType.Player]: player,
    [BetType.Draw]: draw,
    [BetType.Lucky6]: lucky6,
  };
}
