import promptInit from "prompt-sync";
import v1 from "./v1.js";
import v2 from "./v2.js";
import v3 from "./v3.js";

const prompt = promptInit();

console.log("Select version to run:");
console.log("1: v1 - Full ASCII animation");
console.log(
  "2: v2 - Concurrent processing with p-limit + direct ASCII replacement + remove duplicate pixel data processing"
);
console.log("3: v3 - Multicore processing with Piscina + v2 optimizations");
const input = prompt("Enter version number (1, 2, or 3): ");

switch (input.trim()) {
  case "1":
    v1();
    break;
  case "2":
    v2();
    break;
  case "3":
    v3();
    break;
  default:
    console.log("Invalid input. Please enter 1, 2, or 3.");
}
