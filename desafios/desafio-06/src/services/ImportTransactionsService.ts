import csvParse from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/Transaction';

import { In, getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const contactsReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      delimiter: ',',
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [ title, type, value, category ] = line.map(
        (cell: string) => cell.trim()
      );

      //checa se algum não existir -> pula
      if (!title || !type || !value ) return;

      categories.push(category);

      transactions.push ({
        title,
        type,
        value,
        category
      });

    });

    //checa se chegou no fim do parseCSV
    await new Promise (resolve => parseCSV.on('end', resolve));

    console.log(categories);
    console.log(transactions);

    //procura categories já existentes em lote no banco
    const existentCategories = await categoriesRepository.find({
      where : {
        title : In(categories)
      }
    });

    //filtra pra apenas title
    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title
    );

    //considera todas categories que não estejam no banco
    const addCategoryTitles = categories
    .filter(category => !existentCategoriesTitles.includes(category))
    //remove as duplicadas
    .filter( (value, index, self) => self.indexOf(value) == index);
    
    //faz o map pra adicionar cada categoria
    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      }) ),
    );
    
    await categoriesRepository.save(newCategories);
    
    const finalCategories = [... newCategories, ...existentCategories];
    
    //começa a lidar com as transações
    const createdTransactions = transactionsRepository.create(
      transactions.map(item => ({
        title: item.title,
        type: item.type,
        value: item.value,
        category: finalCategories.find(
          category => category.title == item.category,
        ),
      }) ),
    );
    
      
    await transactionsRepository.save(createdTransactions);
    await fs.promises.unlink(filePath);
    
    return createdTransactions; 

  }
}
export default ImportTransactionsService;
      
      
    /*
      




        */

