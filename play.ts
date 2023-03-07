import * as inquirer from 'inquirer';
import logger from '@@/util/logger';
import { isPosiInt } from '@@/util/number';
import { getGameInfo } from '@@/util/formatter';
import { Table, User } from '@/table';
import { BetType } from '@/bet';

const table = new Table({
  min: 100,
});

export const startPlay = async (chips: number) => {
  const user = new User(chips);
  user.join(table);

  let lastAction = 'banker';
  while (true) {
    const { action } = await inquirer.prompt([{
      type: 'list',
      message: 'your action',
      name: 'action',
      default: lastAction,
      choices: [
        { name: 'banker', value: 'banker' },
        { name: 'player' , value: 'player' },
        { name: 'tie' , value: 'tie' },
        { name: 'lucky6' , value: 'lucky6' },
        { name: 'quit' , value: '' },
      ],
    }]);

    lastAction = action;

    if (!action) {
      break;
    }

    const remain = user.chips;

    const { oBet } = await inquirer.prompt([{
      type: 'input',
      message: 'your bet',
      name: 'oBet',
      default: table.min,
      validate: (val) => {
        if (!isPosiInt(+val)) {
          return 'rounds must be positive integer';
        }

        if (+val > remain) {
          return 'you don\'t have enough chips';
        }

        return true;
      },
    }]);

    const bet = +oBet;
  
    const err = user.bet(
      {
        banker: [BetType.Banker],
        player: [BetType.Player],
        tie: [BetType.Tie],
        lucky6: [BetType.Lucky6],
      }[action],
      bet,
    );

    if (err) {
      logger.log(err);
      continue;
    }

    logger.log('----- DEAL -----');

    const game = table.run();

    logger.log('[game info]', getGameInfo(game));

    const settles = table.settle();

    let win = -bet;

    for (const settle of settles) {
      if (settle.user === user) {
        win += settle.win;
      }
    }

    logger.log('[your chips]', `${user.chips}(${win >= 0 ? '+' : ''}${win})`);

    table.reset();

    logger.log('----- SETTELED -----');

    if (user.chips <= 0) {
      break;
    }
  }
}
