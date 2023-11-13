const path = require('path')

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json', '.scss'],
    alias: {
      '@': path.resolve('src'),
    }
  }
}
