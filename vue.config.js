module.exports = {
  publicPath: process.env.NODE_ENV == 'dev' ? '' : '/dist',
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
  }
}