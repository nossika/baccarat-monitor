import { Card, CardFigure } from '@/poker';

export const getPoint = (figure: CardFigure): number => {
  if (figure === CardFigure.Ace) {
    return 1;
  }

  if (
    [
      CardFigure.Two,
      CardFigure.Three,
      CardFigure.Four,
      CardFigure.Five,
      CardFigure.Six,
      CardFigure.Seven,
      CardFigure.Eight,
      CardFigure.Nine,
    ].includes(figure)
  ) {
    return +figure;
  }

  if (
    [
      CardFigure.Ten,
      CardFigure.Jack,
      CardFigure.Queen,
      CardFigure.King,
    ].includes(figure)
  ) {
    return 10;
  }
};

export const getCardsPoint = (cards: Card[]) => {
  const sum = cards.reduce((s, c) => s + getPoint(c.figure), 0);
  return sum % 10;
};