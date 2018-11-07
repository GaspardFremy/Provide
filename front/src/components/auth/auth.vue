<template>
    <div class="body_container">
      <v-container fill-height>
        <v-container>
          <v-layout row wrap justify-center>
            <v-card class="pa-5 elevation-15">
              <h1 class="display-2 text-xs-center primary--text pa-2 mb-3">ProvideEasy</h1>
              <v-card-text class="pt-0">
                <v-form>
                  <v-text-field v-model="email" label="Email" required></v-text-field>
                  <v-text-field @keyup.enter="connect()" v-model="password" label="mot de passe" type="password" required></v-text-field>
                  <v-alert v-if='logErr.length > 1' :value="true" type="error">
                    {{this.logErr}}
                  </v-alert>
                  <v-layout align-center class="mt-4">
                    <v-flex text-xs-center>
                        <v-btn color="primary" class="white--text" @click='connect()'>connexion</v-btn>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-card-text>
            </v-card>
          </v-layout>
        </v-container>
      </v-container>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters([
        'logErr',
        ])
    },

    name : 'Auth',

    data () {
        return {
            email : null,
            password : null
        }
    },
    
    methods : {
        connect(){
            let connectInfo = {
                email : this.email,
                password : this.password
            }
            this.$store.dispatch('connect', connectInfo)
        },
    },
}
</script>

<style lang="css">
    .body_container{
        background-color: #019AE8;
        height: 100%;
        width: 100%;
    }
</style>
