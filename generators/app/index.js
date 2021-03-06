'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const pathExists = require('path-exists');
// const ejs = require('ejs');
const fs = require('fs');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`This generator will create ${chalk.red('a new npm module starter')}.`)
    );

    return this.prompt([
      {
        type: 'input',
        name: 'moduleName',
        message: 'Module name',
        validate: async (value) => {
          if (typeof value !== "string") {
            return 'Must be a string';
          }

          if (!value.match(/^[a-zA-Z0-9-_\.]+$/)) {
            return 'Must contain only letters, digits, _ and - signs';
          }

          const dst = path.join(process.cwd(), value);
          if (await pathExists(dst)) {
            return `Folder exists: ${dst}`;
          }

          return true;
        }
      },
      {
        type: 'input',
        name: 'moduleDescription',
        message: 'Module description',
        default: '',
      },
      {
        type: 'input',
        name: 'vendorName',
        message: 'Vendor name (to use in GitHub URL, npm, etc.)',
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Author name (to appear in LICENSE, README.md, etc.)',
        default: '',
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Author email',
        default: '',
      },
      {
        type: 'confirm',
        name: 'useClientSide',
        message: 'Do we use the module client-side?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'useServerSide',
        message: 'Do we use the module server-side?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'supportReact',
        message: 'Do we use React?',
        default: false,
        when: answers => {
          return answers.useClientSide;
        },
      },
      {
        type: 'confirm',
        name: 'supportCLI',
        message: 'Do we support command-line interface?',
        default: false,
        when: answers => {
          return answers.useServerSide;
        },
      },
    ]).then(props => {
      props.supportCLI = props.supportCLI || false;
      props.supportReact = props.supportReact || false;
      this.answers = props;
    });
  }

  copyFiles() {
    ['**/.*', ''].forEach((pattern) => {
      this.fs.copyTpl(
        this.templatePath(pattern),
        this.destinationPath(this.answers.moduleName),
        this.answers,
        {
          dot: true,
        }
      );
    });
  }

  async makeScriptsExecutable() {
    const scriptsPath = path.join(process.cwd(), 'script');
    if (await pathExists(scriptsPath)) {
      this.spawnCommand("chmod", ["+x", path.join(scriptsPath, '*')]);
    }
  }

  install() {
    const deps = [
      '@babel/polyfill',
    ];

    const depsDev = [
      '@babel/core',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/preset-env',
      'npm-run-all',
      'husky',
      'jest',
    ];

    depsDev.push('webpack');
    depsDev.push('webpack-cli');
    depsDev.push('webpack-node-externals');
    depsDev.push('babel-loader');

    if (this.answers.supportReact) {
      depsDev.push('@babel/preset-react');
    }

    if (deps.length) {
      this.spawnCommand("npm", ["install", ...deps], {cwd: this.answers.moduleName});
    }
    if (depsDev.length) {
      this.spawnCommand("npm", ["install", ...depsDev, "--save-dev"], {cwd: this.answers.moduleName});
    }
  }
};
