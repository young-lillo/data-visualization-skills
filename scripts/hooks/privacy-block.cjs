const path = require("node:path");

function privacyBlock(filePath) {
  const blockedNames = [
    ".env",
    ".env.local",
    ".env.production",
    ".npmrc",
    ".pypirc",
    "credentials.json",
    "github_token",
    "id_ed25519",
    "id_rsa",
    "secrets.json",
    "token",
    "token.txt",
  ];
  const baseName = path.basename(filePath).toLowerCase();
  const blocked = blockedNames.includes(baseName);

  return {
    blocked,
    reason: blocked ? `Sensitive file access blocked: ${filePath}` : "ok",
  };
}

if (require.main === module) {
  console.log(JSON.stringify(privacyBlock(process.argv[2] || ""), null, 2));
}

module.exports = {
  privacyBlock,
};
