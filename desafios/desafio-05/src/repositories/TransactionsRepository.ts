import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface ShowTransaction {
  transactions: Transaction[],
  balance: Balance
}

interface NewTrasanctionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface ReduceBalance {
  income: number;
  outcome: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): ShowTransaction {
    const balance = this.getBalance()
    const allTransactions = {
      transactions: this.transactions,
      balance,
    }

    return allTransactions;
  }

  public getBalance(): Balance {
    let sum = {
      'income': 0,
      'outcome': 0,
      'total':0
    }
    // TODO
    /*function groupTransactions( objArray: Transaction[], prop:string){
      return objArray.reduce(function (acc, item):ReduceBalance  {

        let key = item[prop];
        sum[key] += Number(item['value']);

        console.log(sum);
        return sum;
      }, {});
    }

    let types = groupTransactions(this.transactions, 'type');

    const balance:Balance = {
      income: types['income'],
      outcome: types['outcome'],
      total: types['income'] - types['outcome']
    } */

    const result = this.transactions.map(item => {
      if(item['type'] === 'income') {
        sum['income'] += Number(item['value']);
      } else {
        sum['outcome'] += Number(item['value']);
      }
    });

    sum['total'] = sum['income'] - sum['outcome'];
    return sum;
  }

  public create({title, value, type}:NewTrasanctionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
