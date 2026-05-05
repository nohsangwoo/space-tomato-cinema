import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { upsertPostFromFile } from "./upsert-post.mjs";

const contentDir = "content/blog";
const entries = await readdir(contentDir, { withFileTypes: true });
const postFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map((entry) => join(contentDir, entry.name))
  .sort();

if (postFiles.length === 0) {
  console.log("No blog JSON files found.");
  process.exit(0);
}

for (const filePath of postFiles) {
  await upsertPostFromFile(filePath);
}

console.log(`Seeded ${postFiles.length} blog post(s).`);
