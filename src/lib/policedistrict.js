import * as topojson from 'topojson-client'

import polizeitopo from './polizeidirektionen.topojson'

const polizeidirektionen = topojson.feature(polizeitopo, polizeitopo.objects.polizeidirektionen)

function inRing (pt, ring) {
  var isInside = false
  for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    let xi = ring[i][0]
    let yi = ring[i][1]
    let xj = ring[j][0]
    let yj = ring[j][1]
    let intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
                    (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)
    if (intersect) isInside = !isInside
  }
  return isInside
}

var getGeoBoundProperties = function (geoLocation, geoBounds) {
  if (geoBounds === null || geoLocation === null) {
    return null
  }
  for (var i = 0; i < geoBounds.features.length; i += 1) {
    if (inRing(geoLocation, geoBounds.features[i].geometry.coordinates[0])) {
      return geoBounds.features[i].properties
    }
  }
}

var precinctInfo = {
  '11': {tel: (a, b) => `(030) 4664-${a}${b}701`},
  '21': {tel: (a, b) => `(030) 4664-${a}${b}700`},
  '31': {tel: (a, b) => `(030) 4664-${a}${b}700`},
  '41': {tel: (a, b) => `(030) 4664-${a}${b}701`},
  '51': {tel: (a, b) => `(030) 4664-${a}${b}700`},
  '61': {tel: (a, b) => `(030) 4664-${a}${b}700`}
}

export default function (position) {
  let policeDistrict = getGeoBoundProperties(position, polizeidirektionen)
  if (policeDistrict === undefined) {
    return policeDistrict
  }
  let precinct = '' + policeDistrict.spatial_name
  policeDistrict.tel = precinctInfo[precinct[0] + '1'].tel(precinct[0], precinct.slice(0, 2))

  return policeDistrict
}
