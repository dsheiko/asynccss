# AsyncCSS
[![Build Status](https://travis-ci.org/dsheiko/asynccss.png)](https://travis-ci.org/dsheiko/asynccss)
[![NPM version](https://badge.fury.io/js/asynccss.png)](http://badge.fury.io/js/asynccss)

A function for asynchronous loading of non-critical CSS and deferring Web Fonts,
which leverages localStorage for caching.

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

* 0.0.4 - Automated tests supplied
* 0.0.3 - A separate cache namespace can be supplied now per asyncCss call
* 0.0.2 - Hotfix: missing early exit was causing async loading even after CSS is present in the cache
* 0.0.1 - First commit
