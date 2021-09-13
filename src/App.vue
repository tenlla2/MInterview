  <template>
  <div id="app">
    <v-app>
      <v-main>
        <router-view style="margin-bottom:50px" />
        <menu-bottom />
      </v-main>
    </v-app>
  </div>
</template>
<script>
import MenuBottom from './components/MenuBottom.vue'
export default {
  name:"App",
  components:{
    MenuBottom
  }
}
</script>
<style scoped>
#app{
  background: #f7f7f7;
}
</style>