const commands = require('../utils/commands'),
      config = require('../utils/config'),
      environment = require('../utils/environment'),
      sites = require('../utils/sites');

const composerCommand = function(argv) {
    const siteSettings = sites.getSiteSettings(environment.currentSiteName);
	let phpVersion = siteSettings.default_php_version;
	if (argv.php) {
		phpVersion = argv.php;
	}
	const phpContainer = 'php' + phpVersion.toString().replace(/\./g, '');

	let workDir = '/var/www/html';
	if (environment.currentSiteName) {
		workDir += '/' + environment.currentSiteName + '/' + environment.currentPathInSite;
	}

	const shellCommand = 'cd ' + workDir + ' && composer ' + environment.subCommandArgs.join(' ');

	const composeArgs = [
		'exec',
		'--user=www-data',
		phpContainer,
		'/bin/sh',
		'-c',
		shellCommand
	];

	commands.composeCommand(composeArgs);
};

exports.command = 'composer [command]';
exports.builder = function(yargs) {
	return yargs
		.option('php <version>', {
			default: config.default_php_version,
			describe: 'The version of PHP which should be used to run the command.'
		});
};
exports.desc    = 'Runs a Composer command in the Docker container against the current site.';
exports.handler = composerCommand;