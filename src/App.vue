<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-dark bg-dark">
        <a class="navbar-brand" href="#/">AbschlApp</a>
        <button class="mr-sm-2 btn btn-danger" @click="resetData($event)">Reset</button>
      </nav>

    </header>
    <main class="container-fluid">
      <nav class="menu">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'call' }" active-class="active">
              Anrufen
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'documentation' }" active-class="active">
              Dokumentation
            </router-link>
          </li>
          <li class="nav-item" v-if="called">
            <router-link class="nav-link" :to="{ name: 'result' }" active-class="active">
              Ergebnis
            </router-link>
          </li>
        </ul>
      </nav>
      <div>
        <router-view :position="position" :address="address" :policedistrict="policedistrict" :called="called" :album="album" :notes.sync="notes" :files="files" :imgur="imgur" v-on:callplaced="callPlaced" v-on:filesadded="filesAdded" v-on:albumcreated="albumCreated" v-on:filesuploaded="filesUploaded" v-on:commitinfo="updateAlbum"></router-view>
      </div>
    </main>
    <footer class="container-fluid footer bg-dark">
        <p>
          Die Inhalte stammen von <a href="http://www.autofreies-kreuzberg.de/radwege-frei.html">Autofreies Kreuzberg</a>.
        </p>
        <p>
          <a href="https://stefanwehrmeyer.com/#impressum">
            Impressum
          </a>
        </p>
    </footer>
  </div>
</template>

<script>

import getPoliceDistrict from './lib/policedistrict'
import imgur from './lib/imgur'

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function getAddress (pos) {
  return new Promise((resolve, reject) => {
    let url = `https://nominatim.openstreetmap.org/reverse?lat=${pos[1]}&lon=${pos[0]}&format=json&addressdetails=1&accept-language=de-DE,de`

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = function () {
      let data = JSON.parse(xhr.responseText)
      let addr = data.address
      let display = `${addr.road} ${addr.house_number}, in ${addr.city_district} (${addr.postcode} ${addr.city || addr.state})`
      resolve(display)
    }
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send()
  })
}

const getDefaultData = function () {
  return {
    uid: uuidv4(),
    files: [],
    imgur: [],
    notes: `Kennzeichen: 
Weitere Infos: 
Details zum Ergebnis: `,
    position: null,
    policedistrict: null,
    address: '',
    called: false,
    album: null,
    creatingAlbum: false
  }
}

export default {
  name: 'app',
  data: () => getDefaultData(),
  created: function () {
    navigator.geolocation.watchPosition(this.getUserLocation)
  },
  methods: {
    getUserLocation: function (position) {
      var self = this
      console.log(position.coords)
      this.position = [position.coords.longitude, position.coords.latitude]
      this.policedistrict = getPoliceDistrict(this.position)
      getAddress(this.position).then(function (addr) {
        self.address = addr
      })
    },
    callPlaced: function () {
      this.called = true
    },
    albumCreated: function (album) {
      this.album = album
    },
    filesAdded: function (files) {
      this.files = [...this.files, ...files]
    },
    filesUploaded: function (imgData) {
      this.imgur = [...this.imgur, ...imgData]
    },
    updateAlbum: function () {
      var self = this
      if (!this.album) {
        if (this.creatingAlbum) {
          return
        }
        this.creatingAlbum = true
        return imgur.createAlbum().then(function (album) {
          self.album = album
          self.updateAlbum()
        })
      }
      imgur.updateAlbum(this.album, {
        title: `#abschlapp @ ${this.address}`,
        description: `#abschlapp
${this.notes}`
      })
    },
    resetData: function (e) {
      e.preventDefault()
      this.$router.replace('/')
      Object.assign(this.$data, getDefaultData())
    }
  }
}
</script>

<style>

@import "~bootstrap/dist/css/bootstrap.min.css";

body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.menu {
  margin: 20px 0;
}

header {
  background-color: #35495E;
  color: #ffffff;
}

.footer {
  margin: 40px 0 0;
  padding: 15px;
  font-size: 12px;
  background-color: #35495E;
  color: #ffffff;
  text-align: right;
}

.footer a {
  color: #fff;
}


</style>
