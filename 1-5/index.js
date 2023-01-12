const yargs = require("yargs");
const http = require("node:http");
const { argv } = yargs
  .option("city", {
    alias: "c",
    type: "string",
    desc: "city name",
  })
  .option("country", {
    type: "string",
    desc: "country name",
  });

http
  .request(
    `${process.env.API_URL}/current?access_key=${process.env.API_KEY}&query=${argv.city},${argv.country}`
  )
  .on("response", (response) => {
    const { statusCode } = response;
    if (statusCode === 200) {
      let result = "";
      response
        .on("data", (data) => {
          result += data;
        })
        .on("end", () => {
          result = JSON.parse(result);

          if (!result.current) return console.log("No data found.");
          try {
            console.log(
              `Weather is ${result.current.weather_descriptions
                .map((value) => value.toLowerCase())
                .join(", ")} in ${result.location.name}, temperature is ${
                result.current.temperature
              }°C, wind speed is ${result.current.wind_speed} km/h.`
            );
          } catch (error) {
            console.error(error);
          }
        });
    } else {
      console.log(response.statusMessage);
    }
  })
  .end();
