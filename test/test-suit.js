var
    LOAD_BY_XHR = 1,
    LOAD_FROM_CACHE = 2,
    LOAD_FALLBACK = 3,
    SET_CACHE = 4,
    LOADED_BY_XHR = 5,
    FLUSH_CACHE = 8,

    FIXTURE_NS = "test_",
    FIXTURE_CSS_PATH1 = "fixture.css",
    FIXTURE_CSS_PATH2 = "fixture2.css",
    FIXTURE_CSS = ".injected-style {  display: none; }",
    localStorage = window.localStorage,
    sandbox = document.getElementById( "sandbox" ),

    path1key = FIXTURE_NS + FIXTURE_CSS_PATH1.replace( ".", "_" ),
    path2key = FIXTURE_NS + FIXTURE_CSS_PATH2.replace( ".", "_" ),

    cleanupCache = function(){
      var i;
      for( i in localStorage ) {
         localStorage.removeItem( i );
      }
    },
    contains = function( msgs, code ) {
      return !!msgs.filter(function( item ){
        return item.code === code;
      }).length;
    };

describe( "asyncCss when first time loaded", function(){

  before(function(){
    this.server = sinon.fakeServer.create();
    this.server.respondWith( "GET", FIXTURE_CSS_PATH1,
      [ 200, { "Content-Type": "text/css" }, FIXTURE_CSS ]);
  });

  after(function(){
    this.server.restore();
  });

  beforeEach(function(){
    cleanupCache();
    sandbox.innerHTML = "";
  });

  it( "loads styles using XHR", function( done ){
    asyncCss([ FIXTURE_CSS_PATH1 ], {
      ns: FIXTURE_NS,
      node: sandbox,
      done: function( msgs ){
        expect( contains( msgs, LOAD_BY_XHR ) ).to.be.ok;
        expect( contains( msgs, SET_CACHE ) ).to.be.ok;
        // adds styles to the DOM
        expect( sandbox.querySelector( "style" ) ).to.be.ok;
        done();
      }
    });
    this.server.respond();
  });
});



describe( "asyncCss when second time loaded", function(){

  before(function(){
    this.server = sinon.fakeServer.create();
    this.server.respondWith( "GET", FIXTURE_CSS_PATH1,
      [ 200, { "Content-Type": "text/css" }, FIXTURE_CSS ]);
  });

  after(function(){
    this.server.restore();
  });

  beforeEach(function(){
    cleanupCache();
    sandbox.innerHTML = "";
  });

  it( "loads styles from cache", function( done ){
    asyncCss([ FIXTURE_CSS_PATH1 ], {
      ns: FIXTURE_NS,
      node: sandbox,
      done: function(){
        sandbox.innerHTML = "";
        asyncCss([ FIXTURE_CSS_PATH1 ], {
          ns: FIXTURE_NS,
          node: sandbox,
          done: function( msgs ){
            expect( contains( msgs, LOAD_FROM_CACHE ) ).to.be.ok;
            // adds styles to the DOM
            expect( sandbox.querySelector( "style" ) ).to.be.ok;
            done();
          }
        });
      }
    });
    this.server.respond();
  });

});




describe( "asyncCss on fallback behaviour when", function(){

  describe( "localStorage is not available", function(){
    it( "simply adds LINK element to the DOM", function( done ){
      sandbox.innerHTML = "";
      asyncCss([ FIXTURE_CSS_PATH1 ], {
        ns: FIXTURE_NS,
        node: sandbox,
        localStorage: null,
        done: function( msgs ){
          expect( contains( msgs, LOAD_FALLBACK ) ).to.be.ok;
          expect( sandbox.querySelector( "link" ) ).to.be.ok;
          done();
        }
      });
    });
  });

  describe( "XMLHttpRequest is not available", function(){
    it( "simply adds LINK element to the DOM", function( done ){
      sandbox.innerHTML = "";
      asyncCss([ FIXTURE_CSS_PATH1 ], {
        ns: FIXTURE_NS,
        node: sandbox,
        XMLHttpRequest: null,
        done: function( msgs ){
          expect( contains( msgs, LOAD_FALLBACK ) ).to.be.ok;
          expect( sandbox.querySelector( "link" ) ).to.be.ok;
          done();
        }
      });
    });
  });

});



describe( "asyncCss when under iOS", function(){

    before(function(){
      this.server = sinon.fakeServer.create();
      this.server.respondWith( "GET", FIXTURE_CSS_PATH1,
        [ 200, { "Content-Type": "text/css" }, FIXTURE_CSS ]);
    });

    after(function(){
      this.server.restore();
    });

    beforeEach(function(){
      cleanupCache();
      sandbox.innerHTML = "";
    });


    it( "does not cache", function( done ){
      asyncCss([ FIXTURE_CSS_PATH1 ], {
        ns: FIXTURE_NS,
        node: sandbox,
        userAgent: "Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16",
        done: function( msgs ){
          expect( contains( msgs, LOAD_BY_XHR ) ).to.be.ok;
          expect( contains( msgs, SET_CACHE ) ).to.be.false();
          // adds styles to the DOM
          expect( sandbox.querySelector( "style" ) ).to.be.ok;
          done();
        }
      });
      this.server.respond();
    });
  });



  describe( "asyncCss when localStorage isn't writtable", function(){

    before(function(){
      this.server = sinon.fakeServer.create();
      this.server.respondWith( "GET", FIXTURE_CSS_PATH1,
        [ 200, { "Content-Type": "text/css" }, FIXTURE_CSS ]);
    });

    after(function(){
      this.server.restore();
    });

    beforeEach(function(){
      cleanupCache();
      sandbox.innerHTML = "";
    });


    it( "does not cache", function( done ){
      asyncCss([ FIXTURE_CSS_PATH1 ], {
        ns: FIXTURE_NS,
        node: sandbox,
        localStorage: function(){
          return { setItem: function(){
              throw new Error( "read-only" );
          }};
        },
        done: function( msgs ){
          expect( contains( msgs, LOAD_BY_XHR ) ).to.be.ok;
          expect( contains( msgs, SET_CACHE ) ).to.be.false();
          // adds styles to the DOM
          expect( sandbox.querySelector( "style" ) ).to.be.ok;
          done();
        }
      });
      this.server.respond();
    });
  });


describe( "asyncCss::garbageCollector", function(){

  before(function(){
    cleanupCache();
    sandbox.innerHTML = "";
  });

  describe( "on first run", function(){

    before(function(){
      this.server = sinon.fakeServer.create();
      this.server.respondWith( "GET", FIXTURE_CSS_PATH2,
        [ 200, { "Content-Type": "text/css" }, FIXTURE_CSS ]);
    });

    after(function(){
      this.server.restore();
    });

    it( "polutes to localStorage", function( done ){
      asyncCss([ FIXTURE_CSS_PATH2 ], {
        ns: FIXTURE_NS,
        node: sandbox,
        done: function(){
          expect( localStorage.getItem( path2key ) ).to.be.ok;
          done();
        }
      });
      this.server.respond();
    });
  });

  describe( "on second run ( CSS URLs changed )", function(){

    before(function(){
      this.server = sinon.fakeServer.create();
      this.server.respondWith( "GET", FIXTURE_CSS_PATH1,
        [ 200, { "Content-Type": "text/css" }, FIXTURE_CSS ]);
    });

    after(function(){
      this.server.restore();
    });

    it( "leaves no garbage of the first run", function( done ){
      asyncCss([ FIXTURE_CSS_PATH1 ], {
        ns: FIXTURE_NS,
        node: sandbox,
        done: function(){
          expect( localStorage.getItem( path1key ) ).to.be.ok;
          expect( localStorage.getItem( path2key ) ).to.be.not.ok;
          done();
        }
      });
      this.server.respond();
    });
  });

});
