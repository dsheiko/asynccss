/**
 * A function for loading non-critical CSS asynchronously that leverages localStorage for caching.
 * @param {Array} hrefs -  array of CSS file URLs
 * @param {Boolean} debug [OPTIONAL] - enables debug messaging into console.log
 * @returns {void}
 */
window.loadCss = function( hrefs, debug ){
  /**
   * It's supposed to be wrapped in a closure on a higher level
   */
  "use strict";
     /**
      * Provides Cache API for a given CSS filename
      * @param {string} filename
      */
  var Cache = function( filename ){
        var localStorage = window.localStorage,
            // Normalize filename to use it as a storage key
            getKey = function( filename ) {
              var re = /[\:\.\#\?=\\\/-]/g;
              return "css_cache_" + filename.replace( re, "_" );
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
              if ( keys.indexOf( i ) === -1 && i.match( /^css_cache_/g ) ) {
                utils.log( "loadCss: invalidates obsolete `" + i + "`" );
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
            return localStorage ? localStorage.getItem( key ) : null;
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
              utils.log( "loadCss: localStorage is not writtable" );
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
           return re.test( window.navigator.userAgent );
         },
         /**
          * Outputs to console log if debug mode
          * @param {String} msg
          * @returns {void}
          */
         log: function( msg ) {
           debug && console.log( msg );
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
          document.getElementsByTagName( "head" )[ 0 ].appendChild( node );
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
            document.getElementsByTagName( "head" )[ 0 ].appendChild( node );
         },
         /**
          * Load CSS asynchronously
          * @param {String} cssHref
          * @returns {void}
          */
         _loadCssForLegacyAsync: function( cssHref ){
            var that = this, xhr = new window.XMLHttpRequest();
            xhr.open( "GET", cssHref, true );
            utils.on( xhr, "load", function() {
              if ( xhr.readyState === 4 ) {
                utils.log( "loadCss: `" + cssHref + "` loaded async" );
                // once we have the content, quickly inject the css rules
                that._injectRawStyle( xhr.responseText );
                // iOS Safari private browsing
                if ( !utils.isIphone() && cache.isLocalStoageWrittable() ) {
                  utils.log( "loadCss: localStorage available, caching `" + cssHref + "`" );
                  cache.set( xhr.responseText );
                }
              }
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
           if ( !cache.isAvailable() || !window.XMLHttpRequest ) {
             utils.log( "loadCss: loading `" + cssHref + "` old-way" );
             return this._loadCssForLegacyBrowser( cssHref );
           }
           fetch = cache.get();
           if ( fetch ) {
            utils.log( "loadCss: `" + cssHref + "` injected from the cache" );
            this._injectRawStyle( fetch );
           }
           utils.log( "loadCss: loading `" + cssHref + "` asynchronously" );
           this._loadCssForLegacyAsync( cssHref );
         }
       };
      };

  debug = debug || false;
  (function(){
    var i = 0, l = hrefs.length;
    // Not like .forEach just in case of legacy browser
    for( ; i < l; i++ ) {
      ( new Loader( new Cache( hrefs[ i ] ) ) ).loadCss( hrefs[ i ] );
    }
  }());
  Array.prototype.map && Array.prototype.indexOf && ( new Cache() ).cleanup( hrefs );
};