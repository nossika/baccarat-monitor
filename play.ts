import { BetType } from '@/bet';
import { Table, User } from '@/table';

export const startPlay = () => {
  const table = new Table();

  const user = new User();
  
  user.add(100);
  
  user.join(table);
  
  user.bet(BetType.Banker, 50);
  
  table.run();
  table.settle();
  table.reset();

  console.log(user.chips);
  
  user.bet(BetType.Player, 50);
  
  table.run();
  table.settle();
  table.reset();
  
  console.log(user.chips);
}
