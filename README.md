# AsyncCSS

A function for asynchronous loading of non-critical CSS and deferring Web Fonts,
which leverages localStorage for caching.

This work heavily influenced by
* [Breaking news at 1000ms, Patrick Hamann, The Guardian |https://speakerdeck.com/patrickhamann/breaking-news-at-1000ms-front-trends-2014]
* [BBC News team optimization experiments|https://github.com/BBC-News]
* [Improving Smashing Magazine’s Performance: A Case Study](http://www.smashingmagazine.com/2014/09/08/improving-smashing-magazine-performance-case-study/)

Licensed MIT

## Usage

``` html
<head>
...
<script type="text/javascript">
  (function(){
    <?php include ".../asyncCss.min.js"; ?>
    try {
      asyncCss( [ "css/foo.css", "css/bar.css" ], true );
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
