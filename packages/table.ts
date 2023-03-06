import { BetType, getBetRate } from './bet';
import { runGame } from './game';

export class User {
  chips = 0;
  table: Table | null = null;
  
  constructor(chips = 0) {
    this.chips = chips;
  }

  join(table: Table) {
    table.join(this);
    this.table = table;
  }

  bet(type: BetType, chips: number) {
    if (!this.table) {
      throw new Error('user haven\'t join table yet');
    }

    this.delete(chips);

    this.table.addBet({
      type,
      chips,
      user: this,
    });
  }

  leave() {
    this.table.leave(this);
    this.table = null;
  }

  add(chips: number) {
    this.chips += chips;
  }

  delete(chips: number) {
    if (this.chips < chips) {
      throw new Error('chips not enough');
    }

    this.chips -= chips;
  }
}

interface UserBet {
  type: BetType,
  chips: number,
  user: User,
}

enum TableStatus {
  Waiting,
  Gaming,
  Settled,
}

export class Table {
  min = 0;
  max = Infinity;
  users: Set<User> = new Set();
  userBets: UserBet[] = [];
  status: TableStatus = TableStatus.Waiting;
  game: ReturnType<typeof runGame> | null = null;

  join(user: User) {
    this.users.add(user);
  }

  leave(user: User) {
    this.users.delete(user);
  }

  reset() {
    this.userBets = [];
    this.game = null;
    this.status = TableStatus.Waiting;
  }

  addBet(bet: UserBet) {
    if (this.status !== TableStatus.Waiting) {
      throw new Error('table can\'t bet yet');
    }

    if (!this.users.has(bet.user)) {
      throw new Error('user doesn\'t exist on table');
    }

    if (bet.chips < this.min || bet.chips > this.max) {
      throw new Error('chips is out of range');
    }

    this.userBets.push(bet);
  }

  run() {
    this.game = runGame();
    this.status = TableStatus.Gaming;
  }

  settle() {
    if (this.status !== TableStatus.Gaming) {
      throw new Error('table can\'t settle');
    }

    const betRate = getBetRate(this.game.result);

    for (const bet of this.userBets) {
      const win = bet.chips * betRate[bet.type];
      bet.user.add(win);
    }

    this.status = TableStatus.Settled;
  }
}