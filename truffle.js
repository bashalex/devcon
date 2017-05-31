var DefaultBuilder = require("truffle-default-builder");

module.exports = {
	build: new DefaultBuilder({
		"index.html": "index.html",
		"app.js": [
	  	  	"javascripts/app.js"
	    ],
	    "bootstrap.min.js": [
	  	  	"javascripts/bootstrap.min.js"
	    ],
		"app.css": [
	  		"stylesheets/app.css",
	    ],
	    "bootstrap.min.css": [
	    	"stylesheets/bootstrap.min.css",
	    ],
	    "carousel.css": [
	  		"stylesheets/carousel.css",
	    ],
	    "ie10-viewport-bug-workaround.css": [
	  		"stylesheets/ie10-viewport-bug-workaround.css",
	    ],
		"images/": "images/"
	}),
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    kovan: {
  	    host: "52.57.192.243",
	    port: 8546,
	    network_id: "*",
	    from: "0x5b7758a2f9ccefc81badf3fd362bedd094c1881c"
    }
  }
};
