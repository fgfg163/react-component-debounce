;(function (theGlobal, document) {
  const global = theGlobal;
  const awaitRequire = {};
  global.awaitRequire = awaitRequire;
  const moduleList = (() => {
    const idMapToModule = {};
    return {
      get() {
        return JSON.parse(JSON.stringify(idMapToModule));
      },
      getById(id) {
        if (idMapToModule[id]) {
          return idMapToModule[id];
        }
        return undefined;
      },
      setModule(id, module) {
        idMapToModule[id] = module;
      },
    };
  })();

  const path = {
    resolve(...param) {
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
    join(...param) {
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
    dirname(param = '') {
      const result = param.match(/^.*\//) || [];
      return result[0] || '/';
    },
  };

  const theOptions = {
    alias: {},
    extensions: ['', '/index.js', '.js'],
    modules: ['node_modules'],
    cacheTimeout: 86400 * 1000,
    noCache: true,
    getRes: (url, options = {}) => (
      new Promise((resolve, reject) => {
        let theUrl = url;
        const { data = {}, header = {} } = options;
        let { method } = options;
        method = method ? method.toUpperCase() : 'GET';

        const xhr = new global.XMLHttpRequest();
        let formData;

        if (method === 'GET') {
          if (Object.keys(data).length > 0) {
            const search = theUrl.match(/\?([^#]*)/)[1] || '';
            const searchParams = new global.URLSearchParams(search);
            Object.entries(data).forEach(([key, value]) => {
              searchParams.append(key, value);
            });
            theUrl = `${theUrl}?${searchParams.toString()}`;
          }
        } else {
          formData = new global.FormData();
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
    checkModuleExistsWithExtensions(url) {
      let resultUrlList = [{
        url,
        isModules: false,
      }];
      if (/^[^/^.]/.test(url)) {
        if (theOptions.alias[url]) {
          resultUrlList = [{
            url: theOptions.alias[url],
            isModules: false,
          }];
        }
      }
      const resultUrlList2 = [];
      resultUrlList.forEach((urlItem) => {
        if (/^[^/^.]/.test(urlItem.url)) {
          theOptions.modules.forEach((val) => {
            resultUrlList2.push({
              url: path.join('/', val, urlItem.url),
              isModules: true,
            });
          });
        } else {
          resultUrlList2.push({
            url,
            isModules: false,
          });
        }
      });

      let theExtensions = theOptions.extensions;
      // 如果url没有后缀名，extensions 长度大于1，extensions 第一位是空格，则将空格移到最后一位，优化查询优先级
      if (!/\.[^.^/]*$/.test(url) && theExtensions.length > 1 && theExtensions[0] === '') {
        theExtensions = [...theExtensions];
        theExtensions.push(theExtensions[0]);
        theExtensions.shift();
      }

      const resultUrlList3 = [];
      resultUrlList2.forEach((urlItem) => {
        theExtensions.forEach((val) => {
          resultUrlList3.push({
            url: `${urlItem.url}${val}`,
            isModules: urlItem.isModules,
          });
        });
      });
      return resultUrlList3;
    },
  };

  const domBody = document.getElementsByTagName('body')[0];
  const domHead = document.getElementsByTagName('head')[0];

  const transCode = ({ filename, code }) => {
    const babelObj = global.Babel.transform(code, {
      presets: ['stage-2', 'react'],
      plugins: ['transform-decorators-legacy', 'transform-es2015-modules-commonjs', 'await-require-plugin'],
      sourceMaps: true,
      filename,
    });
    return babelObj;
  };

  const requireFactory = (baseId, isPreload) => ((relativeId = '') => {
    let theId = path.resolve(path.dirname(baseId), relativeId);
    if (/^[^/^.]/.test(relativeId)) {
      theId = relativeId;
      if (theOptions.alias[relativeId]) {
        theId = theOptions.alias[relativeId];
      }
    }
    const id = theId;

    // 如果模块已经被载入并开始执行，则直接返回执行结果
    if (moduleList.getById(id)) {
      const theModule = moduleList.getById(id);
      if (!theModule.isFirstRequire) {
        return theModule.exports;
      }
    }

    if (!moduleList.getById(id)) {
      moduleList.setModule(id, {
        id,
        state: '', // 模块状态，state=='':尚未开始，state=='pending':开始加载并执行代码（包括网络请求、编译代码、执行完毕）
        statePromise: null,
        loadingState: '', // 载入状态 loadingState=='':尚未开始，loadingState=='pending':开始加载（包括网络请求和编译代码）
        isFirstRequire: true,
        body: null,
        type: 'script', // 载入方式，script 表示内容将当作js从script标签注入。style 表示内容当作css从style插入
        exports: undefined,
      });
    }

    if (!moduleList.getById(id).statePromise) {
      moduleList.getById(id).loadingState = 'pending';
      moduleList.getById(id).statePromise = (async () => {
        try {
          let res;
          let xhr;
          let theSuccessUrl;
          const urlList = theOptions.checkModuleExistsWithExtensions(id);
          for (const urlItem of urlList) {
            try {
              [res, xhr] = await theOptions
                .getRes(urlItem.url, { noCache: theOptions.noCache });
              theSuccessUrl = urlItem;
              break;
            } catch (err) {
              console.error(err);
            }
          }

          if (!xhr) {
            throw new TypeError(`module ${id} not found`);
          }

          if (id !== theSuccessUrl.url && moduleList.getById(theSuccessUrl.url)) {
            const urlModule = moduleList.getById(theSuccessUrl.url);
            moduleList.setModule(id, urlModule);
            return urlModule.exports;
          }
          if (!moduleList.getById(theSuccessUrl.url)) {
            const thisModule = moduleList.getById(id);
            thisModule.id = theSuccessUrl.url;
            moduleList.setModule(theSuccessUrl.url, thisModule);
          }

          if (moduleList.getById(id).id.match(/\.jsx?$/)) {
            moduleList.getById(id).type = 'script';
          } else if (moduleList.getById(id).id.match(/\.css$/)) {
            moduleList.getById(id).type = 'style';
          }

          let theCacheFile = '';
          let theCacheTime = 0;
          let theExpires = 0;
          if (global.localStorage && !theOptions.noCache) {
            theCacheFile = global.localStorage.getItem(`await-require/cachefile/${theSuccessUrl.url}`);
            theCacheTime = global.localStorage.getItem(`await-require/cachetime/${theSuccessUrl.url}`);
            theExpires = global.localStorage.getItem(`await-require/expires/${theSuccessUrl.url}`);
          }
          const serverLastModified = xhr.getResponseHeader('Last-Modified');
          if (!serverLastModified || theCacheTime !== String(new Date(serverLastModified).getTime()) || theExpires < Date.now()) {
            if (moduleList.getById(id).type === 'script') {
              if (!theSuccessUrl.isModules) {
                const babelObj = transCode({
                  filename: moduleList.getById(id).id,
                  code: res,
                });

                const theCode = babelObj.code;
                const theMap = babelObj.map;
                theMap.mappings = `;${theMap.mappings}`;
                theCacheFile = `;awaitRequire.define(${JSON.stringify(moduleList.getById(id).id)}, async function (require, module, exports, id) {\n${theCode}\n});\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,${window.Base64.encode(JSON.stringify(theMap))}\n`;
              } else {
                const sourceRes = res.match(/\/\/# sourceMappingURL=[^\n]*/);
                let newRes = res;
                if (sourceRes && sourceRes[0]) {
                  if (!sourceRes[0].match('data:application/json;charset=utf-8;base64')) {
                    const theMapPath = sourceRes[0].replace('//# sourceMappingURL=', '');
                    const finalPath = (path.resolve('/', path.dirname(theSuccessUrl.url), theMapPath));
                    let mapRes;
                    try {
                      [mapRes] = await theOptions.getRes(finalPath);
                      const theMap = JSON.parse(mapRes);
                      theMap.mappings = `;${theMap.mappings}`;
                      newRes = res.replace(/\/\/# sourceMappingURL=[^\n]*/, `//# sourceMappingURL=data:application/json;charset=utf-8;base64${window.Base64.encode(JSON.stringify(theMap))}`);
                    } catch (err) {
                      newRes = res.replace(/\/\/# sourceMappingURL=[^\n]*/, `//# sourceMappingURL=${finalPath}`);
                    }
                  } else {
                    try {
                      const theMap = JSON.parse(window.Base64.decode(sourceRes[0].replace('//# sourceMappingURL=', '')));
                      theMap.mappings = `;${theMap.mappings}`;
                      newRes = res.replace(/\/\/# sourceMappingURL=[^\n]*/, `//# sourceMappingURL=data:application/json;charset=utf-8;base64${window.Base64.encode(JSON.stringify(theMap))}`);
                    } catch (err) {
                    }
                  }
                }
                theCacheFile = `;awaitRequire.define(${JSON.stringify(moduleList.getById(id).id)}, async function (require, module, exports, id, process) {\n${newRes}\n});\n`;
              }
            } else if (moduleList.getById(id).type === 'style') {
              theCacheFile = res;
            }
            if (global.localStorage && !theOptions.noCache) {
              global.localStorage.setItem(`await-require/cachefile/${theSuccessUrl.url}`, theCacheFile);
              global.localStorage.setItem(`await-require/cachetime/${theSuccessUrl.url}`, String(new Date(serverLastModified).getTime()));
              global.localStorage.setItem(`await-require/expires/${theSuccessUrl.url}`, Date.now() + theOptions.cacheTimeout);
            }
          }
          if (moduleList.getById(id).id.match(/\.jsx?$/)) {
            const theScript = document.createElement('script');
            theScript.innerHTML = theCacheFile;
            if (moduleList.getById(id).id === '/node_modules/antd/es/index.js') {
              console.log(theCacheFile);
              console.log(theScript);
            }
            domBody.appendChild(theScript);
            if (moduleList.getById(id).id === '/node_modules/antd/es/index.js') {
              console.log(123123123)
            }
          } else if (moduleList.getById(id).id.match(/\.css$/)) {
            moduleList.getById(id).body = res;
          }
        } catch (err) {
          moduleList.getById(id).state = 'reject';
          throw err;
        }

        return moduleList.getById(id).exports;
      })();
    }

    if (!isPreload && moduleList.getById(id).isFirstRequire) {
      const oldStatePromise = moduleList.getById(id).statePromise;
      moduleList.getById(id).statePromise = (async () => {
        await oldStatePromise;
        if (moduleList.getById(id).type === 'style') {
          const theStyle = document.createElement('style');
          theStyle.setAttribute('type', 'text/css');
          theStyle.setAttribute('data-id', moduleList.getById(id).id);
          theStyle.setAttribute('data-parent-id', moduleList.getById(baseId).id);
          theStyle.innerHTML = moduleList.getById(id).body;
          const brother = (Array.from(global.document.querySelectorAll('head style') || [])).filter(item => item.getAttribute('data-id'));
          let beforeBrotherIndex = -1;
          let afterBrother = brother[0];
          brother.forEach((item, index) => {
            if (item.getAttribute('data-parent-id') === moduleList.getById(baseId).id) {
              beforeBrotherIndex = index;
            }
          });
          if (beforeBrotherIndex > -1) {
            afterBrother = brother[beforeBrotherIndex + 1] || afterBrother;
          }
          if (afterBrother) {
            domHead.insertBefore(theStyle, afterBrother);
          } else {
            domHead.appendChild(theStyle);
          }
          return moduleList.getById(id).body;
        }

        if (!moduleList.getById(id).isFirstRequire) {
          return moduleList.getById(id).exports;
        }
        moduleList.getById(id).isFirstRequire = false;
        try {
          const require = requireFactory(id);
          const module = moduleList.getById(id);
          module.exports = {};
          const process = { env: { NODE_ENV: 'development' } };
          const moduleBodyHandle = module.body(require, module, module.exports, id, process);
          moduleBodyHandle.catch((err) => {
            console.error(moduleList.getById(id).id);
            console.error(moduleList.getById(id));
            console.error(err);
          });
          if (typeof (moduleBodyHandle) !== 'object' || typeof (moduleBodyHandle.then) !== 'function') {
            throw TypeError('Module must return a thenable object');
          }

          moduleList.getById(id).state = 'resolve';
          return moduleBodyHandle.then(() => module.exports);
        } catch (err) {
          moduleList.getById(id).state = 'reject';
          throw err;
        }
      })();
      return moduleList.getById(id).statePromise;
    }

    return moduleList.getById(id).export;
  });

  awaitRequire.preloadFactory = requireFactory;

  // mod is a async function
  awaitRequire.define = async (id, mod) => {
    if (typeof (mod) !== 'function') {
      throw TypeError('Module must be a async function or return a promise');
    }

    const module = moduleList.getById(id);
    module.body = mod;
  };

  awaitRequire.init = (options = {}) => {
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
      if (typeof (options.basePath) === 'string') {
        basePath = options.basePath;
      }
      if (typeof (options.alias) === 'object') {
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
      if (typeof (options.cacheTimeout) === 'number' || isNaN(window.parseInt(options.cacheTimeout))) {
        theOptions.cacheTimeout = window.parseInt(options.cacheTimeout);
      }
      if (typeof (options.noCache) !== 'undefined') {
        theOptions.noCache = !!options.noCache;
      }
    }

    const jsBasePath = path.resolve(globalPath, basePath);
    entry.forEach((id) => {
      requireFactory(path.dirname(jsBasePath))(id);
    });
  };
})(window, window.document);
