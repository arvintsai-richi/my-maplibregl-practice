import axios from 'axios';

/**
 * 建立 Axios，並返回 HttpService 實例，用於處理 HTTP 請求。
 * @param {import('axios').CreateAxiosDefaults} axiosConfig - Axios 配置對象
 * @returns {HttpService} 返回 HttpService 實例
 */
export function createAxios(axiosConfig) {
  return new HttpService(axiosConfig);
}

/**
 * HttpService 類別，使用 Axios 處理 HTTP 請求。
 */
export default class HttpService {
  /**
   * The axios instance
   * @type {import('axios').AxiosInstance}
   */
  axios;

  /**
   * The JWT instance
   * @type {JWT}
   */
  jwt;

  constructor(axiosConfig) {
    this.axios = this.#initAxios(axiosConfig);
  }

  /**
   * 定義一個請求
   * @param {import('axios').AxiosRequestConfig} axiosRequestConfig - Axios 請求配置
   * @returns {HttpRequest} 返回 Request 實例
   */
  defineRequest(axiosRequestConfig) {
    return new HttpRequest(this.axios, axiosRequestConfig);
  }

  /**
   * 定義一個 GET 請求
   * @param {string} uri - 請求的 URI
   * @param {import('axios').AxiosRequestConfig} axiosRequestConfig - Axios 請求配置
   * @returns {HttpRequest} 返回 Request 實例
   */
  defineGet(uri, axiosRequestConfig = {}) {
    return new HttpRequest(this.axios, {
      ...axiosRequestConfig,
      method: 'get',
      url: uri,
    });
  }

  /**
   * 定義一個 POST 請求
   * @param {string} uri - 請求的 URI
   * @param {import('axios').AxiosRequestConfig} axiosRequestConfig - Axios 請求配置
   * @returns
   */
  definePost(uri, axiosRequestConfig = {}) {
    return new HttpRequest(this.axios, {
      ...axiosRequestConfig,
      method: 'post',
      url: uri,
    });
  }

  /**
   * 設置 JWT（JSON Web Token）相關資訊。 當調用 HttpService.jwt.initToken() 之後會啟用刷新功能。
   * @param {string} refreshUri - The URI for token refreshing.
   * @param {function} refreshStrategy - The strategy function for token refreshing.
   * @returns {JWT} 返回 JWT 實例
   */
  setJWT(refreshUri, refreshStrategy) {
    this.jwt = new JWT(refreshUri, refreshStrategy, this.axios);

    this.axios.interceptors.request.use((config) => {
      if (this.jwt.getToken()) {
        config.headers.Authorization = `Bearer ${this.jwt.getToken()}`;
      }
      return config;
    });

    return this.jwt;
  }

  /**
   * 初始化 axios 實例
   * @param {*} axiosConfig
   * @returns @type {import('axios').AxiosInstance}
   */
  #initAxios(axiosConfig) {
    const axiosInstance = axios.create(axiosConfig);

    // unwrap AxiosResponse to original response
    axiosInstance.interceptors.response.use((response) => {
      if (response.config.responseType === 'blob') {
        return response;
      } else {
        return response.data;
      }
    });

    return axiosInstance;
  }
}

/**
 * HttpRequest 類別，用於發送 Axios 請求並支援中斷操作。
 */
export class HttpRequest {
  #controller = new AbortController();

  /**
   * axios
   * @type {import('axios').AxiosInstance}
   */
  #axios;

  /**
   * axiosConfig
   * @type {import('axios').AxiosRequestConfig}
   */
  config;

  #restfulPattern = '{.+?}';
  #isRestful = false;

  /**
   * @param {import('axios').AxiosInstance} axios - Axios 實例
   * @param {import('axios').AxiosRequestConfig} axiosRequestConfig - Axios 請求配置
   */
  constructor(axios, axiosRequestConfig) {
    this.#axios = axios;
    this.config = axiosRequestConfig;
    this.#isRestful = new RegExp(this.#restfulPattern).test(
      axiosRequestConfig.url,
    );
  }

  /**
   * 發送請求
   * @param {Object} urlParams
   * @param {Object} bodyData
   * @returns
   */
  send = (urlParams, bodyData) => {
    const { signal } = this.#controller;

    if (import.meta.env.DEV) {
      signal.onabort = (event) => {
        console.log(
          `${this.config.url} 已中止，中止原因：${event.target.reason}`,
        );
      };
    }

    let config = {
      signal: this.#controller.signal,
      ...this.config,
      params: urlParams,
      data: bodyData,
    };

    if (this.#isRestful) {
      config = this.#replaceDynamicPath(config);
    }

    return this.#axios.request(config);
  };

  /**
   * blob 檔案下載
   * @param {Object} urlParams
   * @param {Object} bodyData
   * @param {String?} fileName
   */
  download = async (urlParams, bodyData, fileName = null) => {
    const { signal } = this.#controller;

    if (import.meta.env.DEV) {
      signal.onabort = (event) => {
        console.log(
          `${this.config.url} 已中止，中止原因：${event.target.reason}`,
        );
      };
    }

    let config = {
      signal: this.#controller.signal,
      ...this.config,
      params: urlParams,
      data: bodyData,
      responseType: 'blob',
    };

    if (this.#isRestful) {
      config = this.#replaceDynamicPath(config);
    }

    let result = await this.#axios.request(config);

    if (fileName === null) {
      fileName = extractFileName(result.headers['content-disposition']);
    }

    let blob = result.data;
    let link = document.createElement('a');
    link.setAttribute('download', fileName);
    link.href = URL.createObjectURL(blob);
    link.click();

    /**
     * [regex reference](https://stackoverflow.com/questions/23054475/javascript-regex-for-extracting-filename-from-content-disposition-header)
     * @param {String} header [content-disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)
     * @returns
     */
    function extractFileName(header) {
      const regex =
        /(filename[^;\n]*)=\s*(UTF-\d['"]*)?((['"]).*?[.]$\2|[^;\n]*)?/gi;

      let contentDispositionValue = {
        fileName: null,
        fileNameStar: null,
      };

      let m;
      while ((m = regex.exec(header)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        if (m[1] === 'filename*') {
          contentDispositionValue.fileNameStar = decodeURI(m[3]);
          break;
        } else if (m[1] === 'filename') {
          contentDispositionValue.fileName = m[3];
        }
      }

      return (
        contentDispositionValue.fileNameStar || contentDispositionValue.fileName
      );
    }
  };

  /**
   * 中斷請求
   */
  abort = (reason = '手動中止。') => {
    this.#controller.abort(reason);
    this.#controller = new AbortController();
  };

  /**
   * 將 urlParams 中的參數轉移至 dynamic path。
   *
   * example: api/post/{id} --> api/post/1
   *
   * @param {import('axios').AxiosRequestConfig} requestConfig
   * @returns {import('axios').AxiosRequestConfig}
   */
  #replaceDynamicPath(requestConfig) {
    const regex = new RegExp(this.#restfulPattern, 'g');
    let { url, params } = requestConfig;

    let m;
    while ((m = regex.exec(requestConfig.url)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match) => {
        // trim '{' and '}'
        const key = match.replace(new RegExp('[{}]', 'g'), '');

        if (import.meta.env.DEV && params[key] == undefined) {
          console.warn(`value of '${key}' is undefined`);
        }

        url = url.replace(match, params[key]);
        delete params[key];
      });
    }

    requestConfig.url = url;
    requestConfig.params = params;

    return requestConfig;
  }
}

export class JWT {
  #axios;
  #refreshHandler;
  #refreshStrategy;
  #_401Interceptor;
  #token;

  constructor(refreshUri, refreshStrategy, axios) {
    this.#setRefreshHandler(refreshUri, refreshStrategy);
    this.#axios = axios;
  }

  /**
   * 由 login API 登入取得 JWT 後，初始化 token 刷新功能。
   * @param {string} accessToken - The access token to set.
   * @returns {Promise}
   */
  async initToken(accessToken) {
    this.#setToken(accessToken);

    try {
      // 注入 token 後馬上 refresh，並啟用自動刷新(this.#refreshStrategy)
      await this.#refreshHandler.refresh();
      this.#refreshHandler = this.#refreshStrategy(this.#refreshHandler);
    } catch (error) {
      throw error;
    } finally {
      // 初始化 token 後，加入 401 interceptor。
      if (!this.#_401Interceptor) {
        this.#_401Interceptor = this.#axios.interceptors.response.use(
          (response) => response,
          this.#intercept401,
        );
      }
    }
  }

  #expiredToken = null;
  #intercept401 = async (error) => {
    const {
      response: { status, headers },
      config: {
        headers: { Authorization },
      },
    } = error;

    if (
      status === 401 && // token expired 會是 401
      headers['www-authenticate'].includes('JWT expired') && // 只攔截 JWT expired
      Authorization !== this.#expiredToken // 同一個 Authorization 只觸發一次 on401Error
    ) {
      this.#expiredToken = Authorization;
      await this.on401Error();
    }

    return Promise.reject(error);
  };

  /**
   * JWT 驗證失敗後的後續處理
   * @returns
   */
  on401Error = async () =>
    console.error(
      `JWT unauthorized. ( baseUrl: ${this.#axios.defaults.baseURL} )`,
    );

  /**
   * 嘗試由 localStorage 取得 JWT 後，初始化 token 刷新功能。
   * @param {function} on401Error 指定 JWT 驗證失敗後的後續處理。例如：導頁至 login 頁面。
   * @returns
   */
  async tryInitToken(on401Error) {
    this.on401Error = on401Error || this.on401Error;
    let serverUrl = this.#axios.defaults.baseURL;
    let accessToken = window.localStorage.getItem(`${serverUrl}.jwt`);

    if (accessToken == null) {
      return false;
    }

    try {
      await this.initToken(accessToken);

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 設置 JWT。
   * @param {string} accessToken - The access token to set.
   * @returns {void}
   */
  #setToken(accessToken) {
    this.#token = accessToken;
    let serverUrl = this.#axios.defaults.baseURL;
    window.localStorage.setItem(`${serverUrl}.jwt`, accessToken);
  }

  /**
   * 清除 JWT。
   * @returns {void}
   */
  clearToken() {
    this.#token = null;
    let serverUrl = this.#axios.defaults.baseURL;
    window.localStorage.removeItem(`${serverUrl}.jwt`);
  }

  /**
   * 獲取 JWT。
   * @returns {string|null} - The JWT token or null if it doesn't exist.
   */
  getToken() {
    return this.#token;
  }

  /**
   * 讀取 JWT 的 payload。
   * @param {string} key - The key to read from the JWT payload.
   * @returns {any|null} - The value associated with the key or null if the token is invalid or key doesn't exist.
   */
  readPayload(key) {
    if (!this.#token) return null;

    try {
      const [, payload] = this.#token.split('.');
      if (!payload) throw new Error('Invalid token format');

      const jsonPayload = this.#parsePayloadToJson(payload);

      return typeof key === 'string' && key in jsonPayload
        ? jsonPayload[key]
        : jsonPayload;
    } catch (error) {
      console.error('Error parsing token:', error.message);
      return null;
    }
  }

  /**
   * 解析 JWT 的 payload，解碼並解析 JSON 字串。
   * @param {string} payload - The payload of the JWT.
   * @returns {object} - The parsed payload object.
   * @throws {Error} - If the payload is invalid.
   */
  #parsePayloadToJson(payload) {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const binaryString = atob(base64);
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
    const jsonString = new TextDecoder('utf-8').decode(bytes);
    try {
      return JSON.parse(jsonString);
    } catch (err) {
      throw new Error('Failed to parse JWT payload');
    }
  }

  /**
   * Sets the refresh handler for token refreshing.
   * @param {string} refreshUri - The URI for token refreshing.
   * @param {function} refreshStrategy - The strategy function for token refreshing.
   * @returns {void}
   */
  #setRefreshHandler(refreshUri, refreshStrategy) {
    let refreshPromise = null;

    this.#refreshStrategy = refreshStrategy;
    this.#refreshHandler = {
      JWTInstance: this,
      refresh: async () => {
        refreshPromise = refreshPromise || this.#axios.post(refreshUri, null);

        try {
          const newToken = await refreshPromise;
          this.#setToken(newToken);
        } catch (error) {
          throw error;
        } finally {
          refreshPromise = null;
        }
      },
      axios: this.#axios,
    };
  }

  /**
   * 定期刷新JWT。
   * @param {object} refreshHandler - The refresh handler object.
   * @returns {object} - The updated refresh handler object.
   */
  static refreshOnDelay(refreshHandler) {
    const { refreshID, refresh, JWTInstance } = refreshHandler;
    if (refreshID) {
      clearTimeout(refreshID);
    }

    // Calculate delay in ms for token refresh based on token expiration time
    const expires = JWTInstance.readPayload('exp');
    const delay = expires * 1000 - Date.now();

    refreshHandler.refreshID = setTimeout(async () => {
      try {
        await refresh();
        JWT.refreshOnDelay(refreshHandler);
      } catch (error) {
        console.error('Error refreshing tokens:', error);
      }
    }, delay);

    return refreshHandler;
  }

  /**
   * 於接收401狀態碼時，刷新JWT，並重新發送request。
   * @param {object} refreshHandler - The refresh handler object.
   * @returns {object} - The updated refresh handler object.
   */
  static refreshOn401(refreshHandler) {
    const { refresh, on401Interceptor, axios } = refreshHandler;

    if (on401Interceptor) {
      axios.interceptors.request.eject(on401Interceptor);
    }

    refreshHandler.on401Interceptor = axios.interceptors.response.use(
      (response) => response,
      async function (error) {
        const {
          config,
          response: { status },
        } = error;
        if (status === 401) {
          await refresh();
          return await axios.request(config);
        }
        return Promise.reject(error);
      },
    );

    return refreshHandler;
  }

  /**
   * (尚未實作)於接收200狀態碼時，更新JWT。
   * @param {object} refreshHandler - The refresh handler object.
   * @returns {void}
   */
  static refreshOn200(refreshHandler) {}
}
