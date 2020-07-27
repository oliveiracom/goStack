import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request{
  title: string,
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({title, value, type}:Request): Transaction {
    //faz validações de regras de negócio se tiver e manda pro repository fazer o que precisa
    if (!title || !value || !type) {
      throw Error('All values are required');
    }

    if(type === 'outcome'){
      const hasMoney = this.transactionsRepository.getBalance();
      if (hasMoney.total < value) {
        throw Error('Insuficient Funds... Go get some money first!');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type
    });
    return transaction;
  }
}

export default CreateTransactionService;
