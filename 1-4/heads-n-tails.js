#!/usr/bin/env node
const readline = require("node:readline");
const yargs = require("yargs");
const fs = require("node:fs");
const path = require("node:path");
const { stdin: input, stdout: output } = require("node:process");

const { argv } = yargs.option("debug", {
  alias: "d",
  type: "boolean",
  desc: "debug mode",
});

const format = (str) => {
  if (+str === 0) return "head";
  if (+str === 1) return "tail";
  if (str === "head" || str === "tail") return str;
  return "unknown";
};

const logWritableStream = fs.createWriteStream(
  path.join(__dirname, "log.txt"),
  {
    flags: "a",
  }
);

const rl = readline.createInterface({ input, output });

console.log(
  "----------------------------------------------\nTry to guess tail or head! (0 = head, 1 = tail)"
);
logWritableStream.write(
  `\nNew game session started. Debug: ${Boolean(argv.debug)}\n`
);
const newGame = () => {
  const secretNumber = Math.round(Math.random());
  const secretString = format(secretNumber);
  if (argv.debug) console.log(`Debug: answer is ${secretString}`);
  rl.question("What's your guess? ", (answer) => {
    const answerFormatted = format(answer);
    switch (answerFormatted) {
      case "head":
      case "tail":
        if (answerFormatted === secretString) {
          logWritableStream.write(
            `[RIGHT] Answer provided: ${answerFormatted}\n`
          );
          console.log(`You guessed the ${secretString}!`);
        } else {
          logWritableStream.write(
            `[WRONG] Answer provided: ${answerFormatted}\n`
          );
          console.log("Wrong!");
        }
        return newGame();
      default:
        console.log('Allowed values: 0, 1, "tail" or "head"');
        logWritableStream.write(
          `[WRONG] Answer provided: ${answerFormatted}\n`
        );
        return newGame();
    }
  });
};

newGame();
