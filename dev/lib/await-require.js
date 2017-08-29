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
    extensions: ['.js'],
    modules: ['node_modules'],
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
      // 如果url没有后缀名，extensions 长度大于1，extensions 第一位是空格，则将空格移到第二位，优化查询优先级
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
    getResWithExtensions: async (url, ...param) => {
      const urlList = theOptions.checkModuleExistsWithExtensions(url);
      for (const urlItem of urlList) {
        try {
          return await theOptions.getRes(urlItem.url, ...param);
        } catch (err) {
          console.error(err);
        }
      }
      throw new Error(`module ${url} not found`);
    },
  };

  const domBody = document.getElementsByTagName('body')[0];

  const transCode = ({ filename, code }) => {
    const babelObj = global.Babel.transform(code, {
      presets: ['stage-2', 'react'],
      plugins: ['transform-decorators-legacy', 'transform-es2015-modules-commonjs', 'await-require-plugin'],
      sourceMaps: 'inline',
      filename,
    });
    return babelObj;
  };

  const requireFactory = (baseId, isPreload) => ((relativeId = '') => {
    const id = path.join(path.dirname(baseId), relativeId);

    if (moduleList.getById(id)) {
      const theModule = moduleList.getById(id);
      if (theModule.isFirstRun) {
        console.log(id);
        console.log(theModule);
        console.log(moduleList.get());
        theModule.isFirstRun = false;
        theModule.firstRunStartHandle();
        return theModule.statePromise;
      } else if (theModule.loadingState === 'pending') {
        return theModule.loadingPromise;
      }
      return theModule.exports;
    }

    const moduleHandle = {
      id,
      state: 'pending', // 模块状态（包括网络请求、编译代码、执行完毕）
      runFinished: () => {
      },
      statePromise: undefined,
      firstRunStartHandle: undefined,
      loadingState: 'pending', // 载入状态（包括网络请求和编译代码）
      loadingPromise: undefined,
      isFirstRun: true,
      body: null,
      exports: undefined,
    };

    const firstRunPromise = new Promise((resolve) => {
      moduleHandle.firstRunStartHandle = resolve;
    });
    if (!isPreload) {
      moduleHandle.firstRunStartHandle();
    }

    const loadingPromise = (async () => {
      const theScript = document.createElement('script');
      let res;
      let xhr;
      let theSuccessUrl;
      const urlList = theOptions.checkModuleExistsWithExtensions(id);
      for (const urlItem of urlList) {
        try {
          [res, xhr] = await theOptions.getRes(urlItem.url);
          theSuccessUrl = urlItem;
          break;
        } catch (err) {
          console.error(err);
        }
      }
      if (!xhr) {
        throw new Error(`module ${id} not found`);
      }
      if (id !== theSuccessUrl.url && moduleList.getById(theSuccessUrl.url)) {
        const urlModule = moduleList.getById(theSuccessUrl.url);
        moduleList.setModule(id, urlModule);
        if (urlModule.isFirstRun) {
          urlModule.firstRunStartHandle();
          return urlModule.statePromise;
        }
        return urlModule.loadingPromise;
      }
      if (!moduleList.getById(theSuccessUrl.url)) {
        const thisModule = moduleList.getById(id);
        thisModule.id = theSuccessUrl.url;
        moduleList.setModule(theSuccessUrl.url, thisModule);
      }
      let theCacheFile = '';
      let theCacheTime = 0;
      if (global.localStorage) {
        theCacheFile = global.localStorage.getItem(`await-require/cachefile/${theSuccessUrl.url}`);
        theCacheTime = global.localStorage.getItem(`await-require/cachetime/${theSuccessUrl.url}`);
      }
      const serverLastModified = xhr.getResponseHeader('Last-Modified');
      if (serverLastModified && theCacheTime !== String(new Date(serverLastModified).getTime())) {
        if (!theSuccessUrl.isModules) {
          const babelObj = transCode({
            filename: id,
            code: res,
          });

          const theCode = babelObj.code;
          theCacheFile = `\n;awaitRequire.define(${JSON.stringify(id)}, async function (require, module, exports, id) {\n${theCode}\n});\n`;
        } else {
          const sourceRes = res.match(/\/\/# sourceMappingURL=[^\n]*/);
          let newRes = res;
          if (sourceRes && sourceRes[0]) {
            const theMapPath = sourceRes[0].replace('//# sourceMappingURL=', '');
            const finalPath = (path.resolve('/', theSuccessUrl.url, theMapPath));
            newRes = res.replace(/\/\/# sourceMappingURL=[^\n]*/, `//# sourceMappingURL=${finalPath}`);
          }
          theCacheFile = `\n;awaitRequire.define(${JSON.stringify(id)}, async function (require, module, exports, id) {\n${newRes}\n});\n`;
        }
        // if (global.localStorage) {
        //   global.localStorage.setItem(`await-require/cachefile/${theSuccessUrl.url}`, theCacheFile);
        //   global.localStorage.setItem(`await-require/cachetime/${theSuccessUrl.url}`, String(new Date(serverLastModified).getTime()));
        // }
      }
      theScript.innerHTML = theCacheFile;
      domBody.appendChild(theScript);
      return moduleHandle.exports;
    })();
    moduleHandle.loadingPromise = loadingPromise;

    loadingPromise.then(() => {
      moduleHandle.loadingState = 'resolve';
    }).catch(() => {
      moduleHandle.loadingState = 'reject';
    });
    const statePromise = (async () => {
      await loadingPromise;
      await firstRunPromise;
      const require = requireFactory(id);
      const module = moduleList.getById(id);
      module.exports = {};
      console.log('run ' + id);
      const moduleBodyHandle = module.body(require, module, module.exports, id, path);
      if (typeof (moduleBodyHandle) !== 'object' || typeof (moduleBodyHandle.then) !== 'function') {
        throw TypeError('Module must return a thenable object');
      }
      moduleBodyHandle.then(() => {
        console.log('........');
        console.log(JSON.parse(JSON.stringify(module)));
      });
      return moduleBodyHandle.then(() => module.exports);
    })();
    moduleHandle.statePromise = statePromise;

    statePromise.then(() => {
      moduleHandle.state = 'resolve';
    }).catch(() => {
      moduleHandle.state = 'reject';
    });

    moduleList.setModule(id, moduleHandle);
    return statePromise;
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
    }

    const jsBasePath = path.resolve(globalPath, basePath);
    entry.forEach((id) => {
      requireFactory(path.dirname(jsBasePath))(id);
    });
  };
})(window, window.document);
