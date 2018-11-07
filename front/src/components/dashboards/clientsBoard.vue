<template lang="html">
<div>
  <h6 class="title primary--text pa-4">Clients Board</h6>
 <v-container grid-list>
     <v-layout row justify-center>
       <v-dialog v-model="dialog" persistent max-width="500px">
         <v-btn slot="activator" color="primary" dark>AJOUTER UN NOUVEAU CLIENT</v-btn>
         <v-card>
           <v-card-title>
             <span class="headline">Nouveau client</span>
           </v-card-title>
           <v-card-text>
             <v-container grid-list-md>
               <v-layout wrap>
                 <v-flex xs12 sm6 md4>
                   <v-text-field
                     v-model="name"
                     label="Nom"
                     required>
                     </v-text-field>
                 </v-flex>
                 <v-flex xs12 sm6 md4>
                   <v-text-field
                    v-model="legalName"
                    label="Raison Social"
                    required
                    hint="example of helper text only on focus">
                    </v-text-field>
                 </v-flex>
                 <v-flex xs12 sm6 md4>
                   <v-text-field
                     v-model="siret"
                     label="SIRET"
                     :rules="[rules.siret]"
                     required>
                     </v-text-field>
                 </v-flex>
                 <v-flex xs12>
                   <v-text-field
                    v-model="address"
                    label="adresse"
                    required>
                   </v-text-field>
                 </v-flex>
                 <v-flex xs12>
                   <v-text-field
                    v-model="phone"
                    :rules="[rules.phone]"
                    label="telephone"
                    required>
                   </v-text-field>
                 </v-flex>
                 <v-flex xs12 sm6>
                   <v-select
                     :items="sector"
                     label="secteur"
                     required
                     v-model="sector"
                   ></v-select>
                 </v-flex>
                 <v-flex xs12>
                   <v-text-field
                    v-model="email"
                    label="Email"
                    :rules="[rules.email]"
                    required></v-text-field>
                 </v-flex>
                 <v-flex xs12>
                  <v-text-field
                    v-model="password"
                    :append-icon="show1 ? 'visibility_off' : 'visibility'"
                    :rules="[rules.min]"
                    name="password"
                    label="Normal with hint text"
                    hint="5 caractères minimum"
                    :append-icon-cb="() => (show1 = !show1)"
                    :type="show1 ? 'text' : 'password'"
                  ></v-text-field>
                </v-flex>
                 <v-flex xs12 sm12>
                 <v-text-field
                   :append-icon="show4 ? 'visibility_off' : 'visibility'"
                   :rules="[rules.required]"
                   name="confirmPassword"
                   v-model="confirmPassword"
                   label="Confirmer le mdp"
                   @click:append="show4 = !show4"
                   :append-icon-cb="() => (show4 = !show4)"
                   :type="show4 ? 'text' : 'password'"
                 ></v-text-field>
                 </v-flex>
               </v-layout>
             </v-container>
           </v-card-text>
           <v-card-actions>
             <v-spacer></v-spacer>
             <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
             <v-btn color="blue darken-1" flat @click.native="dialog = false" @click="submitNewClient()">Save</v-btn>
           </v-card-actions>
         </v-card>
       </v-dialog>
     </v-layout>
 </v-container>

  <v-container fluid fill-height>
      <v-layout row>
          <v-flex xs12 sm10 md12>
              <v-data-table
                :headers="headers"
                :items="clients"
                hide-actions
                class="elevation-2 text-xs-center" >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.legalName }}</td>
                  <td class="text-xs-left">{{ props.item.phone }}</td>
                  <td class="text-xs-left">{{ props.item.email }}</td>
                  <td class="text-xs-left">{{ props.item.address }}</td>
                  <td class="text-xs-left">{{ props.item.siret }}</td>
                  <td class="text-xs-left">{{ props.item.sector }}</td>
                  <td class="text-xs-left">{{ props.item.createdDate | moment("l") }}</td>
                </template>
              </v-data-table>
          </v-flex>
      </v-layout>
  </v-container>
</div>
</template>

<script>

import { mapGetters } from 'vuex'
import Notifications from 'vue-notification'

  export default {

    computed: {
        ...mapGetters([
        'clients',
        'notification'
        ])
    },


    created () {
        this.$store.dispatch('loadClients')
    },


    watch: {
       notification: function () {
            this.showNotif()
       }
     },


    methods : {

        showNotif(){
            this.$notify({
              group: 'auth',
              type: this.notification.data.type,
              title: this.notification.data.type,
              duration: 2000,
              speed: 1000,
              text: this.notification.data.message
            });
        },

        submitNewClient(){
            let clientInfo = {
                name : this.name,
                legalName : this.legalName,
                siret : this.siret,
                address : this.address,
                phone : this.phone,
                sector : this.sector,
                email : this.email,
                password: this.password,
                confirmPassword: this.confirmPassword
            }
            this.$store.dispatch('submitNewClient', clientInfo)
            this.$store.dispatch('loadClients')
            this.password = "null"
            this.confirmPassword = "null"
            this.phone = null
            this.name = null
            this.email = null
            this.siret = null
            this.address = null
            this.legalName = null
            this.sector = null
        },
    },


    data: () => ({
        show1: false,
        show4: false,
        password: "null",
        confirmPassword: "null",
        phone : null,
        name : null,
        email : null,
        siret : null,
        address : null,
        legalName : null,
        sector : null,
        sector : ['restaurant', 'hôtel', 'entreprise'],
        rules: {
            required: value => !!value || 'Required.',
            counter: value => value.length <= 20 || 'Max 20 characters',
            email: value => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'format d\'e-mail non valide'
            },
            siret: value => {
              const pattern = /^[0-9]{14}$/
              return pattern.test(value) || 'Entrez un siret valide'
            },
            phone: value => {
              const pattern = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
              return pattern.test(value) || 'Entrez un numéro français valide'
            },
            min (val) {
                if (val.length < 5) {
                    return 'au moins 5 caractères'
                }
              },
            // passMatch: v =>  v === this.password || 'les mots de passe ne correspondent pas'
            // passMatch (val) {
            //     if (this.password != val ) {
            //         return 'les mots de passe ne correspondent pas'
            //     }
            // }
            // todo: confirm password rule don't work.
        },
        dialog: false,
        headers: [
            { text: 'Nom', value: 'name'},
            { text: 'Raison Social', value: 'legalName'},
            { text: 'Téléphone', value: 'phone'},
            { text: 'Mail', value: 'mail' },
            { text: 'Adresse', value: 'adresse' },
            { text: 'Siret', value: 'siret' },
            { text: 'Secteur', value: 'types' },
            { text: 'Date ajout', value: 'types' },
        ],
    })
}

</script>

<style media="screen">
    .vue-notification {
        padding: 15px;
    }
</style>
