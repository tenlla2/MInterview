<template>
  <v-bottom-navigation align=center :grow="true" justify=center fixed width="100%" class="primary--text">
    <v-btn to="/" color="transparent">
      <span>Principal</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn color="transparent" to="/history-changes">
      <span>Historial</span>
      <v-icon>mdi-clipboard-file</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "MenuBottom",
  data: () => ({}),
};
</script>
<style>
.v-bottom-navigation{
  align-items: center;
}
</style>
