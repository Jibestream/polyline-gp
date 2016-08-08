// Utils
const csvtojson = require('csvtojson')
const _ = require('lodash')
const fs = require('fs-extra')

// Parsers
const polyline = require('polyline')
const toKml = require('tokml')

const pgp = {
  run({ inputLoc, outputLoc, groupCol, polylineCol }) {
    // Read csv file
    const converter = new csvtojson.Converter({})
    converter.fromFile(inputLoc, (err, result) => {
      if(err) throw err
      // Group data
      const groups = _.groupBy(result, groupCol)
      // Make fileset for each group
      for (let groupName in groups) {
        if (groups.hasOwnProperty(groupName)) {
          const group = groups[groupName]
          const output = pgp.makeOutput(group, polylineCol)
          const fData = pgp.getFileLocationForGroup(outputLoc, groupName)
          fs.ensureDir(fData.folder, () => {
            pgp.saveOutput(fData.file, output)
          })
        }
      }
    })
  },

  getFileLocationForGroup(outputLoc, groupName){
    const folder = `${outputLoc}/${groupName}`
    const file = `${folder}/${groupName}`
    return { folder, file }
  },

  makeOutput(group, polylineCol) {
    // Make gis output
    let geojson = pgp.generateGeoJSON(group, polylineCol)
    const kml = pgp.generateKML(geojson)
    geojson = JSON.stringify(geojson)
    return { geojson, kml /*, wkt*/ }
  },

  saveOutput(fileNoExt, data) {
    // Save gis output as seperate files using key as extension
    const keys = Object.keys(data)
    keys.forEach((ext) => {
      fs.writeFile(`${fileNoExt}.${ext}`, data[ext], {encoding: 'utf8'})
    })
  },

  generateKML(geojson){
    return toKml(geojson)
  },

  generateGeoJSON(property, polylineCol) {
    return {
      type: 'FeatureCollection',
      features: property.map((data) => {
        const points = polyline.decode(data[polylineCol] || '')
        const flippedPoints = points.map(p => [p[1], p[0]])
        if (points.length) flippedPoints[flippedPoints.length] = flippedPoints[0]
        return pgp.makeGeoJsonFeture('Polygon', [flippedPoints], data)
      })
    }
  },

  makeGeoJsonFeture(type, coordinates, data){
    return {
      type: 'Feature',
      geometry: { type, coordinates },
      properties: data
    }
  },

}

module.exports = pgp