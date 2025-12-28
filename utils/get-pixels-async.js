import getPixels from "get-pixels";

function getPixelsAsync(path) {
  return new Promise((resolve, reject) => {
    getPixels(path, (err, pixels) => {
      if (err) {
        reject(err);
      } else {
        resolve(pixels);
      }
    });
  });
}

export default getPixelsAsync;
