import { Transaction } from '../types';

export function getCategories(arrayOfRows: Transaction[]): string[] {
  const arrayOfCategories: string[] = [];
  for (let i = 0; i < arrayOfRows.length; i++) {
    if (!arrayOfCategories.includes(arrayOfRows[i]['Category'])) {
      arrayOfCategories.push(arrayOfRows[i]['Category']);
    }
  }

  return arrayOfCategories;
}

export function getDebits(arrayOfRows: Transaction[]): number[] {
  const arrayOfDebits: number[] = [];
  for (let i = 0; i < arrayOfRows.length; i++) {
    if (arrayOfRows[i]['Type'] === 'DEBIT') {
      arrayOfDebits.push(arrayOfRows[i]['Amount']);
    }
  }

  return arrayOfDebits;
}

export function getCredits(arrayOfRows: Transaction[]): number[] {
  const arrayOfCredits: number[] = [];
  for (let i = 0; i < arrayOfRows.length; i++) {
    if (arrayOfRows[i]['Type'] === 'CREDIT') {
      arrayOfCredits.push(arrayOfRows[i]['Amount']);
    }
  }

  return arrayOfCredits;
}

/*
TODO:
  getCategories - gets all available categories from a statement (leisure, bills...)
  getTransactionsInCategory - gets transactions in a specific category
*/