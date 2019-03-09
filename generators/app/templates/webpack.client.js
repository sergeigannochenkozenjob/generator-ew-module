<% if (useClientSide) { %>const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
  env = env || {};
  const development =
    argv.mode === 'development' || env.NODE_ENV === 'development';

  return {
    entry: path.join(__dirname, 'src/index.js'),
    mode: development ? 'development' : 'production',
    output: {
      filename: 'client.js',
      path: path.join(__dirname, 'build'),
      libraryTarget: 'amd',
    },
    resolve: {
      extensions: ['.js',<% if (supportReact) { %> '.jsx',<% } %>],
      alias: {
        './build/server.js': './build/client.js',
      },
      symlinks: false,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [<% if (supportReact) { %>
                  '@babel/react',<% } %>
                  ['@babel/env', {
                    targets: {
                      browsers: ['last 2 versions'],
                    }
                  }]
                ],
                plugins: ['@babel/plugin-proposal-object-rest-spread'],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        // varname: path.join(__dirname, `src/lib/module.js`),
      }),
      new webpack.DefinePlugin({
        __DEV__: development,
        __TEST__: false,
      }),
    ],
  };
};
<% } %>
