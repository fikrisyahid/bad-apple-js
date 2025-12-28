import getPixelsAsync from "./utils/get-pixels-async.js";
import fs from "fs";

const config = {
  charWidth: 6,
  charHeight: 12,
  frameWidth: 160,
  frameHeight: 60,
  pixelWidth: 960,
  pixelHeight: 720,
};

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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getPixelData({ pixels, pixelWidth, pixelHeight }) {
  const pixelData = [];
  for (let y = 0; y < pixelHeight; y++) {
    const yPixel = [];
    for (let x = 0; x < pixelWidth; x++) {
      const red = pixels.get(x, y, 0);
      const green = pixels.get(x, y, 1);
      const blue = pixels.get(x, y, 2);
      yPixel.push([red, green, blue]);
    }
    pixelData.push(yPixel);
  }
  return pixelData;
}

function getCharColor({ pixelData, xFrame, yFrame, charWidth, charHeight }) {
  let charColor = 0;
  for (let y = 0; y < charHeight; y++) {
    for (let x = 0; x < charWidth; x++) {
      const yIndex = yFrame * charHeight + y;
      const xIndex = xFrame * charWidth + x;
      const currentPixel = pixelData[yIndex][xIndex];
      const redPixel = currentPixel[0];
      const greenPixel = currentPixel[1];
      const bluePixel = currentPixel[2];
      charColor += (redPixel + greenPixel + bluePixel) / (3 * 255);
    }
  }
  const avgCharColor = charColor / (charWidth * charHeight);
  return avgCharColor;
}

// width src 960 pixel frame 160 char width
// height src 720 pixel frame 60 char width
// 1 char = 6x12 pixel
function getFrameString({
  pixelData,
  frameWidth,
  frameHeight,
  charWidth,
  charHeight,
}) {
  let frame = "";
  for (let yFrame = 0; yFrame < frameHeight; yFrame++) {
    for (let xFrame = 0; xFrame < frameWidth; xFrame++) {
      const charColor = getCharColor({
        pixelData,
        xFrame,
        yFrame,
        charWidth,
        charHeight,
      });
      const char =
        illumination[Math.round(charColor * (illumination.length - 1))];
      frame += char;
    }
    frame += "\n";
  }
  return frame;
}

export default async function v2() {
  const {
    charWidth,
    charHeight,
    frameWidth,
    frameHeight,
    pixelWidth,
    pixelHeight,
  } = config;

  const fileNames = fs.readdirSync("./src/images");
  const frames = [];

  for (const [index, name] of fileNames.entries()) {
    const pixels = await getPixelsAsync(`./src/images/${name}`);
    const pixelData = getPixelData({ pixels, pixelWidth, pixelHeight });
    const frame = getFrameString({
      pixelData,
      frameWidth,
      frameHeight,
      charWidth,
      charHeight,
    });

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
