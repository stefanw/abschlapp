<template>
  <section>
    <h2>Rufe 110 an und sage folgendes:</h2>
    <blockquote class="blockquote">
      <p>
        „Hier [Name], ich möchte eine Verkehrsbehinderung melden und zwar [genauer Ort mit Stadtteil, Straße, Hausnummer/Kreuzung].“
      </p>
    </blockquote>
    <p v-bind:style="{ visibility: (address ? 'visible' : 'hidden') }">Automatisch ermittelte Adresse:<br/>
      <strong>{{ address }}</strong>
    </p>
    <p>
      <a href="tel://110" class="btn btn-success btn-lg btn-block">
        Klick hier um 110 anzurufen
      </a>
    </p>
    <p>
      <a href="#/documentation/" @click="callPlaced" class="btn btn-default btn-block">Ich habe angerufen, weiter &rarr;</a>
    </p>


    <h2>Hinweise</h2>

    <ul>
      <li>Freundlich bleiben</li>
      <li>
        110 sagt: „Nutzen Sie Online-Meldung der Ordnungsämter“<br/>
        &rarr; Ordnungsämtern bearbeiten nicht schnell genug. Radfahrer werden konkret behindert und gefährdet, jemand muss sich so
        schnell wie möglich kümmern.
      </li>
      <li>
        110 sagt: Nur „Verkehrsordnungswidrigkeit“<br/>
        &rarr; "Nein, eine Behinderung, sogar Gefährdung"
      </li>
      <li v-if="policedistrict">
        Dein Polizeiabschnitt: {{ policedistrict.ABSCHNITT }} ({{ policedistrict.spatial_name }})
      </li>
    </ul>
  </section><!-- /content -->
</template>

<script>
export default {
  name: 'call',
  props: ['policedistrict', 'address'],
  methods: {
    callPlaced: function () {
      this.$emit('callplaced')
    }
  }
}
</script>
