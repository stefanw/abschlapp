<template>
  <div>
    <h2>Was ist das Ergebnis?</h2>
    <fieldset>
      <legend>Schickt 110 jemanden vorbei?</legend>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" name="whoscoming" value="choice-1">
            Ja, sie schicken eine Polizeistreife
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" name="whoscoming" value="choice-2">
            Ja, sie schicken das Ordnungsamt
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="radio" name="whoscoming" value="choice-3">
            Nein, sie wollen nichts machen :(
          </label>
        </div>
    </fieldset>

    <fieldset>
      <legend>Kannst du vor Ort warten?</legend>
      <div class="form-check">
        <label class="form-check-label">
          <input type="radio" name="canyoustay" value="choice-3">
          Ja, ich warte vor Ort (empfohlen)
        </label>
      </div>
      <div class="form-check">
        <label class="form-check-label">
          <input type="radio" name="canyoustay" value="choice-3">
          Nein, ich muss dringend weiter
        </label>
      </div>
    </fieldset>

    <p>
      <a href="#/result/" class="btn btn-success btn-block">Speichern</a>
    </p>

    <p v-if="album">
      <a :href="imgurAlbum" target="_blank">
        Link zum Album
      </a>
    </p>

    <p>
      <a target="_blank" :href="'https://twitter.com/intent/tweet?text=' + tweetText + '&via=cyclehackber&url=' + imgurAlbum + '&original_referer=https%3A%2F%2Ftwitter.com%2F'">
        Tweete den Vorfall!
      </a>
    </p>

  </div>
</template>

<script>
export default {
  name: 'result',
  props: ['album', 'address'],
  computed: {
    imgurAlbum: function () {
      if (!this.album) return ''
      return 'https://imgur.com/a/' + this.album.id
    },
    tweetText: function () {
      return encodeURIComponent('#abschlapp #cyclehack')
    }
  },
  methods: {
    callPlaced: function () {
      this.$emit('callplaced')
    }
  }
}
</script>
