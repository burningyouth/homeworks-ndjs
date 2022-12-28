#!/usr/bin/env node
const yargs = require("yargs");
const fs = require("node:fs");
const path = require("node:path");

const { argv } = yargs.option("file", {
  alias: "f",
  type: "string",
  desc: "path to the log file",
  default: "log.txt",
});

const readableStream = fs.createReadStream(path.join(__dirname, argv.file));

let log = "";

const parseLog = (log) => {
  const lines = log.split("\n");
  const result = {
    total: 0,
    right: 0,
    wrong: 0,
    tailAnswers: 0,
    headAnswers: 0,
    unknownAnswers: 0,
  };

  lines.forEach((line) => {
    if (line === "" || line[0] === "N") return;
    if (line.startsWith("[RIGHT]")) {
      result.total++;
      result.right++;
    }
    if (line.includes("[WRONG]")) {
      result.total++;
      result.wrong++;
    }
    const answer = line.split(": ")[1];
    if (answer === "head") result.headAnswers++;
    else if (answer === "tail") result.tailAnswers++;
    else result.unknownAnswers++;
  });

  return result;
};

const maxCommonAnswer = (head, tail, unknown) => {
  if (head > tail && head > unknown) return "head";
  if (tail > head && tail > unknown) return "tail";
  return "unknown";
};

readableStream
  .on("data", (chunk) => {
    log += chunk;
  })
  .on("end", () => {
    const { total, wrong, right, headAnswers, tailAnswers, unknownAnswers } =
      parseLog(log);
    console.log(`Total games: ${total}`);
    console.log(`Right answers: ${right}`);
    console.log(`Wrong answers: ${wrong}`);
    console.log(`Win/lose: ${Math.round((right / wrong) * 100)}%`);
    console.log(
      `The most common answer is "${maxCommonAnswer(
        headAnswers,
        tailAnswers,
        unknownAnswers
      )}"`
    );
  });
