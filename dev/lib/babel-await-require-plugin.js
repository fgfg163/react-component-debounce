;(function (global) {
  function awaitRequirePlugin(Babel) {
    const t = Babel.types;
    return {
      visitor: {
        CallExpression(path, root) {
          if (path.node.callee.name === 'require' && path.parent.type !== 'AwaitExpression') {
            // preload modal
            if (global && global.awaitRequire && global.awaitRequire.preloadFactory) {
              const theFirstArg = (path.node.arguments || [])[0] || {};
              if (theFirstArg.type === 'StringLiteral') {
                try {
                  global.awaitRequire.preloadFactory(root.file.opts.filename, true)(theFirstArg.value);
                } catch (err) {
                }
              }
            }

            path.replaceWith(t.AwaitExpression(t.CallExpression(
              t.identifier('require'),
              path.node.arguments,
            )));
          }
        },
      },
    };
  }

  global.Babel.registerPlugin('await-require-plugin', awaitRequirePlugin);
})(window);
