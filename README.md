# Budgetinator

A React single-page application for parsing CSV/XLS bank statements. Crunches them like a terminator and shows nice graphs and charts of yearly/monthly cash flows.

# Motivation

Ever wanted an app that just does what you need and nothing else? Yep, same here. The goal was to just be able to feed it a .csv file that I backup from my bank of choice once a year and see a historical view of what's what, all done locally in the browser. I tried a couple off-the-shelf 'budgeting' apps, and I was frustrated with all their bells and whistles - network requests to integrate with a 3rd party API, real-time notifications, gamification - I just needed cold hard facts (or numbers) and so budgetinator was born.

## 🚀 Quick Start

Navigate to [`*WIP*`](#) and upload your .csv file!

You'll get a nice bar chart to click through.

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
By default it will be running on [localhost:5173](http://localhost:5173)

### Submit a pull request

If you'd like to contribute, please fork the repository and open a pull request to the `main` branch.



## To do

- finish up rough drill down:
  - year -> month -> fine details about selected month (categories, merchants..)
- keep track of multiple uploaded files
  - have a selector for each year/statement file
- have support for different statement formats/banks
