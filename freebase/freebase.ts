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

module Minduca.Freebase {

	export class FreebaseService {

		constructor(private auth?: IFreebaseRequestAuthenticationOptions) { }

		public topic(mId: string, invokeOptions: IFreebaseTopicInvokeOptions, options?: IFreebaseTopicRequestOptions): any {
			if (!mId || mId == '')
				return;

			var url: string = this.getTopicUrl(mId, options);
			this.invoke(url, invokeOptions);
		}
		public search(options: IFreebaseSearchRequestOptions, invokeOptions: IFreebaseSearchInvokeOptions): any {

			if (!options || !options.query || options.query == '')
				return;

			var url: string = this.getSearchUrl(options);
			this.invoke(url, invokeOptions);
		}
		public image(mid: string, options?: IFreebaseImageRequestOptions): string {
			return this.getImageUrl(mid, options);
		}

		private invoke(url: string, options: IFreebaseInvokeOptions): void {
			if (!options || !options.done)
				return;

			if (options.async == undefined)
				options.async = false;

			var request: JQueryAjaxSettings =
				{
					async: options.async,
					url: url,
					dataType: "json",
				};

			$.ajax(request)
				.done(options.done)
				.fail(options.fail)
				.always(options.always);
		}

		public static languageIsSupported(lang: string): boolean { return FreebaseService.getSupportedLanguages().indexOf(lang) != -1; }

		private static getSupportedLanguages(): string[] { return ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko']; } //For more information, visit https://developers.google.com/freebase/v1/search-cookbook#language-constraints
		private getSearchUrl(options: IFreebaseSearchRequestOptions): string { return this.buildServiceRequestUrl('search', options); }
		private getTopicUrl(mId: string, options?: IFreebaseTopicRequestOptions) { return this.buildServiceRequestUrl('topic', options, mId); }
		private getImageUrl(mid: string, options?: IFreebaseImageRequestOptions): string { return this.buildServiceRequestUrl('image', options, mid); }
		private getBaseUrl(): string { return 'https://www.googleapis.com/freebase/v1/'; }

		private buildServiceRequestUrl(serviceRelativePath: string, jsonQS?: IFreebaseRequestOptionsBase, ...pathsVariables: string[]): string {

			var paths: string = '';
			var qs: string = '';

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
				if ((<any>paths.match("^/")) != "/")
					paths = "/" + paths;
			}

			return this.getBaseUrl().concat(serviceRelativePath, paths, qs);
		}
	}

	export interface IFreebaseRequestAuthenticationOptions {
		key?: string;
		oauth_token?: string;
	}

	export interface IFreebaseRequestOptionsBase extends IFreebaseRequestAuthenticationOptions {
		prettyPrint?: boolean;
		quotaUser?: string;
		userIp?: string;
	}

	//For more information, visit https://developers.google.com/freebase/v1/search
	export interface IFreebaseSearchRequestOptions extends IFreebaseRequestOptionsBase {
		as_of_time?: string;
		callback?: string;
		cursor?: number;
		domain?: string;
		encode?: string;
		exact?: boolean;
		filter?: string;
		format?: string;
		indent?: boolean;
		lang?: string;
		limit?: number;
		mql_output?: string;
		prefixed?: boolean;
		query: string;
		scoring?: string;
		spell?: string;
		stemmed?: boolean;
		type?: string;
		with?: string;
		without?: string;
		///
		output?: string; //For more information, visit https://developers.google.com/freebase/v1/search-output
	}

	//For more information, visit https://developers.google.com/freebase/v1/topic-response#references-to-image-objects 
	// and https://google-api-python-client.googlecode.com/hg-history/29446c82e297ecb8ca7dd024698b973dab51437f/docs/dyn/freebase_v1.html
	export interface IFreebaseImageRequestOptions extends IFreebaseRequestOptionsBase {
		maxwidth?: number;
		maxheight?: number;
		fallbackid?: string;
		pad?: boolean;
		mode?: string;
	}

	//For more information, visit https://developers.google.com/freebase/v1/topic
	export interface IFreebaseTopicRequestOptions extends IFreebaseRequestOptionsBase {
		dateline?: string;
		filter?: string;
		lang?: string;
		limit?: number;
		raw?: boolean;
	}

	export interface IFreebaseSearchInvokeOptions extends IFreebaseInvokeOptions {
		done(data: IFreebaseSearchResult, textStatus: string, jqXHR: JQueryXHR): any;
	}
	export interface IFreebaseTopicInvokeOptions extends IFreebaseInvokeOptions {
		done(data: IFreebaseTopicResultProperty, textStatus: string, jqXHR: JQueryXHR): any;
	}

	export interface IFreebaseInvokeOptions {
		done(data: any, textStatus: string, jqXHR: JQueryXHR): any;
		fail? (jqXHR: JQueryXHR, textStatus: string, errorThrow: string, data?: any): any;
		fail? (jqXHR: JQueryXHR, textStatus: string, errorThrow: string, data?: IFreebaseResultError): any;
		always? (jqXHR: JQueryXHR, textStatus: string): any;
		async?: boolean;
	}

	export interface IFreebaseSearchResult {
		status: string;
		correction?: string[];
		result: IFreebaseSearchResultItem[];
		cursor: number;
		cost: number;
		hits: number;
		output?: { [prop: string]: any };
	}

	export interface IFreebaseSearchResultItem {
		mid: string;
		id: string;
		name: string;
		notable: {
			name: string;
			id: string;
		};
		lang: string;
		score: string;
		output?: any;
	}

	export interface IFreebaseResultError {
		error:
		{
			errors: {
				domain: string;
				reason: string;
				message: string;
			}[];
			code: string;
			message: string;
		}
	}

	export interface IFreebaseTopicResultProperty {
		id: string;
		property: { [prop: string]: IFreebaseTopicResultPropertyDescription };
	}
	export interface IFreebaseTopicResultPropertyDescription {
		valuetype: string;
		values: IFreebaseTopicResultPropertyValueBase[];
		count: number;
	}
	export interface IFreebaseTopicResultPropertyValueBase extends IFreebaseTopicResultProperty {
		text: string;
		lang: string;
		creator: string;
		timestamp: string;
	}

	export interface IFreebaseCitation {
		provider: string;
		statement: string;
		uri: string;
	}
}