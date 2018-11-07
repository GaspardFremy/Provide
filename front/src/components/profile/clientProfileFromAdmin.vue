<template lang="html">
    <div class="">
        <v-layout class="pa-4" justify-space-around>
            <h6 class="title primary--text" v-if='clientInfo.length > 0'>{{clientInfo[0].name}}</h6>
            <v-spacer></v-spacer>
        </v-layout>


        <v-container fluid fill-height>
            <v-layout row wrap>
                <v-flex xs12 md3>
                    <v-card elevation-12 v-if='clientInfo.length > 0'>
                        <v-container grid-list-xs,sm,md,lg,xl>
                            <p class="sub_grey mb-1 mt-2">Nom</p>
                            <p class="subheading">{{clientInfo[0].name}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Raison Social</p>
                            <p class="subheading mb-2">{{clientInfo[0].legalName}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Address</p>
                            <p class="subheading mb-2">{{clientInfo[0].address}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Email</p>
                            <p class="subheading mb-2">{{clientInfo[0].email}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Téléphone</p>
                            <p class="subheading mb-2">{{clientInfo[0].phone}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Siret</p>
                            <p class="subheading mb-2">{{clientInfo[0].siret}}</p>

                            <v-btn flat outline color="primary" class="ma-0 pa-0 mt-4 font13">
                             modifier mes informations
                            </v-btn>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs12 md8 ml-5>
                    <v-card elevation-12>
                        <template>
                            <div>
                                <v-tabs
                                fixed-tabs
                                v-model="active"
                                slider-color="success">
                                    <v-tab>Commandes</v-tab>
                                    <v-tab>Factures</v-tab>
                                    <v-tab-item>
                                        <template>
                                            <v-data-table
                                            :rows-per-page-items="[7,20, 50, 100]"
                                            :headers="headers"
                                            :items="clientOrders"
                                            class="elevation-1">
                                                <template slot="items" slot-scope="props">
                                                    <td class="text-xs-left">{{ props.item.createdDate| moment("l") }}</td>
                                                    <td class="text-xs-left">{{ props.item.date | moment("l") }}</td>
                                                    <td class="text-xs-left">{{ props.item.time }}</td>
                                                    <td><p v-for="item in props.item.productQuantity">{{item}} </p></td>
                                                    <td class="text-xs-left">{{Math.round(props.item.total * 100) / 100}} €</td>
                                                    <td class="text-xs-left">
                                                        <v-btn round color="primary ma-0 pa-0" small dark v-if=" props.item.status === 'ordered'">{{ props.item.status }}</v-btn>
                                                        <v-btn round color="accent ma-0 pa-0" small dark v-if=" props.item.status === 'pending'">{{ props.item.status }}</v-btn>
                                                        <v-btn round color="warning ma-0 pa-0" small dark v-if=" props.item.status === 'ready'">{{ props.item.status }}</v-btn>
                                                        <v-btn round color="success ma-0 pa-0" small dark v-if=" props.item.status === 'done'">{{ props.item.status }}</v-btn>
                                                        <v-btn round color="error ma-0 pa-0" small dark v-if=" props.item.status === 'canceled'">{{ props.item.status }}</v-btn>
                                                    </td>
                                                </template>
                                                <template slot="pageText" slot-scope="props">
                                                  Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                                                </template>
                                            </v-data-table>
                                        </template>
                                    </v-tab-item>

                                    <v-tab-item>
                                        <template>
                                            <v-data-table
                                            :rows-per-page-items="[7, 20, 50, 100]"
                                            :headers="headersInvoice"
                                            :items="invoices"
                                            class="elevation-1">
                                                <template slot="items" slot-scope="props">
                                                    <td class="text-xs-left">{{ props.item.createdDate| moment("l") }}</td>
                                                    <td class="text-xs-left">{{ props.item.createdDate| moment("add", "1 month") | moment("l") }}</td>
                                                    <td class="text-xs-left">{{Math.round(props.item.amount * 100) / 100}} €</td>
                                                    <td class="text-xs-left"> <v-icon color="indigo" right>picture_as_pdf</v-icon></td>
                                                    <td class="text-xs-left">
                                                        <v-btn round color="success ma-0 pa-0" small dark v-if=" props.item.status === 1">réglé</v-btn>
                                                        <v-btn round color="error ma-0 pa-0" small dark v-if=" props.item.status === 0">non réglé</v-btn>
                                                    </td>
                                                </template>
                                                <template slot="pageText" slot-scope="props">
                                                  Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                                                </template>
                                            </v-data-table>
                                        </template>
                                    </v-tab-item>

                                    <v-tab-item>
                                        <p>Factures</p>
                                    </v-tab-item>

                                    <v-tab-item>
                                        <p>Statistiques</p>
                                    </v-tab-item>
                                </v-tabs>
                            </div>
                        </template>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { mapState } from 'vuex'

export default {

    computed: {
        ...mapState([
            'user',
        ]),
        ...mapGetters([
            'clientOrders',
            'notification',
            'invoices',
            'clientInfo'
        ]),
    },

    created () {
        this.$store.dispatch('loadClientInfo', this.$route.params['id'])
        this.$store.dispatch('loadClientOrders', this.$route.params['id']);
        this.$store.dispatch('loadInvoices', this.$route.params['id']);
    },

    watch: {
        '$route' (to, from) {
          console.log('new route');
      },

      beforeRouteUpdate (to, from, next) {
          console.log('new route');

    // react to route changes...
    // don't forget to call next()
  }
    },



    data () {
        return {
            pagination: {
                rowsPerPage: 10
            },
            active: null,
            headers: [
                { text: 'Commandé le', value: 'orderDate'},
                { text: 'Pour le', value: 'date'},
                { text: 'heure', value: 'time'},
                { text: 'Contenu', value: 'products'},
                { text: 'prix', value: 'mail' },
                { text: 'statut', value: 'status' }
            ],
            headersInvoice: [
                { text: 'Créer le', value: 'createdDate'},
                { text: 'Échéance', value: 'due'},
                { text: 'Montant', value: 'amount'},
                { text: 'PDF', value: 'pdf'},
                { text: 'Statut', value: 'status' },
            ],
        }
    },

    props: ['id'],

    methods : {
        //todo : put this function into mixins files
        showNotif(){
            this.$notify({
              group: 'auth',
              type: this.notification.data.type,
              title: this.notification.data.type,
              duration: 2000,
              speed: 1000,
              text: this.notification.data.message
            });
        }
    },

    watch: {
       notification: function () {
            this.showNotif()
       },
       //Need to re-do component cycle when client change :
       $route (to, from){
           let payload = {
               destination : "adminView",
               id : this.$route.params['id']
           }
           this.$store.dispatch('loadClientInfo', this.$route.params['id']);
           this.$store.dispatch('loadClientOrders', payload);
           this.$store.dispatch('loadInvoices', this.$route.params['id']);
        }
     },


}
</script>

<style lang="css">
.sub_grey {
    color : #9A9A9A;
}

.font13 {
    font-size: 13px;
}
</style>
