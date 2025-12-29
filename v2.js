import getPixelsAsync from "./utils/get-pixels-async.js";
import fs from "fs";
import pLimit from "p-limit";
import delay from "./utils/delay.js";

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

export default async function v2() {
  const { charWidth, charHeight, frameWidth, frameHeight } = config;

  const fileNames = fs.readdirSync("./src/images");

  const limit = pLimit(10);

  let completed = 0;

  const processingPromises = fileNames.map((name) => {
    return limit(async () => {
      const pixels = await getPixelsAsync(`./src/images/${name}`);

      const frame = getFrameString({
        pixels,
        frameWidth,
        frameHeight,
        charWidth,
        charHeight,
      });

      completed++;
      process.stdout.write(
        `\rProgress: ${completed}/${fileNames.length} (${Math.round(
          (completed / fileNames.length) * 100
        )}%)`
      );

      return frame;
    });
  });

  const frames = await Promise.all(processingPromises);

  console.clear();
  console.log("Processing Done. Playing...");
  await delay(1000);

  // Hide cursor
  process.stdout.write("\x1B[?25l");

  try {
    for (const frame of frames) {
      // Move cursor to top-left
      process.stdout.write("\x1B[H");

      // Write frame
      process.stdout.write(frame);
      await delay(67);
    }
  } finally {
    // Show cursor
    process.stdout.write("\x1B[?25h");
  }
}

process.on("SIGINT", () => {
  process.stdout.write("\x1B[?25h");
  process.exit();
});
