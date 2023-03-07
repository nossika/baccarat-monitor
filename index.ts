import * as inquirer from 'inquirer';
import { isPosiInt } from '@@/util/number';
import { autoRun } from './auto-run';
import { startPlay } from './play';

(async () => {
  const { mode } = await inquirer.prompt([{
    type: 'list',
    message: 'select game mode',
    name: 'mode',
    choices: [
      { name: 'play', value: 'play' },
      { name: 'auto' , value: 'auto-run' },
    ], 
  }]);

  switch (mode) {
    case 'play': {
      const { oChips } = await inquirer.prompt([{
        type: 'input',
        message: 'set initial chips',
        name: 'oChips',
        default: '1000',
        validate: (val) => {
          if (!isPosiInt(+val)) {
            return 'chips must be positive integer';
          }

          return true;
        },
      }]);

      const chips = +oChips;

      startPlay(chips);
      break;
    }

    case 'auto-run': {
      const { oRounds, info } = await inquirer.prompt([
        {
          type: 'input',
          message: 'set game rounds',
          name: 'oRounds',
          default: '10000',
          validate: (val) => {
            if (!isPosiInt(+val)) {
              return 'rounds must be positive integer';
            }

            return true;
          },
        }, 
        {
          type: 'list',
          message: 'show round info',
          name: 'info',
          default: 'yes',
          choices: [
            { name: 'yes', value: 'yes' },
            { name: 'no' , value: 'no' },
          ], 
        }
      ]);

      const rounds = +oRounds;

      autoRun(rounds, info === 'yes');
      break;
    }
  }

})();
