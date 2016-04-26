# AsyncCSS

[![NPM](https://nodei.co/npm/asynccss.png)](https://nodei.co/npm/asynccss/)

[![Build Status](https://travis-ci.org/dsheiko/asynccss.png)](https://travis-ci.org/dsheiko/asynccss)
[![Bower version](https://badge.fury.io/bo/asynccss.svg)](http://badge.fury.io/bo/asynccss)

A function for asynchronous loading of non-critical CSS and deferring Web Fonts,
which leverages localStorage for caching. When a new version of file supplied (app.css?v2) any old versions (app.css?xx)
are being removed from localStorage automatically

This work heavily influenced by
* [Breaking news at 1000ms, Patrick Hamann, The Guardian](https://speakerdeck.com/patrickhamann/breaking-news-at-1000ms-front-trends-2014)
* [BBC News team optimization experiments](https://github.com/BBC-News)
* [Improving Smashing Magazine’s Performance: A Case Study](http://www.smashingmagazine.com/2014/09/08/improving-smashing-magazine-performance-case-study/)


Licensed MIT

## Install
With npm do:
```
npm install asynccss --save
```
With bower do:
```
bower install asynccss --save
```

## Usage

```js
asyncCss( [ path, .. ], options? );

options:
 {Boolean} [debug="false"] - is verbose mode? (tells what it does in the console log)
 {String} [ns="css_cache_"] - namespace per asyncCss call. If you reuse asyncCss later in your JavaScript,
   supply a different `ns`. That will prevent the garbage collector from cleaning up items cached in a previous call.
 {Function} [done=function(){}] - callback function
```

## Example

``` html
<head>
...
<script type="text/javascript">
  (function(){
    <?php include ".../asyncCss.min.js"; ?>
    try {
      asyncCss( [ "css/foo.css", "css/bar.css" ], { debug: true } );
    } catch( e ) {
      console.log( "asyncCss: exception " + e );
    }
  }());
</script>
<noscript>
<link href="css/foo.css" rel="stylesheet">
<link href="css/bar.css" rel="stylesheet">
</noscript>
...
</head>
```

## Run automated-tests
```
$grunt mocha_phantomjs
```

## Changelog

* 0.0.5 - Garbage collector now removes only old version of a concrete supplied css file.
* 0.0.4 - Automated tests supplied
* 0.0.3 - A separate cache namespace can be supplied now per asyncCss call
* 0.0.2 - Hotfix: missing early exit was causing async loading even after CSS is present in the cache
* 0.0.1 - First commit


[![Analytics](https://ga-beacon.appspot.com/UA-1150677-13/dsheiko/asynccss)](http://githalytics.com/dsheiko/asynccss)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dsheiko/asynccss/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

