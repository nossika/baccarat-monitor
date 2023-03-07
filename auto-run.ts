import logger from '@@/util/logger';
import { getGameInfo } from '@@/util/formatter';
import { BetType, getBetRate, ODDS } from '@/bet';
import { Lucky6Type, runGame, Winner } from '@/game';

export const autoRun = (round: number, showRoundInfo = false) => {
  let player = 0;
  let banker = 0;
  let tie = 0;
  let lucky6 = 0;
  let lucky6With2 = 0;

  let playerRate = 0;
  let bankerRate = 0;
  let tieRate = 0;
  let lucky6Rate = 0;

  const roundDigit = String(round).length;

  logger.log('----- START -----');

  for (let r = 0; r < round; r++) {
    const game = runGame();

    switch (game.result.winner) {
      case Winner.Banker:
        banker += 1;
        break;
      case Winner.Player:
        player += 1;
        break;
      case Winner.Tie:
        tie += 1;
        break;
    }

    if (game.result.lucky6Type !== Lucky6Type.None) {
      lucky6 += 1;
      if (game.result.lucky6Type === Lucky6Type.With2Cards) {
        lucky6With2 += 1;
      }
    }

    const rate = getBetRate(game.result);

    playerRate += rate[BetType.Player] - 1;
    bankerRate += rate[BetType.Banker] - 1;
    tieRate += rate[BetType.Tie] - 1;
    lucky6Rate += rate[BetType.Lucky6] - 1;

    showRoundInfo && logger.log(`[round-${String(r + 1).padStart(roundDigit, '0')}]`, getGameInfo(game));
  }

  logger.log('----- RESULT -----');

  logger.log(`[round] ${round}`);
  logger.log(`[banker] win: ${banker}(${toPercent(banker, round)}) | exceptation: ${toPercent(bankerRate, round)}`);
  logger.log(`[player] win: ${player}(${toPercent(player, round)}) | exceptation: ${toPercent(playerRate, round)}`);
  logger.log(`[tie] win: ${tie}(${toPercent(tie, round)}) | exceptation: ${toPercent(tieRate, round)}`);
  logger.log(`[lucky6] win: ${lucky6}(${lucky6With2}+${lucky6 - lucky6With2})(${toPercent(lucky6, round)}) | exceptation: ${toPercent(lucky6Rate, round)}`);
};

const toPercent = (number: number, total: number, fixed = 3) => {
  return `${(number / total * 100).toFixed(fixed)}%`;
};
