#!/usr/bin/env node

const yargs = require("yargs");
const date = require("date-fns");

yargs
  .scriptName("ndjs12-date")
  .command({
    command: "current",
    aliases: ["c"],
    desc: "Get current date, month or year",
    builder: (yargs) =>
      yargs
        .option("year", {
          alias: "y",
          type: "boolean",
          desc: "current year",
        })
        .option("month", {
          alias: "m",
          type: "boolean",
          desc: "current month",
        })
        .option("date", {
          aliases: ["d", "day"],
          type: "boolean",
          desc: "current day",
        }),
    handler: (argv) => {
      const now = new Date();
      if (argv.year) return console.log(now.getFullYear());
      if (argv.month) return console.log(now.getMonth() + 1);
      if (argv.date) return console.log(now.getDate());
      console.log(now.toISOString());
    },
  })
  .command({
    usage: "add [options]",
    command: "add",
    aliases: ["a"],
    desc: "Add to current date, month or year",
    builder: (yargs) =>
      yargs
        .option("year", { alias: "y", type: "number", desc: "add years" })
        .option("month", { alias: "m", type: "number", desc: "add months" })
        .option("day", { alias: "d", type: "number", desc: "add days" }),
    handler: (argv) => {
      let result = new Date();

      if (argv.year) result = date.addYears(result, argv.year);
      if (argv.month) result = date.addMonths(result, argv.month);
      if (argv.day) result = date.addDays(result, argv.day);

      return console.log(result.toISOString());
    },
  })
  .command({
    usage: "sub [options]",
    command: "sub",
    aliases: ["s"],
    desc: "Sub current date, month or year",
    builder: (yargs) =>
      yargs
        .option("year", { alias: "y", type: "number", desc: "sub years" })
        .option("month", { alias: "m", type: "number", desc: "sub months" })
        .option("day", { alias: "d", type: "number", desc: "sub days" }),
    handler: (argv) => {
      let result = new Date();

      if (argv.year) result = date.subYears(result, argv.year);
      if (argv.month) result = date.subMonths(result, argv.month);
      if (argv.day) result = date.subDays(result, argv.day);

      return console.log(result.toISOString());
    },
  })
  .help().argv;
