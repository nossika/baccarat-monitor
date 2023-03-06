import { Lucky6Type, runGame, Winner } from '@/game';
import { Card } from '@/poker';
import { ODDS } from '@/bet';
import logger from '@/logger';

export const autoRun = (round: number) => {
  let player = 0;
  let banker = 0;
  let draw = 0;
  let lucky6 = 0;
  let lucky6With2 = 0;

  const roundDigit = String(round).length;

  for (let r = 0; r < round; r++) {
    const game = runGame();

    switch (game.result.winner) {
      case Winner.Banker:
        banker += 1;
        break;
      case Winner.Player:
        player += 1;
        break;
      case Winner.Draw:
        draw += 1;
        break;
    }

    if (game.result.lucky6Type !== Lucky6Type.None) {
      lucky6 += 1;
      if (game.result.lucky6Type === Lucky6Type.With2Cards) {
        lucky6With2 += 1;
      }
    }

    logger.log(`[round-${String(r + 1).padStart(roundDigit, '0')}]`, getGameInfo(game));
  }

  const exceptation = getExceptation({
    round,
    banker,
    player,
    draw,
    lucky6,
    lucky6With2,
  });

  logger.log('----- RESULT -----');

  logger.log(`round --- ${round}`);
  logger.log(`banker --- win: ${withPercent(banker, round)} | exceptation: ${exceptation.banker}`);
  logger.log(`player --- win: ${withPercent(player, round)} | exceptation: ${exceptation.player}`);
  logger.log(`draw --- win: ${withPercent(draw, round)} | exceptation: ${exceptation.draw}`);
  logger.log(`lucky6 --- win: ${withPercent(lucky6, round)}[${withPercent(lucky6With2, round)}+${withPercent(lucky6 - lucky6With2, round)}] | exceptation: ${exceptation.lucky6}`);
};

const getGameInfo = (game: ReturnType<typeof runGame>) => {
  const resultStr = 'result: ' + {
    [Winner.Banker]: 'banker',
    [Winner.Player]: 'player',
    [Winner.Draw]: 'draw  ',
  }[game.result.winner];

  const getCardDesc = (cards: Card[]) => {
    const cardsString = cards.map(c => `${String(c.figure).padStart(2, '0')}${c.pattern}`);

    if (cardsString.length <= 2) {
      cardsString.push('---');
    }
    return cardsString.join('/');
  }

  const bankerCardsStr = `banker${game.detail.bankerPoint} (${getCardDesc(game.detail.banker.cards)})`;
  const playerCardsStr = `player${game.detail.playerPoint} (${getCardDesc(game.detail.player.cards)})`;

  const info = `${resultStr} --- ${bankerCardsStr} VS ${playerCardsStr}`;

  return info;
}

const withPercent = (number: number, total: number, fixed = 3) => {
  return `${number}(${(number / total * 100).toFixed(fixed)}%)`;
}


const getExceptation = ({
  round,
  banker,
  player,
  draw,
  lucky6,
  lucky6With2,
  base = round,
}: {
  round: number,
  banker: number,
  player: number,
  draw: number,
  lucky6: number,
  lucky6With2: number,
  base?: number,
}) => {
  const bankerExceptation = ((banker - lucky6) / round * ODDS.banker) + (lucky6 / round * ODDS.bankerWithLucky6) + (draw / round * 1);

  const playerExceptation = (player / round * ODDS.player) + (draw / round * 1);

  const drawExceptation = draw / round * ODDS.draw;

  const lucky6Exceptation = (lucky6With2 / round * ODDS.lucky6With2) + ((lucky6 - lucky6With2) / round * ODDS.lucky6With3);


  const withBase = (rate: number, fixed = 2) => {
    return +(base * rate).toFixed(fixed);
  }

  return {
    banker: withBase(bankerExceptation),
    player: withBase(playerExceptation),
    draw: withBase(drawExceptation),
    lucky6: withBase(lucky6Exceptation),
  }
};
