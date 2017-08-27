;(function (global, document) {
  const theOptions = {
    alias: {},
    extensions: ['.js'],
    modules: ['node_modules'],
    getRes: (url, options = {}) => (
      new Promise((resolve, reject) => {
        let theUrl = url;
        const { data = {}, header = {} } = options;
        let { method } = options;
        method = method ? method.toUpperCase() : 'GET';

        const xhr = new XMLHttpRequest();
        let formData;

        if (method === 'GET') {
          if (Object.keys(data).length > 0) {
            const search = theUrl.match(/\?([^#]*)/)[1] || '';
            const searchParams = new URLSearchParams(search);
            Object.entries(data).forEach(([key, value]) => {
              searchParams.append(key, value);
            });
            theUrl = `${theUrl}?${searchParams.toString()}`;
          }
        } else {
          formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
          });
        }
        xhr.open(method, theUrl, true);
        if (options.noCache) {
          xhr.setRequestHeader('If-Modified-Since', '0');
          xhr.setRequestHeader('Cache-Control', 'no-cache');
        }
        if (header) {
          Object.entries(header).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }
        xhr.onload = (event) => {
          if (event.currentTarget.status === 200) {
            resolve([event.currentTarget.responseText, event.currentTarget]);
          } else {
            reject([event.currentTarget]);
          }
        }
        xhr.onerror = (event) => {
          reject([event.currentTarget]);
        }
        xhr.send(formData);
      })
    ),
    getResWithExtensions: async (url, ...param) => {
      // 如果url不是点或斜杠开头的，说明这是一个node_modules中的文件
      if (/^[^\/^.]/.test(url) && theOptions.alias[url]) {
        if (typeof (theOptions.alias[url]) === 'string') {
          if (/^~\//.test(theOptions.alias[url])) {
            const aliasUrl = theOptions.alias[url].replace(/^~\//, '');
            try {
              for (const val of theOptions.modules) {
                const newUrl = path.join('/', val, aliasUrl);
                return await theOptions.getRes(newUrl, ...param);
              }
            } catch (err) {
            }
          } else {
            try {
              const newUrl = path.join('/', theOptions.alias[url]);
              return await theOptions.getRes(newUrl, ...param);
            } catch (err) {
            }
          }
        }
        return;
      }
      // 如果url是点或斜杠开头的，说明这是一个普通文件
      let theExtensions = theOptions.extensions;
      // 如果url没有后缀名，extensions 长度大于1，extensions 第一位是空格，则将空格移到第二位，优化查询优先级
      if (!/\.[^.^/]*$/.test(url) && theExtensions.length > 1 && theExtensions[0] === '') {
        [theExtensions[1], theExtensions[0]] = [...theExtensions];
      }
      for (const val of theExtensions) {
        // 按顺序遍历相应后缀
        try {
          return await theOptions.getRes(`${url}${val}`, ...param);
        } catch (err) {
        }

      }
    },
  };

  const Base64 = {
    encode: function (str) {
      return window.btoa(unescape(encodeURIComponent(str)));
    },
    decode: function (str) {
      return decodeURIComponent(escape(window.atob(str)));
    }
  };
  window.Base64 = Base64;

  const domBody = document.getElementsByTagName('body')[0];

  const moduleList = {};

  const path = {
    resolve: (...param) => {
      let thePathArr = [];
      param.filter(e => (typeof (e) === 'string' && !!e))
        .forEach((element) => {
          if (element.slice(0, 1) === '/') {
            thePathArr = [''];
          }
          element.split('/').filter(e => !!e).forEach((ePath) => {
            const lastPath = thePathArr[thePathArr.length - 1];
            if (!lastPath || lastPath === '.' || lastPath === '..') {
              thePathArr.push(ePath);
            } else if (ePath === '.') {
              // nothing
            } else if (ePath === '..') {
              thePathArr.pop();
            } else {
              thePathArr.push(ePath);
            }
          });
        });
      if (param && param[param.length - 1]) {
        if (param[param.length - 1].slice(-1) === '/') {
          thePathArr.push('');
        }
      }
      return thePathArr.join('/');
    },
    join: (...param) => {
      let thePathArr = [];
      if (param[0] && param[0].slice(0, 1) === '/') {
        thePathArr = [''];
      }
      param.filter(e => (typeof (e) === 'string' && !!e))
        .forEach((element) => {
          element.split('/').filter(e => !!e).forEach((ePath) => {
            const lastPath = thePathArr[thePathArr.length - 1];
            if (!lastPath || lastPath === '.' || lastPath === '..') {
              thePathArr.push(ePath);
            } else if (ePath === '.') {
              // nothing
            } else if (ePath === '..') {
              thePathArr.pop();
            } else {
              thePathArr.push(ePath);
            }
          });
        });
      if (param && param[param.length - 1]) {
        if (param[param.length - 1].slice(-1) === '/') {
          thePathArr.push('');
        }
      }
      return thePathArr.join('/');
    },
    dirname: (param = '') => {
      const result = param.match(/^.*\//) || [];
      return result[0] || '/';
    },
  };

  const transCode = ({ filename, code }) => {
    const babelObj = Babel.transform(code, {
      presets: ['stage-2', 'react'],
      plugins: ['transform-es2015-modules-commonjs', 'await-require-plugin'],
      sourceMaps: true,
      filename,
    });
    return babelObj;
  };

  const requireFactory = (baseId) => ((relativeId = '') => {
    let id = path.join(path.dirname(baseId), relativeId);
    let noTrance = false;
    if (/^[^\/^.]/.test(relativeId) && theOptions.alias[relativeId]) {
      if (typeof (theOptions.alias[relativeId]) === 'string') {
        id = relativeId;
        noTrance = true;
      } else {
        return theOptions.alias[relativeId];
      }
    }

    if (moduleList[id]) {
      return moduleList[id].exports;
    }

    let exportsHandle;

    const exportsPromise = Promise.all([
      new Promise((resolve) => {
        exportsHandle = resolve;
      }),
      (async (id) => {
        const theScript = document.createElement('script');
        let theCacheFile = '';
        let theCacheTime = 0;
        if (localStorage) {
          theCacheFile = localStorage.getItem(`await-require/cachefile/${id}`);
          theCacheTime = localStorage.getItem(`await-require/cachetime/${id}`);
        }
        const [res, xhr] = await theOptions.getResWithExtensions(id);
        const serverLastModified = xhr.getResponseHeader('Last-Modified');
        if (serverLastModified && theCacheTime !== String(new Date(serverLastModified).getTime())) {
          if (!noTrance) {
            const babelObj = transCode({
              filename: id,
              code: res
            });

            const theSourceMapStr = '//# sourceMappingURL=data:application/json;charset=utf-8;base64,' + Base64.encode(JSON.stringify(babelObj.map));
            const theCode = babelObj.code;
            theCacheFile = `\n;define('${id}',async function (require, module, exports) {\n${theCode}\n});\n\n${theSourceMapStr}\n`;
          } else {
            theCacheFile = `\n;define('${id}',async function (require, module, exports) {\n${res}\n});\n`;
          }

          if (localStorage) {
            localStorage.setItem(`await-require/cachefile/${id}`, theCacheFile);
            localStorage.setItem(`await-require/cachetime/${id}`, String(new Date(serverLastModified).getTime()));
          }
        }

        theScript.innerHTML = theCacheFile;
        domBody.appendChild(theScript);
      })(id),
    ]).then(([res]) => {
      moduleHandle.state = 'resolve';
      return res;
    }).catch((err) => {
      moduleHandle.state = 'reject';
      setTimeout(() => {
        throw err;
      }, 0);
    });

    const moduleHandle = {
      id,
      state: 'pending',
      exportsHandle,
      exports: {},
    };

    moduleList[id] = moduleHandle;
    return exportsPromise;
  });


  // mod is a async function
  global.define = async (id, mod) => {
    if (typeof (mod) !== 'function') {
      throw TypeError('Module must be a async function or return a promise');
    }
    const module = moduleList[id];
    const require = requireFactory(id);
    const moduleHandle = mod(require, module, module.exports);
    if (typeof (moduleHandle) !== 'object' || typeof (moduleHandle.then) !== 'function') {
      throw TypeError('Module must return a promise');
    }
    await moduleHandle;

    module.exportsHandle(module.exports);
  };

  global.awaitRequire = (options = {}) => {
    const globalPath = global.location.href.replace(global.location.origin, '');

    let entry = [];
    if (typeof (options) === 'string') {
      entry = [options];
    } else if (typeof (options.entry) === 'string') {
      entry = [options.entry];
    } else if (Array.isArray(options.entry)) {
      entry = options.entry;
    }
    let basePath = '';
    if (typeof (options) === 'object') {
      if (typeof ( options.basePath) === 'string') {
        basePath = options.basePath;
      }
      if (typeof ( options.alias) === 'object') {
        theOptions.alias = options.alias;
      }
      if (typeof (options.modules) === 'string') {
        theOptions.modules = [options.modules];
      } else if (Array.isArray(options.modules)) {
        theOptions.modules = options.modules;
      }
      if (typeof (options.extensions) === 'string') {
        theOptions.extensions = [options.extensions];
      } else if (Array.isArray(options.extensions)) {
        theOptions.extensions = [...new Set(['', ...options.extensions])];
      }
    }

    const jsBasePath = path.resolve(globalPath, basePath);
    entry.forEach((id) => {
      requireFactory(path.dirname(jsBasePath))(id);
    });
  };
})(window, window.document);
