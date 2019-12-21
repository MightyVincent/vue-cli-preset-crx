const fs = require('fs')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CrxAutoReloadPlugin = require('crx-auto-reload-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const JSON5 = require('json5')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: '',
  filenameHashing: false,
  productionSourceMap: false,
  /**
   * https://cli.vuejs.org/zh/config/#pages
   */
  pages: (() => {
    let pages = {}
    let dirty = false
    let pagesPath = path.resolve('src/pages')
    fs.readdirSync(pagesPath).forEach((fileName, _) => {
      let entryPath = path.join(pagesPath, fileName, 'main.ts')
      if (fs.statSync(entryPath).isFile()) {
        pages[fileName] = {
          entry: entryPath,
          template: `public/${fileName}.html`,
          filename: `${fileName}.html`,
        }
        dirty = true
      }
    })

    return dirty ? pages : undefined
  })(),
  configureWebpack: config => {
    let scriptsPath = path.resolve('src/scripts')
    fs.readdirSync(scriptsPath).forEach((fileName, _) => {
      let entryPath = path.join(scriptsPath, fileName, 'index.ts')
      if (fs.statSync(entryPath).isFile()) {
        config.entry[fileName] = entryPath
      }
    })

    // generic
    config.plugins.push(
      new CopyWebpackPlugin([
        {
          context: 'src',
          from: '**/*.json5',
          to: '[path][name].json',
          transform: (content, path) => JSON.stringify(JSON5.parse(content)),
        },
      ]),
    )
    if (isProd) {
      // prod
      config.plugins.push(
        new ZipPlugin({
          path: '.',
          filename: 'dist.zip',
        }),
      )
    } else {
      // dev
      config.plugins.push(
        new CrxAutoReloadPlugin(),
      )
    }
  },
}
