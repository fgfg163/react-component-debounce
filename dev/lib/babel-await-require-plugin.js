;(function (global) {
  function awaitRequirePlugin(Babel) {
    const t = Babel.types;
    return {
      visitor: {
        CallExpression (path) {
          if (path.node.callee.name === 'require' && path.parent.type !== 'AwaitExpression') {
            path.replaceWith(t.AwaitExpression(t.CallExpression(
              t.identifier('require'),
              path.node.arguments,
            )));
          }
        }
      }
    }
  }

  Babel.registerPlugin('await-require-plugin', awaitRequirePlugin);
})(window);