import chalk from "chalk";

export const logger = {
  info: (message: string) => {
    console.log(chalk.blue("ℹ"), message);
  },

  success: (message: string) => {
    console.log(chalk.green("✓"), message);
  },

  warning: (message: string) => {
    console.log(chalk.yellow("⚠"), message);
  },

  error: (message: string) => {
    console.log(chalk.red("✗"), message);
  },

  file: (action: string, filePath: string) => {
    console.log(chalk.gray("  "), chalk.cyan(action), chalk.white(filePath));
  },

  title: (message: string) => {
    console.log();
    console.log(chalk.bold.magenta(message));
    console.log();
  },

  divider: () => {
    console.log(chalk.gray("─".repeat(50)));
  },
};
