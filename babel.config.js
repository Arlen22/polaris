/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  presets: [['@shopify/babel-preset', {typescript: true, react: true}]],
  babelrcRoots: [
    '.',
    // Note: The following projects use rootMode: 'upward' to inherit
    // and merge with this root level config.
    './polaris-tokens',
    './polaris-icons',
    './polaris-react',
  ],
  plugins: [
    [
      'prismjs',
      {
        languages: [
          'jsx',
          'css',
          'markup',
          'yaml',
          'git',
          'shell',
          'txt',
          'md',
        ],
        plugins: ['line-numbers'],
        theme: 'dark',
        css: true,
      },
    ],
  ],
};
