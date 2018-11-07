<template>
  <v-app>
    <notifications group="auth"/>
    <AuthLayout v-if='user.length == 0'></AuthLayout>
    <div v-else>
        <providerMenu v-if='user[0].sector == null'></providerMenu>
        <!-- <clientMenu v-if='user[0].typeId != null'></clientMenu> -->
        <clientMenu v-else></clientMenu>
        <v-content>
            <router-view/>
        </v-content>
    </div>


  </v-app>
</template>

<script>

import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState([
        'user',
        ])
    },

    data () {
    return {
        providerConnected: false,
        clientConnected: true,
        connected: false
    }
    },
    name: 'App'
}
</script>

<style media="screen">

#app {
    font-family: 'Montserrat', sans-serif;
    color: #2c3e50;
}


</style>
