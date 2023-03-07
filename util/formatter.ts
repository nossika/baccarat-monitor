import { runGame, Winner } from "@/game";
import { Card } from "@/poker";

export const getGameInfo = (game: ReturnType<typeof runGame>) => {
  const resultStr = 'result: ' + {
    [Winner.Banker]: 'banker',
    [Winner.Player]: 'player',
    [Winner.Tie]: 'tie   ',
  }[game.result.winner];

  const getCardDesc = (cards: Card[]) => {
    const cardsString = cards.map(c => `${String(c.figure).padStart(2, '0')}${c.pattern}`);

    if (cardsString.length <= 2) {
      cardsString.push('---');
    }

    return cardsString.join('/');
  }

  const bankerCardsStr = `banker[${game.detail.bankerPoint}] (${getCardDesc(game.detail.banker.cards)})`;
  const playerCardsStr = `player[${game.detail.playerPoint}] (${getCardDesc(game.detail.player.cards)})`;

  const info = `${resultStr} ----- ${bankerCardsStr} VS ${playerCardsStr}`;

  return info;
}