const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const { writeFile } = require("fs/promises");

const asyncExec = promisify(require("child_process").exec);

const getPreviewAppURL = async (commit) => {
  const { stdout } = await asyncExec("firebase hosting:channel:list --json");

  const { result } = JSON.parse(stdout);

  return result.channels.find(
    (deploy) => deploy.name.split("/").pop() === commit
  )?.url;
};

const generatePreviewAppURL = async (commit) => {
  console.log(`Generating a new URL to deploy a preview app for ${commit} ...`);

  const { stdout } = await asyncExec(
    `firebase hosting:channel:create ${commit} --json`
  );

  const {
    result: { url },
  } = JSON.parse(stdout);

  console.log(`Preview app successfully hosted to: ${url}`);

  return url;
};

const buildEnvFile = async (reviewAppURL) => {
  console.log("Setting up env variables :");

  const envs = {
    REVIEW_APP_URL: reviewAppURL,
  };

  let buildEnvFileContent = "";

  for (let [envVariableName, envVariableValue] of Object.entries(envs)) {
    console.log(`- ${envVariableName}:${envVariableValue}`);

    buildEnvFileContent += `${envVariableName}=${envVariableValue}\n`;
  }

  const buildEnvPath = path.join(__dirname, "..", "..", "build.env");

  return writeFile(buildEnvPath, buildEnvFileContent);
};

const prepare = async (commit) => {
  let url = await getPreviewAppURL(commit);

  if (!url) {
    url = await generatePreviewAppURL(commit);
  } else {
    console.log("A preview app has already been deployed to the URL:", url);
  }

  await buildEnvFile(url);

  console.log(`Prebuild complete for preview app at URL: ${url}`);
};

prepare(process.argv[2]).catch((e) => {
  console.error(e);

  process.exit(1);
});
