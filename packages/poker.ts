export interface Card {
  figure: number,
  pattern: CardPattern,
}

export enum CardPattern {
  Spade = 'a',
  Heart = 'b',
  Diamond = 'c',
  Club = 'd',
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
      for (let figure = 1; figure <= 13; figure++) {
        const card: Card = {
          figure,
          pattern,
        }

        cards.push(card);
      }
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

export const calcPoint = (cards: Card[]): number => {
  const sum = cards.reduce((s, c) => s + (c.figure >= 10 ? 0 : c.figure), 0);
  return sum % 10;
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

