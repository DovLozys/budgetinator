import { Transaction, FileParserModel } from '../types';

export function getMonthNameFromIndex(index: number): string {
  const date = new Date();
  date.setMonth(index);

  return date.toLocaleString([], {
    month: 'long',
  });
}

// sums up the array returned by the model, rounds to two decimal places
export function modelReducer(model: FileParserModel, statement: Transaction[]): number {
  return Math.abs(Math.round(model(statement).reduce((partialSum, amount) => partialSum + amount, 0) * 100) / 100);
}
