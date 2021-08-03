/*
 * Copyright © 2016, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

var autoDismiss = true;
document.addEventListener('deviceready', function() {
    MCEInAppPlugin.registerInAppTemplate(function(inAppMessage) {

        MCEInAppMedia.show(inAppMessage, function () {

			$('.mediaInApp').append("<div id='video'><video playsinline webkit-playsinline><source src=" + inAppMessage['content']['video'] + ">Your browser does not support the video tag.</video></div>")
			$('.mediaInApp .text div').prepend("<progress id='videoProgress'></progress>");

			$('#inApp .text div').css({ 'border-top': '0' });

			var progress = $('#videoProgress').get(0);
			progress.max = 1;
			progress.min = 0;
			progress.value = 0;

			// This requires <preference name="AllowInlineMediaPlayback" value="true"/> in config.xml
			// App Transport Security can also block videos from playing.
			$('#video video').click(function() {
				MCEInAppPlugin.executeInAppAction(inAppMessage['content']['action'])
				MCEInAppPlugin.deleteInAppMessage(inAppMessage['inAppMessageId']);
				MCEInAppMedia.hideMediaInApp();
			}).bind("timeupdate", function() {
				progress.value = video.currentTime / video.duration;
			}).bind('ended', function() {
				if (MCEInAppMedia.autoDismiss)
					MCEInAppMedia.hideMediaInApp();
			});

			// Animate in
			$('.mediaInApp').css({ "height": document.height + "px", "top": document.height + "px" }).animate({ "top": 0 }, function() {
				$('#video video').get(0).play();
			});
        
		});

    }, "video");
});