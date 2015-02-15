module.exports = {
  a: function (attr) {
    var keys = Object.keys(attr)
    var len = keys.length

    while (len--) {
      var k = keys[len]
      if (k.toLowerCase() !== 'href') continue

      return {
        type: 'anchor',
        url: attr[k],
      }
    }
  },
  img: function (attr) {
    var keys = Object.keys(attr)
    var len = keys.length

    while (len--) {
      var k = keys[len]
      if (k.toLowerCase() !== 'arc') continue

      return {
        type: 'image',
        url: attr[k]
      }
    }
  },
  link: function (attr) {
    var keys = Object.keys(attr)
    var len = keys.length

    var hrefK, relK

    while (len--) {
      var k = keys[len]
      var kl = k.toLowerCase()

      if (kl === 'href') hrefK = hrefK || k
      else if (kl === 'rel') relK = relK || k
      else continue

      if (hrefK && relK) break
    }

    if (hrefK && attr[relK] === 'stylesheet') {
      return {
        type: 'style',
        url: attr[hrefK]
      }
    }
  },
  script: function (attr) {
    var keys = Object.keys(attr)
    var len = keys.length

    var srcK, typeK

    while (len--) {
      var k = keys[len]
      var kl = k.toLowerCase()

      if (kl === 'src') srcK = srcK || k
      else if (kl === 'type') typeK = typeK || k
      else continue

      if (srcK && typeK) break
    }

    if (srcK) {
      var type = 'text/javascript'
      if (typeK != null) type = attr[typeK].toLowerCase()

      if (type === 'text/javascript') {
        return {
          type: 'script',
          url: attr[srcK]
        }
      }
    }
  }
}