/*{**********************************************************************
* (c) 2014 Netflix, Inc. All content herein is protected by             *
* U.S. copyright and other applicable intellectual property laws and    *
* may not be copied without the express permission of Netflix, Inc.,    *
* which reserves all rights. Reuse of any of this content for any       *
* purpose without the permission of Netflix, Inc. is strictly           *
* prohibited.                                                           *
***********************************************************************}*/
/* CODE BODY */

// Since the contents of this file are loaded and injected into a WebView, you cannot just
// set a break point in the IDE.  To get a break point insert a debugger statement like below.
//debugger;

window.nfbridge.signup = {
    getESN: function getESN() {
        return this._esn;
    },

    getESNPrefix: function getESNPrefix() {
        return this._esn.substring(0, 10);       // Take only the part that is not cpu type specific.
    },

    getSoftwareVersion: function getSoftwareVersion() {
        return this._softwareVersion;
    },

    // Returns "phone" or "tablet", based on native application interpretation.  For Win8 use "undefined".
    getDeviceCategory: function getDeviceCategory() {
        return "undefined";
    },

    // Returns "true", if stub or app is pre-loaded on the device else returns a "false" string.
    isNetflixPreloaded: function isNetflixPreloaded() {
        return this._oemData;
    },

    /// <param name="flag">Flag is a string, which could represent one of the three states
    /// "inAppSupported" : Represents in app sign up supported
    /// "notSupported" : Represents no on device sign up.
    /// "browserSupported" : Browser based sign up possible.
    /// Default, if not called, is "inAppSupported".</param>
    supportsSignUp: function supportsSignUp(flag) {
        // If flag == notSupported go directly to sign-in screen.
        this._callHostWithObject('supportsSignUp', { flag: flag });
    },

    /// <summary>
    /// Enables "SignIn" action If already visible, do nothing. Else, clearcookies & reload bootloader url.
    /// Clicking on "SignIn", transitions user to the native signin screen.
    /// </summary>
    showSignIn: function showSignIn() {
        this._callHost('showSignIn');
    },

    /// <summary>
    /// Enables "SingOut" action.  If already visible, do nothing. Else, just show SignOut 
    /// text. "SignIn" action would no longer be visible.  Clicking on "SingOut", clearcookies 
    /// & reloads the boot loader url.
    /// </summary>
    showSignOut: function showSignOut() {
        this._callHost('showSignOut');
    },

    /// <summary>
    /// Causes the application to launch the URL defined by the url argument string
    /// </summary>
    /// <param name="url">The url to launch.</param>
    launchUrl: function launchUrl(url) {
        this._callHostWithObject('launchUrl', { url });
    },

    /// <summary>
    /// Returns the device language setting as a W3C language tag 
    /// (eg. 'en', 'en-US', 'es-ES', 'es-MX'), it could contain the region subtag.
    /// </summary>
    getLanguage: function getLanguage() {
        return this._language;
    },

    /// <summary>
    /// language: The W3C language tag to be set on device. The language tag, could contain the 
    /// region subtag (i.e 'en-GB' or 'en-US'). If the device does not support the language, would 
    /// fall back to the default language(which is currently English).
    /// </summary>
    /// <param name="language"></param>
    setLanguage: function setLanguage(language) {
        this._language = language;
        this._callHostWithObject('setLanguage', { language: language });
    },

    /// <summary>
    /// Indicates SignUp UI is loaded and ready for interaction, at this point splash screen would be removed.
    /// </summary>
    notifyReady: function notifyReady() {
        this._callHost('notifyReady');
    },

    /// <summary>
    /// Method to cause transition from the WebView SignupActivity to Native SignIn Activity.
    /// </summary>
    toSignIn: function toSignIn() {
        this._callHost('toSignIn');
    },

    /// <summary>
    /// Once user is a new member, the WebView UI provides the tokens (User-bound) 
    /// for seamless login to the Browse Activity.  This does indicate that a actual 
    /// signup completed but not that it is time for the application to proceed yet.
    /// </summary>
    /// <param name="tokens">tokens is a json object, containing the NetflixId & SecureNetflixId
    /// tokens = { NetflixId: netflixId, SecureNetflixId: secureNetflixId}</param>
    /// <param name="errHandler">Handler to be called in case of errors. 
    /// (Network connectivity, Invalid Tokens, Invalid SW version)
    /// Currently all errors would be handled by Native application, by displaying 
    /// errors in native dialog.</param>
    passTokens: function passTokens(tokens, errHandler) {
        this._callHostWithJSONString('passTokens', tokens);
    },
    
    /// <summary>
    /// Once user is a new member, the WebView UI provides the tokens (User-bound) for seamless login to the Browse Activity.
    /// </summary>
    /// <param name="tokens">tokens is a json object, containing the NetflixId & SecureNetflixId
    /// tokens = { NetflixId: netflixId, SecureNetflixId: secureNetflixId}</param>
    /// <param name="errHandler">Handler to be called in case of errors. (Network connectivity, Invalid Tokens, Invalid SW version)
    /// Currently all errors would be handled by Native application, by displaying errors in native dialog.
    /// </param>
    loginToApp: function loginToApp(tokens, errHandler) {
        this._callHostWithJSONString('loginToApp', tokens);
    },

    passNonMemberInfo: function passNonMemberInfo(info) {
    	this._callHostWithObject('passNonMemberInfo', info);
    },
    
    _callHost: function (functionName) {
        // console.log('  -- _callHost: ' + functionName);
        window.external.notify(functionName);
    },

    _callHostWithObject: function (functionName, javascriptObject) {
        // console.log('  -- _callHostWithObject: ' + functionName + ' ' + JSON.stringify(javascriptObject));
        window.external.notify(functionName + ":" + JSON.stringify(javascriptObject));
    },
    
    _callHostWithJSONString: function (functionName, stringObject) {
        // console.log('  -- _callHostWithJSONString: ' + functionName);
        window.external.notify(functionName + ":" + stringObject);
    },
    
    _cookiesValue: function _cookiesValue(cookie) {
        var equalsIndex = cookie.indexOf('=');
        return (equalsIndex >= 0) ? cookie.substr(equalsIndex + 1).trim() : "";
    },
    
    _findCookieIds: function _findCookieIds(cookies, netflixIdName, secureNetflixIdName) {
        netflixIdIndex = -1;
        secureNetflixIdIndex = -1;

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var equalsIndex = cookie.indexOf('=');
            var name = ((equalsIndex >= 0) ? cookie.substr(0, equalsIndex) : cookie).trim();
            if (name === netflixIdName) {
                netflixIdIndex = i;
            } else if (name === secureNetflixIdName) {
                secureNetflixIdIndex = i;
            }
        }
        return { netflixIdIndex: netflixIdIndex, secureNetflixIdIndex: secureNetflixIdIndex };
    },

    inlineInitializeSignup: function inlineInitializeSignup(esn, oemData, language, softwareVersion) {
        this._esn = esn;
        this._oemData = oemData;
        this._language = language;
        this._softwareVersion = softwareVersion;
        nfbridge.inserted(this);
    }
    
};
