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
	"images/inbox/trash-light@3x.png",


	/**InAPP*/
	"css/inapp_media.css",
    "css/inapp_banner.css", 
    "css/inapp_image.css", 
    "css/inapp_video.css", 

    "images/inApp/dismiss.png", 
    "images/inApp/dismiss@2x.png", 
    "images/inApp/dismiss@3x.png", 

    "images/inApp/handle.png", 
    "images/inApp/handle@2x.png", 
    "images/inApp/handle@3x.png", 
    
    "images/inApp/cancel.png", 
    "images/inApp/cancel@2x.png", 
    "images/inApp/cancel@3x.png", 

    "images/inApp/comment.png", 
    "images/inApp/comment@2x.png", 
    "images/inApp/comment@3x.png", 

    "images/inApp/note.png", 
    "images/inApp/note@2x.png", 
    "images/inApp/note@3x.png", 

    "images/inApp/notification.png", 
    "images/inApp/notification@2x.png", 
    "images/inApp/notification@3x.png", 

    "images/inApp/offer.png", 
    "images/inApp/offer@2x.png", 
    "images/inApp/offer@3x.png", 

    "images/inApp/store.png", 
    "images/inApp/store@2x.png", 
    "images/inApp/store@3x.png"
];

var images="";

var fs = require('fs');
var path = require('path');
 
var rootdir = path.join(process.env.PWD, "plugins", "co.acoustic.mobile.push.sdk");
console.log("rootdir:"+rootdir);

images=path.join(process.env.PWD,"www","images");//ruta source/www/images/inApp
if(!fs.existsSync(images)){
    console.log("mkdir:" + images);       
    fs.mkdirSync(images);
    console.log("Create: "+images);
}

images=path.join(process.env.PWD,"www","images","inApp");//ruta source/www/images/inApp
if(!fs.existsSync(images)){
    console.log("mkdir:" + images);       
    fs.mkdirSync(images);
    console.log("Create: "+images);
}

images=path.join(process.env.PWD,"www","images","inbox");//ruta source/www/images/inbox
if(!fs.existsSync(images)){
    console.log("mkdir:" + images);       
    fs.mkdirSync(images);
    console.log("Create: "+images);
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

