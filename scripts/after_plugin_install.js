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
	/**InBox*/
	"css/inbox_post.css",
	"css/inbox_default.css",
	"css/inbox.css",

	"img/inbox/chevron-down-dark.png",
	"img/inbox/chevron-down-dark@2x.png",
	"img/inbox/chevron-down-dark@3x.png",
	"img/inbox/chevron-down-light.png",
	"img/inbox/chevron-down-light@2x.png",
	"img/inbox/chevron-down-light@3x.png",
	"img/inbox/chevron-up-dark.png",
	"img/inbox/chevron-up-dark@2x.png",
	"img/inbox/chevron-up-dark@3x.png",
	"img/inbox/chevron-up-light.png",
	"img/inbox/chevron-up-light@2x.png",
	"img/inbox/chevron-up-light@3x.png",
	"img/inbox/refresh-dark.png",
	"img/inbox/refresh-dark@2x.png",
	"img/inbox/refresh-dark@3x.png",
	"img/inbox/refresh-light.png",
	"img/inbox/refresh-light@2x.png",
	"img/inbox/refresh-light@3x.png",
	"img/inbox/trash-dark.png",
	"img/inbox/trash-dark@2x.png",
	"img/inbox/trash-dark@3x.png",
	"img/inbox/trash-light.png",
	"img/inbox/trash-light@2x.png",
	"img/inbox/trash-light@3x.png",


	/**InAPP*/
	"css/inapp_media.css",
    "css/inapp_banner.css", 
    "css/inapp_image.css", 
    "css/inapp_video.css", 

    "img/inApp/dismiss.png", 
    "img/inApp/dismiss@2x.png", 
    "img/inApp/dismiss@3x.png", 

    "img/inApp/handle.png", 
    "img/inApp/handle@2x.png", 
    "img/inApp/handle@3x.png", 
    
    "img/inApp/cancel.png", 
    "img/inApp/cancel@2x.png", 
    "img/inApp/cancel@3x.png", 

    "img/inApp/comment.png", 
    "img/inApp/comment@2x.png", 
    "img/inApp/comment@3x.png", 

    "img/inApp/note.png", 
    "img/inApp/note@2x.png", 
    "img/inApp/note@3x.png", 

    "img/inApp/notification.png", 
    "img/inApp/notification@2x.png", 
    "img/inApp/notification@3x.png", 

    "img/inApp/offer.png", 
    "img/inApp/offer@2x.png", 
    "img/inApp/offer@3x.png", 

    "img/inApp/store.png", 
    "img/inApp/store@2x.png", 
    "img/inApp/store@3x.png"
];

var img="";

var fs = require('fs');
var path = require('path');
 
var rootdir = path.join(process.env.PWD, "plugins", "co.acoustic.mobile.push.sdk");
console.log("rootdir:"+rootdir);

img=path.join(process.env.PWD,"www","img","inApp");//ruta source/www/img/inApp
if(!fs.existsSync(img)){
    console.log("mkdir:" + img);       
    fs.mkdirSync(img);
}

img=path.join(process.env.PWD,"www","img","inbox");//ruta source/www/img/inbox
if(!fs.existsSync(img)){
    console.log("mkdir:" + img);       
    fs.mkdirSync(img);
}



filestocopy.forEach(function(val) {
	console.log("------------New CopyFile-------------");
	console.log("val:"+val);

    var srcfile = path.join(rootdir, val);
    console.log("srcfile:"+srcfile);

    var destfile = path.join(process.env.PWD, "www", val);
    console.log("destfile:"+destfile);

    var destdir = path.dirname(destfile);
    console.log("destdir:"+destdir);
    
    if(!fs.existsSync(destdir)) {
        console.log("mkdir:" + destdir);       
        fs.mkdirSync(destdir);
    }
    
    if (fs.existsSync(srcfile)) {
	    console.log("copying " + srcfile + " to " + destfile);
        fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
    } else {
    	console.error("Could not find source file " + srcfile)
    }
});

