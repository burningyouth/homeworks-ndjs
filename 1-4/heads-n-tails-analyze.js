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
    if (line.includes("[RIGHT]")) {
      result.total++;
      result.right++;
    }
    if (line.includes("[WRONG]")) {
      result.total++;
      result.wrong++;
    }
    if (line.split(": ")[1] === "head") result.headAnswers++;
    else if (line.split(": ")[1] === "tail") result.tailAnswers++;
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
    const result = parseLog(log);
    console.log(`Total games: ${result.total}`);
    console.log(`Right answers: ${result.right}`);
    console.log(`Wrong answers: ${result.wrong}`);
    console.log(
      `Win/lose: ${Math.round((result.right / result.wrong) * 100)}%`
    );
    console.log(
      `The most common answer is "${maxCommonAnswer(
        result.headAnswers,
        result.tailAnswers,
        result.unknownAnswers
      )}"`
    );
  });
