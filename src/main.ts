import "./style.css";

import * as parser from "./lib/parser";
import { getLevelData } from "./lib/file";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <pre id="console">
    </pre>
  </div>
`;

const logArea = document.querySelector<HTMLDivElement>("#console");
if (logArea) {
  logArea.textContent = "";
}

// Monkey patch console.log to write to the log area
console.log = function (...s: any) {
  const logArea = document.querySelector<HTMLDivElement>("#console")!;
  for (const part of s) {
    logArea.textContent += part + " ";
  }

  logArea.textContent += "\n";
};

console.error = function (s: any) {
  const logArea = document.querySelector<HTMLDivElement>("#console")!;
  logArea.textContent += "💥 " + s + "\n";
};

// *** START HERE ***
const levelName = "Tomb-Raider-1/01-Caves.PHD";
//const levelName = "Tomb-Raider-1/03-The-Lost-Valley.PHD";
//const levelName = "Tomb-Raider-1/14-Atlantis.PHD";
//const levelName = "Tomb-Raider-1/08-Cistern.PHD";

const data = await getLevelData(levelName);
console.log("Loading file: " + levelName);

try {
  parser.parseTR1Level(data);
} catch (e) {
  console.error("Error parsing level! Going to give up!");
  console.error(e);
}
