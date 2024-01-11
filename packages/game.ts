import { Poker } from '@/poker';
import { getCardsPoint } from '@@/util/point';
import type { Card } from '@/poker';

export const runGame = () => {
  const poker = new Poker(8);

  const player = new Player();
  const banker = new Banker();

  player.add(poker.draw());
  banker.add(poker.draw());
  player.add(poker.draw());
  banker.add(poker.draw());

  if (!player.isDone() && !banker.isDone()) {
    if (player.needThird()) {
      player.add(poker.draw());
    }

    if (banker.needThird(
      player.cards.length,
      getCardsPoint([player.lastCard()]),
    )) {
      banker.add(poker.draw());
    }
  }

  const bankerPoint = getCardsPoint(banker.cards);
  const playerPoint = getCardsPoint(player.cards);

  const winner = getWinner(playerPoint, bankerPoint);
  const isLucky6 = winner === Winner.Banker && bankerPoint === 6;
  const lucky6Type = isLucky6 
    ? banker.cards.length === 2 
      ? Lucky6Type.With2Cards 
      : Lucky6Type.With3Cards
    : Lucky6Type.None;

  const detail = {
    banker,
    bankerPoint,
    player,
    playerPoint,
  };

  const result: GameResult = {
    winner,
    lucky6Type,
  };

  return {
    detail,
    result,
  }
}

class Player {
  cards: Card[] = [];

  add(card: Card): void {
    this.cards.push(card);
  }
  
  needThird(): boolean {
    return getCardsPoint(this.cards) <= 5;
  }

  isDone(): boolean {
    return getCardsPoint(this.cards) >= 8;
  }

  lastCard(): Card {
    return this.cards[this.cards.length - 1];
  }
}

class Banker {
  cards: Card[] = [];

  add(card: Card): void {
    this.cards.push(card);
  }

  needThird(playerCardsLength: number, playerLastCardPoint: number): boolean {
    const point = getCardsPoint(this.cards);

    if (playerCardsLength <= 2) {
      return point <= 5;
    }

    switch (point) {
      case 0:
      case 1:
      case 2:
        return true;
      case 3:
        return playerLastCardPoint !== 8;
      case 4:
        return ![0, 1, 8, 9].includes(playerLastCardPoint);
      case 5:
        return ![0, 1, 2, 3, 8, 9].includes(playerLastCardPoint);
      case 6:
        return [6, 7].includes(playerLastCardPoint);
      case 7:
      case 8:
      case 9:
        return false;
      default:
        return false;
    }
  }

  isDone(): boolean {
    return getCardsPoint(this.cards) >= 8;
  }
}

export enum Winner {
  Player = 1,
  Banker,
  Tie,
}

export enum Lucky6Type {
  None,
  With2Cards,
  With3Cards,
}

export interface GameResult {
  winner: Winner,
  lucky6Type: Lucky6Type,
}

const getWinner = (playerPoint: number, bankerPoint: number): Winner => {
  if (playerPoint > bankerPoint) {
    return Winner.Player;
  }

  if (playerPoint < bankerPoint) {
    return Winner.Banker;
  }

  return Winner.Tie;
}
