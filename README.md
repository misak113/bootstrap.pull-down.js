
Bootstrap Pull down event
=========================

Implementing pullDown event by jQuery with bootstrap style. 
PullDown is most used to refresh page by touch(drag), move down and drop finger from display.


insert this lines to your app:

<pre>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" />
		<link href="bootstrap.pull-down.css" rel="stylesheet" media="screen">
		<link href="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
		<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
		<script src="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
		<script src="bootstrap.pull-down.js"></script>
		<script type="text/javascript">
			$(document).ready(function () {
				$.pullDown.start();
			});
		</script>
	</head>
	<body>
		<div class="pull-down">
			<a href="#" class="work"><i class="indicator-click icon-refresh icon-large"></i></a>
			<i class="indicator icon-down-arrow icon-large"></i>
			<i class="indicator-working icon-roundabout icon-large"></i>
			<span class="pulled-label">Uvolněním aktualizovat</span>
			<span class="pull-label">Stažením aktualizovat</span>
			<span class="default-label">Kliknutím aktualizovat</span>
			<span class="working-label">Aktualizuji</span>
			<button type="button" class="close stop"><i class="icon-large icon-remove-2"></i></button>
		</div>
		<div style="height: 300px;" class="hero-unit">
			Some text of page
		</div>
	</body>
</html>
</pre>