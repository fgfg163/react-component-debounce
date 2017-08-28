;(function (theGlobal, document) {
  const global = theGlobal;
  const awaitRequire = {};
  global.awaitRequire = awaitRequire;
  const moduleList = (() => {
    const idMapToModule = {};
    return {
      show() {
        console.log(JSON.parse(JSON.stringify(idMapToModule)));
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
    getResWithExtensions: async (url, ...param) => {
      // 如果url不是点或斜杠开头的，说明这是一个node_modules中的文件
      if (/^[^/^.]/.test(url) && theOptions.alias[url]) {
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
        throw new Error(`module ${url} not found`);
      }
      // 如果url是点或斜杠开头的，说明这是一个普通文件
      let theExtensions = theOptions.extensions;
      // 如果url没有后缀名，extensions 长度大于1，extensions 第一位是空格，则将空格移到第二位，优化查询优先级
      if (!/\.[^.^/]*$/.test(url) && theExtensions.length > 1 && theExtensions[0] === '') {
        theExtensions = [...theExtensions];
        theExtensions.push(theExtensions[0]);
        theExtensions.shift();
      }
      for (const val of theExtensions) {
        // 按顺序遍历相应后缀
        try {
          return await theOptions.getRes(`${url}${val}`, ...param);
        } catch (err) {
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
    let id = path.join(path.dirname(baseId), relativeId);
    let noTrance = false;
    if (/^[^/^.]/.test(relativeId) && theOptions.alias[relativeId]) {
      if (typeof (theOptions.alias[relativeId]) === 'string') {
        id = relativeId;
        noTrance = true;
      } else {
        return theOptions.alias[relativeId];
      }
    }
    if (moduleList.getById(id)) {
      const theModule = moduleList.getById(id);
      if (theModule.isFirstRequired) {
        theModule.isFirstRequired = false;
        return theModule.statePromise;
      } else if (theModule.loadingState === 'pending') {
        theModule.isFirstRequired = false;
        return theModule.loadingPromise;
      }
      theModule.isFirstRequired = false;
      return theModule.exports;
    }

    const moduleHandle = {
      id,
      path: id,
      state: 'pending', // 模块状态（包括网络请求、编译代码、执行完毕）
      runFinished: () => {
      },
      statePromise: undefined,
      loadingState: 'pending', // 载入状态（包括网络请求和编译代码）
      loadingPromise: undefined,
      isFirstRequired: !!isPreload,
      exports: {},
    };

    const loadingPromise = (async (id) => {
      const theScript = document.createElement('script');
      const [res, xhr] = await theOptions.getResWithExtensions(id);
      moduleHandle.path = path.resolve('/', xhr.responseURL.replace(/[^/]*:\/\/[^/]*\//, ''));
      if (id !== moduleHandle.path && moduleList.getById(moduleHandle.path)) {
        moduleList.setModule(id, moduleList.getById(moduleHandle.path));
        moduleHandle.runFinished(moduleList.getById(moduleHandle.path).exports);
        return moduleList.getById(moduleHandle.path).exports;
      }
      moduleList.setModule(moduleHandle.path, moduleHandle);
      let theCacheFile = '';
      let theCacheTime = 0;
      if (global.localStorage) {
        theCacheFile = global.localStorage.getItem(`await-require/cachefile/${moduleHandle.path}`);
        theCacheTime = global.localStorage.getItem(`await-require/cachetime/${moduleHandle.path}`);
      }
      const serverLastModified = xhr.getResponseHeader('Last-Modified');
      if (serverLastModified && theCacheTime !== String(new Date(serverLastModified).getTime())) {
        if (!noTrance) {
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
            const finalPath = (path.resolve('/', moduleHandle.path, theMapPath));
            newRes = res.replace(/\/\/# sourceMappingURL=[^\n]*/, `//# sourceMappingURL=${finalPath}`);
          }
          theCacheFile = `\n;awaitRequire.define(${JSON.stringify(id)}, async function (require, module, exports, id) {\n${newRes}\n});\n`;
        }
        if (global.localStorage) {
          global.localStorage.setItem(`await-require/cachefile/${moduleHandle.path}`, theCacheFile);
          global.localStorage.setItem(`await-require/cachetime/${moduleHandle.path}`, String(new Date(serverLastModified).getTime()));
        }
      }
      theScript.innerHTML = theCacheFile;
      domBody.appendChild(theScript);
      return moduleHandle.exports;
    })(id);

    loadingPromise.then(() => {
      moduleHandle.loadingState = 'resolve';
    }).catch(() => {
      moduleHandle.loadingState = 'reject';
    });

    moduleHandle.loadingPromise = loadingPromise;

    const statePromise = Promise.all([
      new Promise((resolve) => {
        moduleHandle.runFinished = resolve;
      }),
      loadingPromise,
    ]).then(([res]) => res);

    statePromise.then(() => {
      moduleHandle.state = 'resolve';
    }).catch(() => {
      moduleHandle.state = 'reject';
    });

    moduleHandle.statePromise = statePromise;

    moduleList.setModule(id, moduleHandle);
    moduleHandle.isFirstRequired = false;
    return statePromise;
  });

  awaitRequire.preloadFactory = requireFactory;

  // mod is a async function
  awaitRequire.define = async (id, mod) => {
    if (typeof (mod) !== 'function') {
      throw TypeError('Module must be a async function or return a promise');
    }
    const module = moduleList.getById(id);
    const require = requireFactory(id);
    const moduleHandle = mod(require, module, module.exports, id);
    if (typeof (moduleHandle) !== 'object' || typeof (moduleHandle.then) !== 'function') {
      throw TypeError('Module must return a promise');
    }
    await moduleHandle;

    module.runFinished(module.exports);
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
