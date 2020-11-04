require("standard-version");
const { execSync } = require("child_process");
const semver = require("semver"); // 规范语义化版本号
const inquirer = require("inquirer"); // 命令行交互
const path = require("path");
const pkg = require(path.resolve(__dirname, "../../../package.json"));
const curVersion = pkg.version;
const release = async () => {
  try {
    const releaseActions = ["major", "patch", "minor"]; // npm version 发布号类型
    const versions = {}; // 初始化一个空版本号对象
    releaseActions.map((r) => (versions[r] = semver.inc(curVersion, r)));

    // 用于构建发布方式选择项
    const releaseChoices = releaseActions.map((r) => ({
      name: `${r} (${versions[r]})`,
      value: r,
    }));

    // 发布方式 (命令式选择)
    // release指的是prompt项里的name字段对应得值
    inquirer
      .prompt([
        {
          type: "list",
          message: "请选择发布的版本类型",
          name: "release",
          choices: [...releaseChoices],
        },
        {
          type: "confirm",
          message: `确认发布版本号:`,
          name: "yes",
        },
      ])
      .then(({ release, yes }) => {
        if (yes) {
          execSync(`standard-version -r ${release}`, {
            stdio: "inherit",
          });
        }
      });
  } catch (e) {
    console.log(e);
  }
};

release().catch((err) => {
  console.error(err);
  process.exit(1);
});
