import getPixelsAsync from "./utils/get-pixels-async.js";

const config = {
  charWidth: 6,
  charHeight: 12,
  frameWidth: 160,
  frameHeight: 60,
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

function getCharColor({ pixels, xFrame, yFrame, charWidth, charHeight }) {
  let totalBrightness = 0;
  const startY = yFrame * charHeight;
  const startX = xFrame * charWidth;
  const endY = startY + charHeight;
  const endX = startX + charWidth;

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const r = pixels.get(x, y, 0);
      const g = pixels.get(x, y, 1);
      const b = pixels.get(x, y, 2);
      totalBrightness += (r + g + b) / (3 * 255);
    }
  }
  return totalBrightness / (charWidth * charHeight);
}

function getFrameString({
  pixels,
  frameWidth,
  frameHeight,
  charWidth,
  charHeight,
}) {
  let frame = "";
  for (let yFrame = 0; yFrame < frameHeight; yFrame++) {
    for (let xFrame = 0; xFrame < frameWidth; xFrame++) {
      const charColor = getCharColor({
        pixels,
        xFrame,
        yFrame,
        charWidth,
        charHeight,
      });
      const charIndex = Math.round(charColor * (illumination.length - 1));
      frame += illumination[charIndex];
    }
    frame += "\n";
  }
  return frame;
}

export default async function processImage(fileName) {
  const pixels = await getPixelsAsync(`./src/images/${fileName}`);

  const frame = getFrameString({
    pixels,
    frameWidth: config.frameWidth,
    frameHeight: config.frameHeight,
    charWidth: config.charWidth,
    charHeight: config.charHeight,
  });

  return frame;
}
