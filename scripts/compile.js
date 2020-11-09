const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const message = require('./utils/message');

const appDirectory = fs.realpathSync(process.cwd());
const argv = yargs(hideBin(process.argv)).argv;

const cleanPath = path.join(__dirname, '..', 'types', argv.type, 'scripts', 'clean.js');
if (fs.existsSync(cleanPath)) {
    childProcess
        .execSync(
            `node ${cleanPath}`,
            { stdio: 'inherit' }
        );
}

const versionPath = path.join(__dirname, 'version.js');
childProcess
    .execSync(
        argv.v
            ? `node ${versionPath} --v=${argv.v}`
            : `node ${versionPath}`,
        { stdio: 'inherit' }
    );

message.title('start compile');
const webpackPath = path.join(appDirectory, 'node_modules', '.bin', 'webpack');
const prodWebpackConfigPath = path.join(__dirname, '..', 'types', argv.type, 'config', 'prod-webpack.config.js');
childProcess
    .execSync(
        `${webpackPath} --progress --config ${prodWebpackConfigPath}`,
        { stdio: 'inherit' }
    );
