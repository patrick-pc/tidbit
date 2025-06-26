require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { notarize } = require("@electron/notarize");

module.exports = async function (params) {
  if (process.platform !== "darwin") return;

  // Only notarize if we have the required environment variables
  if (
    !process.env.APPLE_ID ||
    !process.env.APPLE_APP_SPECIFIC_PASSWORD ||
    !process.env.APPLE_TEAM_ID
  ) {
    console.log(
      "Skipping notarization: APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, or APPLE_TEAM_ID not set"
    );
    console.log(
      "Note: When using app-specific passwords, APPLE_TEAM_ID is required"
    );
    return;
  }

  let appId = "ai.tidbit.app";
  let appPath = path.join(
    params.appOutDir,
    `${params.packager.appInfo.productFilename}.app`
  );

  if (!fs.existsSync(appPath)) {
    console.log("Skipping notarization: app not found");
    return;
  }

  console.log(
    `Notarizing ${appId} found at ${appPath} with Apple ID ${process.env.APPLE_ID}`
  );

  try {
    await notarize({
      tool: "notarytool",
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID, // Required when using password authentication
    });
    console.log(`Successfully notarized ${appId}`);
  } catch (error) {
    console.error("Notarization failed:", error);
    // Don't throw to allow build to continue
  }
};
