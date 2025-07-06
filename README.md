# Budgetinator

Budgetinator is a React single-page application for parsing CSV/XLS bank 
statements. It helps visualize yearly and monthly cash flows with interactive 
graphs and charts.

## 🚀 Quick Start

- Head to [budgetinator.pages.dev](https://budgetinator.pages.dev/) and upload 
  your `.csv` file!
- Instantly see interactive bar charts for your financial data.

## Motivation

The aim of this project is to provide a simple tool for viewing and analyzing 
bank statement data. Users can upload a CSV file exported from their bank and 
view their financial data in a clear, visual format.

## Features

- Parse CSV/XLS bank statements (currently supports AMEX exports)
- Visualize income/expenses with graphs and charts
- Drill down: year → month → detailed breakdown (categories, merchants, etc.)
- Works entirely in your browser—no data leaves your device

## 🤝 Contributing

### Clone the repo

```bash
git clone https://github.com/DovLozys/budgetinator
cd budgetinator
```

### Run a local dev server

```bash
npm start
```
By default, the app runs at [localhost:5173](http://localhost:5173)

### Submit a pull request

If you'd like to contribute, please fork the repository and open a pull request 
to the `main` branch.

## To Do

- Finish up detailed drill-down: year → month → categories/merchants
- Support for multiple uploaded files (selector for each year/statement)
- More statement formats and bank support
