#!/usr/bin/env node
const readline = require("node:readline");
const yargs = require("yargs");
const { stdin: input, stdout: output } = require("node:process");

const { argv } = yargs.option("debug", {
  alias: "d",
  type: "boolean",
  desc: "debug mode",
});

const number = Math.floor(Math.random() * 100);
console.log("Try to guess the number between 0 and 100!");
if (argv.debug) console.log(`Debug: Number is ${number}`);
const rl = readline.createInterface({ input, output });

const ask = () =>
  rl.question("What's your guess? ", (answer) => {
    const answerNumber = Number(answer);

    if (Number.isNaN(answerNumber)) {
      console.log("Please enter a number!");
      return ask();
    }

    if (answerNumber === number) {
      rl.close();
      if (answerNumber === 42)
        return console.log(
          "The answer to the ultimate question of life, the universe and everything is 42. You won!"
        );
      return console.log(`You guessed the number ${number}!`);
    }

    if (answerNumber > number) {
      console.log("Too high!");
      return ask();
    }

    if (answerNumber < number) {
      console.log("Too low!");
      return ask();
    }
  });

ask();
