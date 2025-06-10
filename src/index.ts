/** @notice Library imports */
import {
  intro,
  outro,
  text,
  select,
  multiselect,
  isCancel,
  cancel,
  spinner,
} from "@clack/prompts";
import path from "path";
import { writeFileSync } from "fs";
import { execSync } from "node:child_process";
/// Local imports
import { SUPPORTED_CHAINS } from "./constants/chains";

async function main() {
  intro("⚙️  Create Foundry Project");

  const projectName = await text({
    message: "Project name:",
    placeholder: "new-project",
  });
  if (isCancel(projectName)) return cancel("Aborted.");
  if (!projectName) return cancel("Must have a project name!");

  const dependencies = await select({
    message: "Add OpenZeppelin dependencies?",
    options: [
      { value: "oz-core", label: "@openZeppelin/contracts" },
      { value: "oz-upgradeable", label: "@openZeppelin/contracts-upgradeable" },
      { value: "both", label: "Both" },
      { value: "none", label: "None" },
    ],
  });
  if (isCancel(dependencies)) return cancel("Aborted.");

  const chainSelection = await multiselect({
    message: "Select chains to configure:",
    options: SUPPORTED_CHAINS.map((chain) => ({
      value: chain.id,
      label: chain.name,
    })),
    required: false,
  });
  if (isCancel(chainSelection)) return cancel("Aborted.");

  const s = spinner();
  s.start(`Scaffolding "${projectName}"`);
  execSync(`forge init ${projectName} --no-commit`, { stdio: "ignore" });

  if (dependencies === "oz-core" || dependencies === "both") {
    execSync(
      `cd ${projectName} && forge install OpenZeppelin/openzeppelin-contracts --no-commit`,
      { stdio: "ignore" }
    );
  }
  if (dependencies === "oz-upgradeable" || dependencies === "both") {
    execSync(
      `cd ${projectName} && forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit`,
      { stdio: "ignore" }
    );
  }

  // Generate foundry.toml
  const toml = [];
  toml.push("[profile.default]");
  toml.push(`src = "src"`);
  toml.push(`libs = ["lib"]`);

  /// Build config
  toml.push("\n# Builds");
  toml.push(`out = "build/out"`);
  toml.push(`cache_path = "build/cache"`);

  /// Solc config
  toml.push("\n# Compilers");
  toml.push(`optimizer = true`);
  toml.push(`optimizer_runs = 200`);
  toml.push(`solc_version = "0.8.27"`);

  if (chainSelection.length) {
    /// RPC endpoints
    toml.push("\n# RPC urls");
    toml.push("[rpc_endpoints]");
    chainSelection.forEach((id) => {
      const chain = SUPPORTED_CHAINS.find((c) => c.id === id)!;
      toml.push(`${id} = "${chain.rpc}"`);
    });

    /// Etherscan config
    toml.push("\n# Etherscan");
    toml.push("[etherscan]");
    chainSelection.forEach((id) => {
      const chain = SUPPORTED_CHAINS.find((c) => c.id === id)!;
      toml.push(`${id} = { key = "<your api key>", chain = ${chain.chainId} }`);
    });
  }

  /// Updating the TOML file.
  writeFileSync(path.join(projectName, "foundry.toml"), toml.join("\n"));

  s.stop(`🔥 Project ${projectName} created!`);
  outro("Happy coding 🧑🏻");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
