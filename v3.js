import fs from "fs";
import Piscina from "piscina";
import delay from "./utils/delay.js";
import { fileURLToPath } from "url";
import path from "path";

export default async function v3() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const pool = new Piscina({
    filename: path.resolve(__dirname, "v3-worker.js"),
  });

  const fileNames = fs.readdirSync("./src/images");

  fileNames.sort((a, b) => {
    return parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, ""));
  });

  console.log(
    `Starting multicore processing with ${pool.threads.length} threads...`
  );

  let completed = 0;
  const startTime = Date.now();

  const processingPromises = fileNames.map(async (fileName) => {
    const frame = await pool.run(fileName);

    completed++;
    process.stdout.write(
      `\rProgress: ${completed}/${fileNames.length} (${Math.round(
        (completed / fileNames.length) * 100
      )}%)`
    );

    return frame;
  });

  const frames = await Promise.all(processingPromises);

  const duration = (Date.now() - startTime) / 1000;
  console.log(`\nDone in ${duration}s! Playing animation...`);
  await delay(1000);

  process.stdout.write("\x1B[?25l");

  process.on("SIGINT", () => {
    process.stdout.write("\x1B[?25h");
    process.exit();
  });

  try {
    for (const frame of frames) {
      process.stdout.write("\x1B[H");
      process.stdout.write(frame);
      await delay(67);
    }
  } finally {
    process.stdout.write("\x1B[?25h");
  }
}
