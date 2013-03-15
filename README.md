
Bootstrap Pull down event
=========================

Implementing pullDown event by jQuery with bootstrap style. 
PullDown is most used to refresh page by touch(drag), move down and drop finger from display.


insert this lines to your app:

<pre>
&lt;!DOCTYPE html>
&lt;html>
	&lt;head>
		&lt;meta charset="utf-8" />
		&lt;meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" />
		&lt;link href="bootstrap.pull-down.css" rel="stylesheet" media="screen">
		&lt;link href="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
		&lt;script src="http://code.jquery.com/jquery-1.9.1.min.js">&lt;/script>
		&lt;script src="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js">&lt;/script>
		&lt;script src="bootstrap.pull-down.js">&lt;/script>
		&lt;script type="text/javascript">
			$(document).ready(function () {
				$.pullDown.start();
			});
		&lt;/script>
	&lt;/head>
	&lt;body>
		&lt;div class="pull-down">
			&lt;a href="#" class="work">&lt;i class="indicator-click icon-refresh icon-large">&lt;/i>&lt;/a>
			&lt;i class="indicator icon-down-arrow icon-large">&lt;/i>
			&lt;i class="indicator-working icon-roundabout icon-large">&lt;/i>
			&lt;span class="pulled-label">Uvolněním aktualizovat&lt;/span>
			&lt;span class="pull-label">Stažením aktualizovat&lt;/span>
			&lt;span class="default-label">Kliknutím aktualizovat&lt;/span>
			&lt;span class="working-label">Aktualizuji&lt;/span>
			&lt;button type="button" class="close stop">&lt;i class="icon-large icon-remove-2">&lt;/i>&lt;/button>
		&lt;/div>
		&lt;div style="height: 300px;" class="hero-unit">
			Some text of page
		&lt;/div>
	&lt;/body>
&lt;/html>
</pre>


API-documentation
-----------------

Events:

pullDown
	- if pulled down (time to refresh)
pullDownStopWorking
	- if clicked to stop refreshing



Options:

container
	- which element react to touches

pullDown
	- the element contained the pullDown pane at top



Methods:

start(options)
	- start the pullDown

enable()
	- set as enabled and start (default is enabled)

disable()
	- set as disabled and start (refresh pane isstatic)



Properties:

enabled
	- is pullDown enabled (or disabled and is static pane)

container
	- the global container element for pullDown