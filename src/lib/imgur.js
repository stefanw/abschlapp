const API_IMAGE_URL = 'https://api.imgur.com/3/image'
const API_ALBUM_URL = 'https://api.imgur.com/3/album'

const IMGUR_CLIENT_ID = '7291f5f9e42c649'

function setAuth (req) {
  req.setRequestHeader('Authorization', `Client-ID ${IMGUR_CLIENT_ID}`)
}

function uploadImageToAlbum (img, album, updateProgress) {
  return new Promise((resolve, reject) => {
    var form = new FormData()
    form.append('image', img)
    form.append('type', 'file')
    form.append('album', album.deletehash)
    form.append('description', '#abschlapp')

    var request = new XMLHttpRequest()
    request.open('POST', API_IMAGE_URL, true)
    setAuth(request)
    request.onload = function () {
      let data = JSON.parse(request.responseText)
      if (data.success) {
        resolve(data.data)
      } else {
        reject(request.responseText)
      }
    }
    request.onerror = function () {
      reject(request.statusText)
    }
    // if (request.upload &&updateProgress !== undefined) {
    //   request.upload.addEventListener("progress", function (event) {
    //     if (event.lengthComputable) {
    //       var percentComplete = event.loaded / event.total * 100;
    //       console.log(img, percentComplete)
    //       updateProgress(img, percentComplete)
    //     } else {
    //       updateProgress(img)
    //     }
    //   });
    // }

    request.send(form)
  })
}

function uploadImages (images, album, updateProgress) {
  var uploaded = []
  return new Promise((resolve, reject) => {
    return images.reduce(function (sequence, img) {
      return sequence.then(function () {
        return uploadImageToAlbum(img, album, updateProgress).then(function (imgData) {
          uploaded.push(imgData)
        })
      })
    }, Promise.resolve()).then(function () {
      resolve(uploaded)
    })
  })
}

function createAlbum () {
  return new Promise((resolve, reject) => {
    var form = new FormData()
    form.append('title', '#abschlapp #radwegefrei')
    form.append('privacy', 'public')

    var request = new XMLHttpRequest()
    request.open('POST', API_ALBUM_URL, true)
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    setAuth(request)
    request.onload = function () {
      let data = JSON.parse(request.responseText)
      if (data.success) {
        resolve(data.data)
      } else {
        reject(request.responseText)
      }
    }
    request.onerror = () => reject(request.statusText)
    request.send(form)
  })
}

function updateAlbum (album, data) {
  return new Promise((resolve, reject) => {
    var form = new FormData()
    for (var k in data) {
      form.append(k, data[k])
    }

    var request = new XMLHttpRequest()
    request.open('PUT', API_ALBUM_URL + '/' + album.deletehash, true)
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    setAuth(request)
    request.onload = function () {
      let data = JSON.parse(request.responseText)
      resolve(data)
    }
    request.onerror = () => reject(request.statusText)
    request.send(form)
  })
}

var imgur = {
  updateAlbum,
  createAlbum,
  uploadImages
}

export default imgur
