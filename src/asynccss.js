/**
 * A function for loading non-critical CSS asynchronously that leverages localStorage for caching.
 * @param {Array} hrefs -  array of CSS file URLs
 * @param {Options} [options] - enables debug messaging into console.log
 * @returns {Array} log messags
 *
 * @typedef {Object} Options - loader options
 * @property {Boolean} [debug="false"] - is verbose mode?
 * @property {String} [ns="css_cache_"] - namespace per asyncCss call. If you reuse asyncCss later in your JavaScript,
 *  supply a different ns. That will prevent the garbage collector from cleaning up items cached in a previoud call.
 */
window.asyncCss = function( hrefs, options ){
  "use strict";
     /**
      * Provides Cache API for a given CSS filename
      * @param {string} filename
      */
  var Cache = function( filename ){
        var localStorage = options.localStorage,
            // Normalize filename to use it as a storage key
            getKey = function( filename ) {
              var re = /[\:\.\#\?=\\\/-]/g;
              return options.ns + filename.replace( re, "_" );
            },
            key = filename ? getKey( filename ) : null;
        return {
          /**
           * Invalidation all the obsolete hrefs
           * @param {Array} hrefs
           * @returns {void}
           */
          cleanup: function( hrefs ) {
            var i,
                keys = hrefs.map(function( href ){
                  return getKey( href );
                });

            for( i in localStorage ) {
              if ( keys.indexOf( i ) === -1 && i.indexOf( options.ns ) === 0 ) {
                utils.log( "invalidates obsolete `" + i + "`", 8 );
                localStorage.removeItem( i );
              }
            }
          },
          /**
           * Mutattor
           * @param {string} content
           * @returns {void}
           */
          set: function( content ) {
            localStorage.setItem( key, content );
          },
          /**
           * Accessor
           * @returns {string}
           */
          get: function() {
            try {
              return localStorage ? localStorage.getItem( key ) : null;
            } catch ( e ) {
              return null;
            }
          },
          /**
           * Is localStorage API available?
           * @returns {Boolean}
           */
          isAvailable: function() {
            return !!localStorage;
          },
          /**
           * Let's find out if localStorage writable
           * @returns {Boolean}
           */
          isLocalStoageWrittable: function() {
            try {
              localStorage.setItem( "test", "test" );
              localStorage.removeItem( "test" );
              return true;
            } catch ( e ) {
              return false;
            }
          }
        };
      },
      /**
       * @namespace
       */
      utils = {
          /**
          * Event listener helper
          * @param {Node} el
          * @param {Event} ev
          * @param {Function} callback
          * @returns {void}
          */
         on: function( el, ev, callback ) {
           if ( el.addEventListener ) {
             el.addEventListener( ev, callback, false );
           } else if ( el.attachEvent ) {
             el.attachEvent( "on" + ev, callback );
           }
         },
         /**
          * Is it a device that craches on localStorage invocation under
          * iOS Safari private browsing?
          * @returns {Boolean}
          */
         isIphone: function(){
           var re = /iPhone|iPad|iPod/i;
           return re.test( options.userAgent );
         },
         /**
          * stack of log messages for later access
          */
         logMsgs: [],
         /**
          * Outputs to console log if debug mode
          * @param {String} msg
          * @param {Number} code
          * @returns {void}
          */
         log: function( msg, code ) {
           this.logMsgs.push({ msg:msg, code: code });
           options.debug && console.log( "asyncCss: " + msg );
         }
      },
      /**
       * Provides CSS loading API
       * @param {Cache} cache
       */
      Loader = function( cache ){
        return {
          /**
           * Append inlined styles to the DOM
           * @param {String} text
           * @returns {void}
           */
         _injectRawStyle: function( text ) {
          var node = document.createElement( "style" );
          node.innerHTML = text;
          options.node.appendChild( node );
         },
         /**
          * Load CSS old-way (fallback behaviour)
          * @param {String} cssHref
          * @returns {void}
          */
         _loadCssForLegacyBrowser: function( cssHref ) {
            var node = document.createElement( "link" );
            node.href = cssHref;
            node.rel = "stylesheet";
            node.type = "text/css";
            options.node.appendChild( node );
         },
         /**
          * Load CSS asynchronously
          * @param {String} cssHref
          * @returns {void}
          */
         _loadCssForLegacyAsync: function( cssHref ){
            var that = this, xhr = new options.XMLHttpRequest();
            xhr.open( "GET", cssHref, true );
            utils.on( xhr, "load", function() {
              if ( xhr.readyState === 4 ) {
                utils.log( "`" + cssHref + "` is loaded", 5 );
                // once we have the content, quickly inject the css rules
                that._injectRawStyle( xhr.responseText );
                // iOS Safari private browsing
                if ( !utils.isIphone() && cache.isLocalStoageWrittable() ) {
                  utils.log( "localStorage available, caching `" + cssHref + "`", 4 );
                  cache.set( xhr.responseText );
                }
              }
              options.done( utils.logMsgs );
            });
            xhr.send();
         },
         /**
          * Decide what way CS to be loaded
          * @param {String} cssHref
          * @returns {void}
          */
         loadCss: function( cssHref ){
           var fetch;
           if ( !cache.isAvailable() || !options.XMLHttpRequest ) {
             utils.log( "fallback loading `" + cssHref + "`", 3 );
             this._loadCssForLegacyBrowser( cssHref );
             return options.done( utils.logMsgs );
           }
           fetch = cache.get();
           if ( fetch ) {
            utils.log( "`" + cssHref + "` injected from the cache", 2 );
            this._injectRawStyle( fetch );
            return options.done( utils.logMsgs );
           }
           utils.log( "start loading `" + cssHref + "` (asynchronously)", 1 );
           this._loadCssForLegacyAsync( cssHref );
         }
       };
      };

  // Defaults
  options = options || {};
  options.debug = options.debug || false;
  options.ns = options.ns || "css_cache_";
  // Inversion of control
  options.node = options.node || document.getElementsByTagName( "head" )[ 0 ];
  options.userAgent = options.userAgent || window.navigator.userAgent;
  options.localStorage = typeof options.localStorage !== "undefined" ? options.localStorage : window.localStorage;
  options.XMLHttpRequest = typeof options.XMLHttpRequest !== "undefined" ?
    options.XMLHttpRequest : window.XMLHttpRequest;
  options.done = options.done || function(){};

  (function(){
    var i = 0, l = hrefs.length;
    // Not like .forEach just in case of legacy browser
    for( ; i < l; i++ ) {
      ( new Loader( new Cache( hrefs[ i ] ) ) ).loadCss( hrefs[ i ] );
    }
  }());
  Array.prototype.map && Array.prototype.indexOf && ( new Cache() ).cleanup( hrefs );
};