Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.commonjs = {
  presets: [
    [
      'env',
      {
        targets: {
          browsers: [
            '>= 5%',
            'last 10 versions',
            'not ie <= 8'
          ]
        }
      }
    ],
    'stage-2',
    'react'
  ],
  plugins: [
    'transform-runtime'
  ]
}
exports.nomodules = {
  presets: [
    [
      'env',
      {
        modules: false,
        targets: {
          browsers: [
            '>= 5%',
            'last 10 versions',
            'not ie <= 8'
          ]
        }
      }
    ],
    'stage-2',
    'react'
  ],
  plugins: [
    'transform-runtime'
  ]
}
