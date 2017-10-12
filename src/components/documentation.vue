<template>
  <div>
    <h2>Dokumentation</h2>
    <p>
      Bitte dokumentiere den Vorgang mit Fotos!
    </p>
    <label>
      <strong>Foto hochladen:</strong>
      <input type="file" @change="imageCaptured" accept="image/*" multiple/>
    </label>
    <ul class="images">
      <li v-for="img in getImagesWithState()">
        <img :src="img[0]" :class="img[1] ? 'uploaded': 'pending'" @load="revokeUrl">
         <progress v-if="!img[1]" :value="img[2]" max="100"></progress>
      </li>
    </ul>
    <label>
      <strong>Notizen:</strong>
      <textarea class="notes" :value="notes" @input="updateNotes($event.target.value)
"></textarea>
    </label>

    <p v-if="address">Automatisch ermittelte Adresse:<br/>
      <strong>{{ address }}</strong>
    </p>

    <p v-if="called">
      <a href="#/result/" @click="commitInfo()" class="btn btn-primary btn-block">Hier klicken zum Speichern</a>
    </p>
    <p v-else>
      <a href="#/call/" @click="commitInfo()" class="btn btn-primary btn-block">Jetzt 110 anrufen</a>
    </p>

    <p>
      <small>
        Deine Fotos, Notizen und dein Standort werden zur Dokumentation hochgeladen. Du stellst uns die Fotos gemeinfrei unter CC-0 zur Verfügung.
      </small>
    </p>

  </div>
</template>

<script>

import Vue from 'vue'
import imgur from '../lib/imgur'

const zip = rows => rows[0].map((_, c) => rows.map(row => row[c]))

export default {
  name: 'documentation',
  props: ['position', 'address', 'called', 'album', 'files', 'imgur', 'notes'],
  data: () => {
    return {
      uploaded: [],
      progress: [],
      creatingAlbum: false
    }
  },
  computed: {
    // a computed getter
    images: function () {
      return this.files.map((i) => URL.createObjectURL(i))
    }
  },
  methods: {
    imageCaptured: function (event) {
      let len = event.target.files.length
      this.uploaded = [...this.uploaded, ...Array(len).fill(false)]
      this.progress = [...this.progress, ...Array(len).fill(0)]
      this.$emit('filesadded', [...event.target.files])
    },
    getImagesWithState: function () {
      return zip([this.images, this.uploaded, this.progress])
    },
    uploadImages: function () {
      var self = this
      if (!this.album) {
        if (this.creatingAlbum) {
          return
        }
        this.creatingAlbum = true
        return imgur.createAlbum().then(function (album) {
          self.$emit('albumcreated', album)
        }).then(this.uploadImages)
      }
      var toUpload = []
      zip([this.files, this.uploaded]).forEach(function (fileState, i) {
        if (!fileState[1]) {
          Vue.set(self.uploaded, i, true)
          toUpload.push(fileState[0])
        }
      })
      imgur.uploadImages(toUpload, this.album).then(function (imgData) {
        self.$emit('filesuploaded', imgData)
      })
    },
    revokeUrl: (event) => {
      URL.revokeObjectURL(event.target.src)
    },
    updateNotes: function (notes) {
      this.$emit('update:notes', notes)
    },
    commitInfo: function () {
      this.$emit('commitinfo')
    }
  },
  watch: {
    files: function (newVal, oldVal) {
      this.uploadImages()
    }
  }
}
</script>

<style scoped>
  .notes {
    width: 90%;
    height: 10vh;
    font-size: 14px;
  }
  .images {
    list-style-type: none;
    padding: 0;
  }
  .images li {
    display: inline;
  }
  .images img {
    width: auto;
    height: 80px;
  }
  .images img.pending {
    outline: red 1px dashed;
  }
  .images img.uploaded {
    outline: #35495E 1px solid;
  }
</style>