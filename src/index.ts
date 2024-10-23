#!/usr/bin/env node
import { Command } from "commander";
import commands from "commands";
import { setLogger } from "lib/logger";

const program = new Command();

program
  .name("vcluster-test")
  .description("vCluster Testing Tool")
  .version("0.1.0");

program.option("-d, --debug", "Output debugging information.");

program
  .command("test <config-file> [values-file]")
  .description("Run tests using the specified configuration file")
  .action(commands.test);

program
  .command("compile <config-file> [values-file]")
  .description("Compile configuration file with the values file")
  .action(commands.compile);

program.parse(process.argv);
const options = program.opts();
setLogger({
  minLevel: options.debug ? 2 : 3,
});
