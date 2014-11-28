# loadCSS

A function for loading non-critical CSS asynchronously that leverages localStorage for caching.

Licensed MIT

## Usage

``` html
<head>
...
<script type="text/javascript">
  (function(){
    <?php include ".../loadCss.min.js"; ?>
    try {
      loadCss( [ "css/foo.css", "css/bar.css" ], true );
    } catch( e ) {
      console.log( "loadCss: exception " + e );
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
