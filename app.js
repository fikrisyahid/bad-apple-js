import promptInit from "prompt-sync";
import v1 from "./v1.js";
import v2 from "./v2.js";

const prompt = promptInit();

console.log("Select version to run:");
console.log("1: v1 - Full ASCII animation");
console.log("2: v2 - Test");
const input = prompt("Enter version number (1 or 2): ");

if (input === "1") {
  v1();
} else if (input === "2") {
  v2();
}
