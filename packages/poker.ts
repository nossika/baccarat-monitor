export interface Card {
  figure: CardFigure,
  pattern: CardPattern,
}

export enum CardPattern {
  Spade = '♠️',
  Heart = '♥️',
  Diamond = '♦️',
  Club = '♣️',
}

export enum CardFigure {
  Ace = 'A',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
}

export const genCards = (count: number): Card[] => {
  const cards: Card[] = [];

  for (let i = 0; i < count; i++) {
    [
      CardPattern.Spade,
      CardPattern.Heart,
      CardPattern.Diamond,
      CardPattern.Club,
    ].forEach((pattern) => {
      [
        CardFigure.Ace,
        CardFigure.Two,
        CardFigure.Three,
        CardFigure.Four,
        CardFigure.Five,
        CardFigure.Six,
        CardFigure.Seven,
        CardFigure.Eight,
        CardFigure.Nine,
        CardFigure.Ten,
        CardFigure.Jack,
        CardFigure.Queen,
        CardFigure.King,
      ].forEach((figure) => {
        const card: Card = {
          figure,
          pattern,
        }

        cards.push(card);
      });
    });
  }

  return shuffle(cards);
}

export const shuffle = <T,>(arr: T[]): T[] => {
  for (let i = 0; i < arr.length; i++) {
    const random = Math.random() * (arr.length - i) | 0;
    const fixed = arr.length - i - 1;
    [arr[random], arr[fixed]] = [arr[fixed], arr[random]];
  }

  return arr;
}

export class Poker {
  cards: Card[] = [];
  constructor(count = 1) {
    this.cards = genCards(count);
    shuffle(this.cards);
  }

  draw() {
    const card = this.cards.pop();
    if (!card) throw new Error('poker run out');
    return card;
  }
}

