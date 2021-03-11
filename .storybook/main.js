module.exports = ['@storybook/addon-docs/angular/preset']

module.exports = {
  webpackFinal: async (config, { configType }) => {
    config.performance['hints'] = false
    config.performance['maxEntrypointSize'] = 512000
    config.performance['maxAssetSize'] = 512000

    return config
  },
}
