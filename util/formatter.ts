import { runGame, Winner } from "@/game";
import { Card } from "@/poker";

export const getGameInfo = (game: ReturnType<typeof runGame>) => {
  const resultStr = 'result: ' + {
    [Winner.Banker]: 'banker',
    [Winner.Player]: 'player',
    [Winner.Tie]: 'tie',
  }[game.result.winner].padEnd(6, ' ');

  const getCardDesc = (cards: Card[]) => {
    const cardsString = cards.map(c => `${c.pattern}${c.figure}`);

    return cardsString.join('/');
  }

  const playerCardsStr = `player<${game.detail.playerPoint}> (${getCardDesc(game.detail.player.cards)})`;
  const bankerCardsStr = `banker<${game.detail.bankerPoint}> (${getCardDesc(game.detail.banker.cards)})`;

  const info = `${resultStr} ----- ${playerCardsStr} vs ${bankerCardsStr}`;

  return info;
}