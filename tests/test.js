const assert = require('assert')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const csvtojson = require('csvtojson')
const xml2js = require('xml2js').parseString;
const pgp = 'node index'
const cmd = `${pgp} --input ./tests/demo.csv`

function getDirectories(p) {
  return fs.readdirSync(p).filter(file => fs.statSync(path.join(p, file)).isDirectory())
}

function test(csvObj) {
  
  describe('file & folder output', function() {
    it('should generate valid output folders based on csv group', function() {
      const folders = getDirectories('./tests/output/')
      csvObj.forEach((row) => {
        assert(folders.indexOf(row.Group) > -1)
      })
    })
    
    it('should generate kml/geojson output files based on csv group', function() {
      csvObj.forEach((row) => {
        const files = fs.readdirSync(`./tests/output/${row.Group}`)
        assert(files.indexOf(`${row.Group}.geojson`) > -1)
        assert(files.indexOf(`${row.Group}.kml`) > -1)
      })
    })
  })
  
  describe('file content', function() {
    it('should produce valid geojson file', function() {
      csvObj.forEach((row) => {
        const geojson = JSON.parse(fs.readFileSync(`./tests/output/${row.Group}/${row.Group}.geojson`, 'utf8'))
        
        const feature = geojson.features.find((feature) => {
          return feature.properties.Polyline === row.Polyline
        })
        
        assert(feature, 'feature doesn\' exist')
        assert(feature.geometry.type === 'Polygon', 'geometry is not a Polygon')
        assert(feature.properties.Group === row.Group, 'Group does not match')
        assert(feature.properties.Data === row.Data, 'Data does not match')
        
      })
    })
    
    it('should produce valid kml file', function() {
      csvObj.forEach((row) => {
        const txt = fs.readFileSync(`./tests/output/${row.Group}/${row.Group}.kml`, 'utf8')
        xml2js(txt, (err, res) => {
          const placemark = res.kml.Document[0].Placemark.find((placemark) => {
            const ext = placemark.ExtendedData
            return ext[0].Data.find((d) => {
              return d.value[0] === row.Polyline
            })
          })
          
          const ext = placemark.ExtendedData
          assert(placemark.Polygon, 'KML output is not polygon')
          assert(ext[0].Data.find((d) => {
            return d.value[0] === row.Group
          }), 'Group does not match')
          assert(ext[0].Data.find((d) => {
            return d.value[0] === row.Data
          }), 'Data does not match')
        })
      })
    })
    
  });
  
  
}

describe('polyline-gp', function(){
  it('should read csv and pass all tests', function(done){
    const converter = new csvtojson.Converter({})
    converter.fromFile('./tests/demo.csv', (error, csvObj) => {
      assert(!error)
      exec(cmd, (error, stdout, stderr) => {
        assert(!error)
        test(csvObj)
        done()
      })
    })
  })
})
