const fs = require("fs");
const path = require("path");

const workflowsDir = path.join(__dirname, ".github", "workflows");
const files = fs.readdirSync(workflowsDir).filter((f) => f.endsWith(".yml"));

for (const file of files) {
  const filePath = path.join(workflowsDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  content = content.replace(
    /actions\/checkout@v6\.0\.2.*/g,
    "actions/checkout@v7.0.0 # v7.0.0",
  );
  content = content.replace(
    /actions\/setup-node@v6\.3\.0.*/g,
    "actions/setup-node@v6.4.0 # v6.4.0",
  );
  content = content.replace(
    /actions\/labeler@[a-f0-9]+ # v6\.0\.1/g,
    "actions/labeler@v6.1.0 # v6.1.0",
  );
  content = content.replace(
    /actions\/upload-artifact@v7\.0\.0.*/g,
    "actions/upload-artifact@v7.0.1 # v7.0.1",
  );
  content = content.replace(
    /github\/codeql-action\/upload-sarif@[a-f0-9]+ # v2\.22\.1/g,
    "github/codeql-action/upload-sarif@v4.36.2 # v4.36.2",
  );
  content = content.replace(
    /codecov\/codecov-action@v6\.0\.0.*/g,
    "codecov/codecov-action@v7.0.0 # v7.0.0",
  );
  content = content.replace(
    /peter-evans\/create-pull-request@v8\.1\.0.*/g,
    "peter-evans/create-pull-request@v8.1.1 # v8.1.1",
  );

  fs.writeFileSync(filePath, content, "utf8");
}

console.log("Workflows updated.");
