import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id:string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    
    // check if exist
    const transaction = await transactionsRepository.findOne(id);

    //se não existe lança o error
    if(!transaction) {
      throw new AppError("Transactions does not exists");
    }

    await transactionsRepository.remove(transaction);

    return;
  }
}

export default DeleteTransactionService;
