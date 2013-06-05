var Stat;
if (!this.Stat) {
	Stat = (function () {
		function generateUUID(length){
			var id = new Date().getTime().toString();
			for(var i=0; i<length; i++) id += Math.floor(Math.random()*10);
			return id;
		}
		var load_time = Date.parse(new Date()), stay_time = 0; uuid = generateUUID(10);
		var expireDateTime, documentAlias = document, navigatorAlias = navigator, screenAlias = screen, windowAlias = window, hostnameAlias = windowAlias.location.hostname, hasLoaded = false, registeredOnLoadHandlers = [];
		function isDefined(property) {
			return typeof property !== "undefined";
		}
		function addEventListener(element, eventType, eventHandler, useCapture) {
			if (element.addEventListener) {
				element.addEventListener(eventType, eventHandler, useCapture);
				return true;
			} else {
				if (element.attachEvent) {
					return element.attachEvent("on" + eventType, eventHandler);
				}
			}
			element["on" + eventType] = eventHandler;
		}
		function beforeUnloadHandler() {
			var _hack = true;
			try{
				if(!!( window.attachEvent && !window.opera )){
					var _active = window.document.activeElement;
					if((_active.href || "").indexOf("javascript:") === 0){
						_hack = false;
					}
				}
			} catch(err){}
			if (_hack && isDefined(expireDateTime)) {
				try {
					stay_time = Date.parse(new Date()) - load_time;
					var stat = Stat.getTracker("http://statistic.lietou.com/statVisit.do", 1);
					stat.trackPageView();
				} catch( err ){}
				do { } while (Date.parse(new Date()) < expireDateTime);
			}
		}
		function loadHandler() {
			if (!hasLoaded) {
				hasLoaded = true;
				for (var i = 0; i < registeredOnLoadHandlers.length; i++) {
					registeredOnLoadHandlers[i]();
				}
			}
			return true;
		}
		function addReadyListener() {
			if (documentAlias.addEventListener) {
				addEventListener(documentAlias, "DOMContentLoaded", function () {
					documentAlias.removeEventListener("DOMContentLoaded", arguments.callee, false);
					loadHandler();
				});
			} else {
				if (documentAlias.attachEvent) {
					documentAlias.attachEvent("onreadystatechange", function () {
						if (documentAlias.readyState === "complete") {
							documentAlias.detachEvent("onreadystatechange", arguments.callee);
							loadHandler();
						}
					});
					if (documentAlias.documentElement.doScroll && windowAlias == windowAlias.top) {
						(function () {
							if (hasLoaded) {
								return;
							}
							try {
								documentAlias.documentElement.doScroll("left");
							}
							catch (error) {
								setTimeout(arguments.callee, 0);
								return;
							}
							loadHandler();
						}());
					}
				}
			}
			addEventListener(windowAlias, "load", loadHandler, false);
		}
		function Tracker(trackerUrl, siteId) {
			var userId,userKind,configTrackerUrl = trackerUrl || "", configTrackerSiteId = siteId || "", configCustomUrl, configTrackerPause = 200, configCustomData, browserHasCookies = "0", pageReferrer, escapeWrapper = windowAlias.encodeURIComponent || escape, unescapeWrapper = windowAlias.decodeURIComponent || unescape, stringify = function (value) {
				var escapable = new RegExp("[\\\"\x00-\x1f\x7f-\x9f\xad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]", "g"), meta = {"\b":"\\b", "\t":"\\t", "\n":"\\n", "\f":"\\f", "\r":"\\r", "\"":"\\\"", "\\":"\\\\"};
				function quote(string) {
					escapable.lastIndex = 0;
					return escapable.test(string) ? "\"" + string.replace(escapable, function (a) {
						var c = meta[a];
						return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
					}) + "\"" : "\"" + string + "\"";
				}
				function f(n) {
					return n < 10 ? "0" + n : n;
				}
				function str(key, holder) {
					var i, k, v, partial, value = holder[key];
					if (value === null) {
						return "null";
					}
					if (value && typeof value === "object" && typeof value.toJSON === "function") {
						value = value.toJSON(key);
					}
					switch (typeof value) {
					  case "string":
						return quote(value);
					  case "number":
						return isFinite(value) ? String(value) : "null";
					  case "boolean":
					  case "null":
						return String(value);
					  case "object":
						partial = [];
						if (value instanceof Array) {
							for (i = 0; i < value.length; i++) {
								partial[i] = str(i, value) || "null";
							}
							v = partial.length === 0 ? "[]" : "[" + partial.join(",") + "]";
							return v;
						}
						if (value instanceof Date) {
							return quote(value.getUTCFullYear() + "-" + f(value.getUTCMonth() + 1) + "-" + f(value.getUTCDate()) + "T" + f(value.getUTCHours()) + ":" + f(value.getUTCMinutes()) + ":" + f(value.getUTCSeconds()) + "Z");
						}
						for (k in value) {
							v = str(k, value);
							if (v) {
								partial[partial.length] = quote(k) + ":" + v;
							}
						}
						v = partial.length === 0 ? "{}" : "{" + partial.join(",") + "}";
						return v;
					}
				}
				return str("", {"":value});
			};
			function setCookie(cookieName, value, daysToExpire, path, domain, secure) {
				var expiryDate;
				if (daysToExpire) {
					expiryDate = new Date();
					expiryDate.setTime(expiryDate.getTime() + daysToExpire * 86400000);
				}
				documentAlias.cookie = cookieName + "=" + escapeWrapper(value) + (daysToExpire ? ";expires=" + expiryDate.toGMTString() : "") + ";path=" + (path ? path : "/") + (domain ? ";domain=" + domain : "") + (secure ? ";secure" : "");
			}
			function getCookie(cookieName) {
				var cookiePattern = new RegExp("(^|;)[ ]*" + cookieName + "=([^;]*)"), cookieMatch = cookiePattern.exec(documentAlias.cookie);
				return cookieMatch ? unescapeWrapper(cookieMatch[2]) : 0;
			}
			function getImage(url, delay) {
				var now = new Date(), image = new Image(1, 1);
				expireDateTime = now.getTime() + delay;
				image.onLoad = function () {
				};
				image.src = url;
			}
			function getReferrer() {
				var referrer = "";
				try {
					referrer = top.document.referrer;
				}
				catch (e) {
					if (parent) {
						try {
							referrer = parent.document.referrer;
						}
						catch (e2) {
							referrer = "";
						}
					}
				}
				if (referrer === "") {
					referrer = documentAlias.referrer;
				}
				return referrer;
			}
			function hasCookies() {
				var testCookieName = "_testCookie";
				if (!isDefined(navigatorAlias.cookieEnabled)) {
					setCookie(testCookieName, "1");
					return getCookie(testCookieName) == "1" ? "1" : "0";
				}
				return navigatorAlias.cookieEnabled ? "1" : "0";
			}
			function getRequest() {
				var i, now, request;
				now = new Date();
				request = "site=" + configTrackerSiteId + "&userId="+userId+"&userKind="+userKind+"&url=" + escapeWrapper(isDefined(configCustomUrl) ? configCustomUrl : documentAlias.location.href) + "&resolution=" + screenAlias.width + "x" + screenAlias.height + "&h=" + now.getHours() + "&m=" + now.getMinutes() + "&s=" + now.getSeconds() + "&cookie=" + browserHasCookies + "&ref=" + escapeWrapper(pageReferrer) + "&puuid="+ uuid +"&stay_time="+ stay_time +"&rand=" + Math.random();
				request = configTrackerUrl + "?" + request;
				return request;
			}
			function logPageView() {
				var request = getRequest();
				if (isDefined(configCustomData)) {
					request += "&data=" + escapeWrapper(stringify(configCustomData));
				}
				getImage(request, configTrackerPause);
				return false;
			}
			pageReferrer = getReferrer();
			userId = getCookie("user_id");
			userKind = getCookie("user_kind");
			browserHasCookies = hasCookies();
			return {trackPageView:function () {
				logPageView();
			}};
		}
		addEventListener(windowAlias, "beforeunload", beforeUnloadHandler, false);
		addReadyListener();
		return {getTracker:function (StatUrl, siteId) {
			return new Tracker(StatUrl, siteId);
		}};
	}());
}
(function(){
	try {
		var stat = Stat.getTracker("http://statistic.lietou.com/statVisit.do", 1);
		stat.trackPageView();
	} catch( err ){}
})();