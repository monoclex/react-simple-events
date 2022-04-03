import { build } from "esbuild";
import { readFile, rm, writeFile, copyFile } from "node:fs/promises";

await rm("./dist", { recursive: true }).catch(() => {
  // swallow exception
});

await build({
  bundle: true,
  platform: "neutral",
  outfile: "./dist/index.mjs",
  write: true,
  entryPoints: ["./src/index.ts"],
  external: ["react"],
});

await build({
  bundle: true,
  platform: "node",
  outfile: "./dist/index.cjs",
  write: true,
  entryPoints: ["./src/index.ts"],
  external: ["react"],
});

await copyPackageJson();

await copyFile("./README.md", "./dist/README.md");

await makeTscDefinitions();

async function copyPackageJson() {
  const packageJson = JSON.parse(
    await readFile("./package.json", { encoding: "utf8" })
  );

  const excludeProperties = [
    "scripts",
    "dependencies",
    "devDependencies",
    "size-limit",
  ];

  for (const property of excludeProperties) {
    delete packageJson[property];
  }

  await writeFile("./dist/package.json", JSON.stringify(packageJson, null, 2));
}

import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

async function makeTscDefinitions() {
  execSync("tsc -b ./tsconfig.types.json", { stdio: "inherit" });

  const source = await readFile("./dist/index.d.ts", { encoding: "utf8" });

  const lines = [];
  for (const line of source.split("\n")) {
    // the structure of the file that tsc generates isn't exactly what we want
    // firstly, we only care about the indented stuff inside modules
    if (!/    .*$/.test(line)) continue;

    // secondly, we don't want to import anything from `"nanoevents"`,
    // because we are bundling that into our module
    if (/from "nanoevents";/.test(line)) continue;

    // also, because we're bundling into a single module, we don't want our modules
    // to show up in the bundle
    if (/from "(events|eventsContext|rpc|rpcContext|index)";/.test(line))
      continue;

    lines.push(line);
  }

  const nanoeventsResolved = await import.meta.resolve("nanoevents");
  const nanoeventsPath = path.dirname(fileURLToPath(nanoeventsResolved));
  const nanoeventsTypeDeclarations = path.join(nanoeventsPath, "index.d.ts");
  const nanoeventsDefinitionBundle = await readFile(
    nanoeventsTypeDeclarations,
    { encoding: "utf8" }
  );

  const declarations = nanoeventsDefinitionBundle + "\n\n\n" + lines.join("\n");
  await writeFile("./dist/index.d.ts", declarations);
}
