import getPixelsAsync from "./utils/get-pixels-async.js";
import fs from "fs";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function v1() {
  const fileNames = fs.readdirSync("./src/images");
  let frames = [];

  for (const [index, name] of fileNames.entries()) {
    const pixels = await getPixelsAsync(`./src/images/${name}`);
    let pixelData = [];
    for (let y = 0; y < 720; y++) {
      const yPixel = [];
      for (let x = 0; x < 960; x++) {
        const red = pixels.get(x, y, 0);
        const green = pixels.get(x, y, 1);
        const blue = pixels.get(x, y, 2);
        yPixel.push([red, green, blue]);
      }
      pixelData.push(yPixel);
    }

    // width src 960 pixel frame 160 char width
    // height src 720 pixel frame 60 char width
    // 1 char = 6x12 pixel
    const illumination = [
      " ",
      ".",
      ",",
      "-",
      "~",
      ":",
      ";",
      "=",
      "!",
      "*",
      "#",
      "$",
      "@",
    ];
    let frame = "";
    for (let yFrame = 0; yFrame < 60; yFrame++) {
      for (let xFrame = 0; xFrame < 160; xFrame++) {
        let charColor = 0;
        for (let y = 0; y < 12; y++) {
          for (let x = 0; x < 6; x++) {
            charColor +=
              (pixelData[yFrame * 12 + y][xFrame * 6 + x][0] +
                pixelData[yFrame * 12 + y][xFrame * 6 + x][1] +
                pixelData[yFrame * 12 + y][xFrame * 6 + x][2]) /
              (3 * 255);
          }
        }
        charColor /= 6 * 12;
        const char =
          illumination[Math.round(charColor * (illumination.length - 1))];
        frame += char;
      }
      frame += "\n";
    }
    frames.push(frame);
    console.clear();
    console.log(
      `${index} of ${fileNames.length} completed. ${
        (index / fileNames.length) * 100
      }%`
    );
  }

  for (const frame of frames) {
    console.clear();
    console.log(frame);
    await delay(67);
  }
}

export default v1;
