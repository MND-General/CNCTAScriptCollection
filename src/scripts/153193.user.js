// ==UserScript==
// @name        C&C:TA Compass Movable
// @namespace   http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @description Creates compass poiting to the currently selected base (compass points from itself).
// @version     1.1.0
// @author      Caine,BlinDManX
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==/UserScript==
(function () {
    var CompassMain = function () {
        try {
            function createCompass() {
                console.log('Compass loaded');
                qx.Class.define("Compass", {
                    extend: qx.ui.window.Window,
                    construct: function () {
                        this.base(arguments);
                        this.setWidth(54);
                        this.setHeight(90);
                        this.setContentPadding(0);
                        this.setShowMinimize(false);
                        this.setShowMaximize(false);
                        this.setShowClose(false);
                        this.setResizable(false);
                        this.setAllowMaximize(false);
                        this.setAllowMinimize(false);
                        this.setAllowClose(false);
                        this.setShowStatusbar(false);
                        this.setDecorator(null);                        
                        var title = this.getChildControl("title");
                        title.setTextAlign("center");
                        title.setTextColor("#FFF");
                        title.setRich(true);
                        title.setDecorator("tabview-chat-pane");
                        var captionBar = this.getChildControl("captionbar");
                        captionBar.setDecorator(null);
                        captionBar.remove(this.getChildControl("icon"));
                        captionBar.remove(this.getChildControl("minimize-button"));
                        captionBar.remove(this.getChildControl("restore-button"));
                        captionBar.remove(this.getChildControl("maximize-button"));
                        captionBar.remove(this.getChildControl("close-button"));
                        captionBar.setLayout(new qx.ui.layout.Grow());
                       
                        var pane = this.getChildControl("pane");
                        pane.setDecorator(null);
                        pane.setLayout(new qx.ui.layout.Grow());
                        this.setLayout(new qx.ui.layout.Canvas());
                      
                        var st = '<canvas id="compass" style="border:1px solid;position: absolute; top: 0px; left: 0px;" height="50" width="50"></canvas>';
                        var l = new qx.ui.basic.Label().set({
                            value: st,
                            rich: true
                        });
                        this.add(l);  
                        
                        
                        webfrontend.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance().get_Region(), "PositionChange", ClientLib.Vis.PositionChange, this, this.displayCompass);
                        this.addListener("move", function (e) {
                            this.displayCompass();
                        });
                        
                    },
                    members: {
                        needle: null,                        
                        ec: null,
                        ctx: null,
                        halfsize: 25,
                        displayCompass: function () {
                            try {
                                if (this.ctx != null) {
                                    var winpos = this.getLayoutProperties();
                                    var ctx = this.ctx;
                                   
                                    var currentCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                    var faction = currentCity.get_CityFaction();
                                    var cityCoordX = currentCity.get_PosX();
                                    var cityCoordY = currentCity.get_PosY();
                                    var region = ClientLib.Vis.VisMain.GetInstance().get_Region();
                                    var zoom = region.get_ZoomFactor();
                                    var targetCoordX = winpos.left + 34;
                                    var targetCoordY = winpos.top +  61;
                                    var gridW = region.get_GridWidth();
                                    var gridH = region.get_GridHeight();
                                    var viewCoordX = (region.get_PosX() + targetCoordX / zoom - zoom * gridW / 2) / gridW;
                                    var viewCoordY = (region.get_PosY() + targetCoordY / zoom - zoom * gridH / 2) / gridH;
                                    var dx = viewCoordX - cityCoordX;
                                    var dy = cityCoordY - viewCoordY;
                                    var distance = Math.sqrt(dx * dx + dy * dy);
                                    var dtext = Math.round(10 * distance) / 10;
                                    var t = qx.lang.String.pad(currentCity.get_Name(),7,"")+"<br>"+dtext;
                                    this.setCaption(t);
                                    
                                    
                                    ctx.clearRect(0, 0, 50, 50);
                                    ctx.save();
                                    ctx.globalAlpha = 0.5;
                                    ctx.fillStyle = '#000';
                                    ctx.fillRect(0, 0, 50, 50); 
                                    ctx.globalAlpha = 1.0;
                 
                                    ctx.translate(25, 25);
                                    ctx.rotate(dy > 0 ? Math.asin(dx / distance) : -Math.asin(dx / distance) + Math.PI); 
                                    ctx.beginPath();			
                                    ctx.moveTo(0, 20);			
                                    ctx.lineTo(17, -15);
                                    ctx.lineTo(-17, -15);
                                    ctx.closePath();
                                    ctx.moveTo(0, 0);			
                                    ctx.lineTo(10, -22);
                                    ctx.lineTo(-10, -22);
                                    ctx.closePath();            
                                    
                                    ctx.lineWidth =3.0;
                                    ctx.fillStyle = faction == ClientLib.Base.EFactionType.GDIFaction ? "#00a" : "#a00"; 
                                    ctx.strokeStyle = "#ddd";
                                
                                    ctx.fill();
                                    ctx.stroke();
                                    ctx.restore();
                                    console.log(faction);
                                    
                                } else {                                    
                                    this.ec = document.getElementById("compass");
                                    if (this.ec != null){
                                        this.ctx = this.ec.getContext('2d');
                                        console.log("ok");
                                        this.displayCompass();                                      
                                    }                                    
                                } 
                            } catch (e) {
                                console.log("displayCompass", e);
                            }
                        }
                    }
                });
                var win = new Compass();
                win.moveTo(140, 30);
                win.open();
            }
        } catch (e) {
            console.log('createCompass: ', e);
        }
        function CompassCheckLoaded() {
            try {
                if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
                    createCompass();
                } else {
                    window.setTimeout(CompassCheckLoaded, 1000);
                }
            } catch (e) {
                console.log('CompassCheckLoaded: ', e);
            }
        }
        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(CompassCheckLoaded, 5000);
        }
    }
    try {
        var CompassScript = document.createElement('script');
        CompassScript.innerHTML = "(" + CompassMain.toString() + ')();';
        CompassScript.type = 'text/javascript';
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName('head')[0].appendChild(CompassScript);
        }
    } catch (e) {
        console.log('Compass: init error: ', e);
    }
})();