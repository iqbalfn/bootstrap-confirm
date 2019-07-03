'use strict'

const year = new Date().getFullYear()

function getBanner(pluginFilename) {
  return `/*!
  * Bootstrap Confirm v0.0.1 (https://iqbalfn.github.io/bootstrap-confirm/)
  * Copyright 2019 Iqbal Fauzi
  * Licensed under MIT (https://github.com/iqbalfn/bootstrap-confirm/blob/master/LICENSE)
  */`
}

module.exports = getBanner
