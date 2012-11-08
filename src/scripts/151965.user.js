// ==UserScript==
// @version       1.0.1
// @name          C&C:Tiberium Alliances Extended Chathelper
// @namespace     cncchathelp ext auto
// @description   Automatically adding the [coords][/coords] & [url][/url] to chat chat messaeg
// @author        Rubbyx
// @include       http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*

// ==/UserScript==


// Main function was taken from the Extended Chathelper of ChorniRojko, http://userscripts.org/scripts/show/151047, which was taken from the original Chathelper of ssnoop , https://userscripts.org/scripts/show/133479
(function (){
    var cncloot_main = function() {
        function sisosnop_create() {
			window.onkeypress = function (te) {
			/* Alt+1 for Coordinates */

				document.onkeydown = function (e) {
    					e = e || window.event;
    					if (e.keyCode === 13) {
						var inputField = document.querySelector('input:focus, textarea:focus');
        					var re = new RegExp("([0-9]{3}[:][0-9]{3})","g");
							inputField.value = inputField.value.replace(re,"[coords]"+"$1"+"[/coords]");
							// auto url
							inputField.value = inputField.value.replace(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-\?\&]*)*\/?/gi, '[url]$&[/url]');
							// shorthand for alliance
							inputField.value = inputField.value.replace(/\[a\]([a-z0-9_-\s]+)\[\/a\]/gi, '[alliance]$1[/alliance]')
							// shorthand for player
							inputField.value = inputField.value.replace(/\[p\]([a-z0-9_-\s]+)\[\/p\]/gi, '[player]$1[/player]')
    					}    					
    
    					//return false;
				}

				/*if (te.charCode == 49 && te.altKey && !te.altGraphKey && !te.ctrlKey) {
					var inputField = document.querySelector('input:focus, textarea:focus');
					if (inputField !== null){
						//var coordstext=prompt("Coordinates (Syntax: 123456, instead of 123:456)","");
						//if (coordstext!== null){
						//coordstext=coordstext.substr(0,3) + "" + coordstext.substr(3,5);
						//inputField.value += '[coords]'+coordstext+'[/coords]';
						//}
						var re = new RegExp("([0-9]{3}[:][0-9]{3})","g");
						inputField.value = inputField.value.replace(re,"[coords]"+"$1"+"[/coords]");
					}
				}*/
				/* Alt+2 for URLs */
					if (te.charCode == 50 && te.altKey && !te.altGraphKey && !te.ctrlKey) {
					var inputField = document.querySelector('input:focus, textarea:focus');
					if (inputField !== null){
						var url=prompt("Website (Syntax: google.com or www.google.com)","");
						if (url!== null){
						inputField.value += '[url]'+url+'[/url]';
						}	
					}
				}	
				/* Alt+3 for players */
					if (te.charCode == 51 && te.altKey && !te.altGraphKey && !te.ctrlKey) {
					var inputField = document.querySelector('input:focus, textarea:focus');
					if (inputField !== null){
						var playername=prompt("Playername (Syntax: playername)","");
						if (playername!== null){
						inputField.value += '[player]'+playername+'[/player]';
						}	
					}
				}	
				/* Alt+4 for alliances */
					if (te.charCode == 52 && te.altKey && !te.altGraphKey && !te.ctrlKey) {
					var inputField = document.querySelector('input:focus, textarea:focus');
					if (inputField !== null){
						var alliancename=prompt("Alliancename (Syntax: alliance)","");
						if (alliancename!== null){
						inputField.value += '[alliance]'+alliancename+'[/alliance]';
						}	
					}
				}
			};

        }
    /* Nice load check (ripped from AmpliDude's LoU Tweak script) */
	function cnc_check_if_loaded() {
		try {
			if (typeof qx != 'undefined') {
				a = qx.core.Init.getApplication(); // application
				if (a) {
					sisosnop_create();
				} else {
					window.setTimeout(cnc_check_if_loaded, 1000);
                                }
			} else {
				window.setTimeout(cnc_check_if_loaded, 1000);
			}
		} catch (e) {
			if (typeof console != 'undefined') console.log(e);
			else if (window.opera) opera.postError(e);
			else GM_log(e);
		}
	}

	if (/commandandconquer\.com/i.test(document.domain))
		window.setTimeout(cnc_check_if_loaded, 1000);

    }

    // injecting because I can't seem to hook into the game interface via unsafeWindow
    var script_block = document.createElement("script");
    txt = cncloot_main.toString();
    script_block.innerHTML = "(" + txt + ")();";
    script_block.type = "text/javascript";
    if (/commandandconquer\.com/i.test(document.domain))
        document.getElementsByTagName("head")[0].appendChild(script_block);

}
)();
