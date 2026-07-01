import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const processes = [
  {
    name: "backend",
    command: npmCommand,
    args: ["--prefix", "backend", "run", "dev"],
  },
  {
    name: "frontend",
    command: npmCommand,
    args: ["--prefix", "frontend", "run", "dev"],
  },
];

const runningProcesses = processes.map(({ name, command, args }) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false,
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
    }
  });

  return child;
});

const stopAll = () => {
  for (const child of runningProcesses) {
    if (!child.killed) {
      child.kill();
    }
  }
};

process.on("SIGINT", () => {
  stopAll();
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopAll();
  process.exit(0);
});
