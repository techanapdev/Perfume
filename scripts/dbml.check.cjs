// Run with NODE_PATH pointing to an external @dbml/core installation.
// Example: NODE_PATH=/private/tmp/perfume-dbml-validator/node_modules node scripts/dbml.check.cjs
async function checkDbml() {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs');
  const path = await import('node:path');
  const { createRequire } = await import('node:module');
  const loadModule = createRequire(__filename);
  const { Parser } = loadModule('@dbml/core');

  for (const filename of ['schema-proposal.dbml', 'schema-integration-outline.dbml']) {
    const source = fs.readFileSync(path.join(__dirname, '../docs/perfume', filename), 'utf8');
    for (const format of ['dbml', 'dbmlv2']) {
      try {
        const database = new Parser().parse(source, format);
        assert.equal(database.schemas.flatMap((schema) => schema.tables).length, 26);
        console.log(`${filename}: ${format} parser PASS (26 tables)`);
      } catch (error) {
        console.error(`${filename}: ${format} parser FAIL`);
        const diagnostics = error.diags || error.errors || [];
        const messages = diagnostics.map((diagnostic) => diagnostic.message);
        console.error([...new Set(messages)].join('\n') || error.message || String(error));
        process.exitCode = 1;
      }
    }
  }
}

checkDbml().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
