var Minduca;
(function (Minduca) {
    //The MIT License(MIT)
    //Copyright(c) 2013 Minduca
    //Permission is hereby granted, free of charge, to any person obtaining a copy
    //of this software and associated documentation files(the "Software"), to deal
    //in the Software without restriction, including without limitation the rights
    //to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
    //copies of the Software, and to permit persons to whom the Software is
    //furnished to do so, subject to the following conditions:
    //The above copyright notice and this permission notice shall be included in all
    //copies or substantial portions of the Software.
    //THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    //IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    //FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
    //AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    //LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    //OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    //SOFTWARE.
    (function (Freebase) {
        var FreebaseService = (function () {
            function FreebaseService(auth) {
                this.auth = auth;
            }
            FreebaseService.prototype.topic = function (mId, invokeOptions, options) {
                if (!mId || mId == '')
                    return;

                var url = this.getTopicUrl(mId, options);
                this.invoke(url, invokeOptions);
            };
            FreebaseService.prototype.search = function (options, invokeOptions) {
                if (!options || !options.query || options.query == '')
                    return;

                var url = this.getSearchUrl(options);
                this.invoke(url, invokeOptions);
            };
            FreebaseService.prototype.image = function (mid, options) {
                return this.getImageUrl(mid, options);
            };

            FreebaseService.prototype.invoke = function (url, options) {
                if (!options || !options.done)
                    return;

                if (options.async == undefined)
                    options.async = false;

                var request = {
                    async: options.async,
                    url: url,
                    dataType: "json"
                };

                $.ajax(request).done(options.done).fail(options.fail).always(options.always);
            };

            FreebaseService.languageIsSupported = function (lang) {
                return FreebaseService.getSupportedLanguages().indexOf(lang) != -1;
            };

            FreebaseService.getSupportedLanguages = function () {
                return ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko'];
            };
            FreebaseService.prototype.getSearchUrl = function (options) {
                return this.buildServiceRequestUrl('search', options);
            };
            FreebaseService.prototype.getTopicUrl = function (mId, options) {
                return this.buildServiceRequestUrl('topic', options, mId);
            };
            FreebaseService.prototype.getImageUrl = function (mid, options) {
                return this.buildServiceRequestUrl('image', options, mid);
            };
            FreebaseService.prototype.getBaseUrl = function () {
                return 'https://www.googleapis.com/freebase/v1/';
            };

            FreebaseService.prototype.buildServiceRequestUrl = function (serviceRelativePath, jsonQS) {
                var pathsVariables = [];
                for (var _i = 0; _i < (arguments.length - 2); _i++) {
                    pathsVariables[_i] = arguments[_i + 2];
                }
                var paths = '';
                var qs = '';

                if (this.auth && (this.auth.key || this.auth.oauth_token)) {
                    if (!jsonQS)
                        jsonQS = this.auth;
else if (!jsonQS.key && this.auth.key)
                        jsonQS.key = this.auth.key;
else if (!jsonQS.oauth_token && this.auth.oauth_token)
                        jsonQS.oauth_token = this.auth.oauth_token;
                }

                if (jsonQS)
                    qs += '?' + $.param(jsonQS);

                if (pathsVariables && pathsVariables.length > 0) {
                    paths = pathsVariables.join("/");
                    if ((paths.match("^/")) != "/")
                        paths = "/" + paths;
                }

                return this.getBaseUrl().concat(serviceRelativePath, paths, qs);
            };
            return FreebaseService;
        })();
        Freebase.FreebaseService = FreebaseService;
    })(Minduca.Freebase || (Minduca.Freebase = {}));
    var Freebase = Minduca.Freebase;
})(Minduca || (Minduca = {}));
//# sourceMappingURL=freebase.js.map
