/*
 * Copyright © 2015, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

var filestocopy = [
	"css/inbox_post.css",
	"css/inbox_default.css",
	"css/inbox.css",

	"images/inbox/chevron-down-dark.png",
	"images/inbox/chevron-down-dark@2x.png",
	"images/inbox/chevron-down-dark@3x.png",
	"images/inbox/chevron-down-light.png",
	"images/inbox/chevron-down-light@2x.png",
	"images/inbox/chevron-down-light@3x.png",
	"images/inbox/chevron-up-dark.png",
	"images/inbox/chevron-up-dark@2x.png",
	"images/inbox/chevron-up-dark@3x.png",
	"images/inbox/chevron-up-light.png",
	"images/inbox/chevron-up-light@2x.png",
	"images/inbox/chevron-up-light@3x.png",
	"images/inbox/refresh-dark.png",
	"images/inbox/refresh-dark@2x.png",
	"images/inbox/refresh-dark@3x.png",
	"images/inbox/refresh-light.png",
	"images/inbox/refresh-light@2x.png",
	"images/inbox/refresh-light@3x.png",
	"images/inbox/trash-dark.png",
	"images/inbox/trash-dark@2x.png",
	"images/inbox/trash-dark@3x.png",
	"images/inbox/trash-light.png",
	"images/inbox/trash-light@2x.png",
	"images/inbox/trash-light@3x.png"
];

var fs = require('fs');
var path = require('path');
 
var rootdir = path.join(process.env.PWD, "plugins", "co.acoustic.mobile.push.plugin.inbox");
 
filestocopy.forEach(function(val) {
    var srcfile = path.join(rootdir, val);
    var destfile = path.join(process.env.PWD, "www", val);
    var destdir = path.dirname(destfile);
    
    if(!fs.existsSync(destdir)) {
        console.log("mkdir " + destdir);
        fs.mkdirSync(destdir);
    }
    
    if (fs.existsSync(srcfile)) {
	    console.log("copying " + srcfile + " to " + destfile);
        fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
    } else {
    	console.error("Could not find source file " + srcfile)
    }
});

