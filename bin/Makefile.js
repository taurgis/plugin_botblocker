'use strict';

/* global cat, cp, exec, mkdir, target, test */

require('shelljs/make');

var chalk = require('chalk');
var path = require('path');
var spawn = require('child_process').spawn;
var fs = require('fs');
var shell = require('shelljs');

/**
 * Get the sandbox hostname from dw.json if present.
 * @returns {string} sandbox hostname or empty string
 */
function getSandboxUrl() {
    if (test('-f', path.join(process.cwd(), 'dw.json'))) {
        var config = cat(path.join(process.cwd(), 'dw.json'));
        var parsedConfig = JSON.parse(config);
        return '' + parsedConfig.hostname;
    }
    return '';
}

/**
 * Parse CLI arguments into an options object.
 * @param {Object} defaults - default option values
 * @param {Array} args - raw CLI args
 * @returns {Object} merged options
 */
function getOptions(defaults, args) {
    var params = {};
    var i = 0;
    while (i < args.length) {
        var item = args[i];
        if (item.indexOf('--') === 0) {
            if (i + 1 < args.length && args[i + 1].indexOf('--') < 0) {
                var value = args[i + 1];
                value = value.replace(/\/+$/, '');
                params[item.substr(2)] = value;
                i += 2;
            } else {
                params[item.substr(2)] = true;
                i += 1;
            }
        } else {
            params[item] = true;
            i += 1;
        }
    }
    var options = Object.assign({}, defaults, params);
    return options;
}

/**
 * Serialize options into CLI-friendly string.
 * @param {Object} options - options to stringify
 * @returns {string} space-separated options string
 */
function getOptionsString(options) {
    if (!options.baseUrl) {
        shell.echo(chalk.red('Could not find baseUrl parameter.'));
        process.exit(1);
    }

    var optionsString = '';

    Object.keys(options).forEach(function (key) {
        if (options[key] === true) {
            optionsString += key + ' ';
        } else {
            optionsString += '--' + key + ' ' + options[key] + ' ';
        }
    });

    return optionsString;
}

target.compileFonts = function () {
    var fontsDir = 'cartridges/app_storefront_base/cartridge/static/default/fonts';
    mkdir('-p', fontsDir);
    cp('-r', 'node_modules/font-awesome/fonts/', 'cartridges/app_storefront_base/cartridge/static/default');
    cp('-r', 'node_modules/flag-icons/flags', fontsDir + '/flags');
};

target.functional = function (args) {
    var defaults = {
        baseUrl: 'https://' + getSandboxUrl() + '/s/RefArch',
        client: 'chrome'
    };

    var configFile = 'test/functional/webdriver/wdio.conf.js';
    if (args.indexOf('appium') > -1) {
        args.splice(args.indexOf('appium'), 1);
        configFile = 'test/functional/webdriver/wdio.appium.js';
        defaults = {
            baseUrl: 'https://' + getSandboxUrl() + '/s/RefArch'
        };
    }

    var options = getOptions(defaults, args);
    var optionsString = getOptionsString(options);

    shell.echo(chalk.green('Installing selenium'));
    exec('node_modules/.bin/selenium-standalone install', { silent: true });

    shell.echo(chalk.green('Selenium Server started'));
    var selenium = exec('node_modules/.bin/selenium-standalone start', { async: true, silent: true });

    shell.echo(chalk.green('Running functional tests'));

    var tests = spawn('./node_modules/.bin/wdio  ' + configFile + ' ' + optionsString, { stdio: 'inherit', shell: true });

    tests.on('exit', function (code) {
        selenium.kill();
        shell.echo(chalk.green('Stopping Selenium Server'));
        process.exit(code);
    });
};

target.release = function (args) {
    if (!args) {
        shell.echo('No version type provided. Please specify release type patch/minor/major');
        return;
    }
    var type = args[0].replace(/"/g, '');
    if (['patch', 'minor', 'major'].indexOf(type) >= 0) {
        shell.echo('Updating package.json version with ' + args[0] + ' release.');
        var version = spawn('npm version ' + args[0], { stdio: 'inherit', shell: true });
        var propertiesFileName = path.resolve('./cartridges/app_storefront_base/cartridge/templates/resources/version.properties');

        version.on('exit', function (code) {
            if (code === 0) {
                var versionNumber = JSON.parse(fs.readFileSync('./package.json').toString()).version;
                // modify version.properties file
                var propertiesFile = fs.readFileSync(propertiesFileName).toString();
                var propertiesLines = propertiesFile.split('\n');
                var newLines = propertiesLines.map(function (line) {
                    var updatedLine = line;
                    if (line.indexOf('global.version.number=') === 0) {
                        updatedLine = 'global.version.number=' + versionNumber;
                    }
                    return updatedLine;
                });
                fs.writeFileSync(propertiesFileName, newLines.join('\n'));
                shell.exec('git add -A');
                shell.exec('git commit -m "Release ' + versionNumber + '"');
                shell.echo('Version updated to ' + versionNumber);
                shell.echo('Please do not forget to push your changes to the integration branch');
            }
        });
    } else {
        shell.echo('Could not release new version. Please specify version type (patch/minor/major).');
    }
};
