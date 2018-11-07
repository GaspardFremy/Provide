<template lang="html">
    <div class="">
        <v-layout justify-space-around>
            <h6 class="title primary--text pa-4 pl-1">{{user[0].name}}</h6>
            <div class="pa-3">
                <v-dialog v-model="dialogHelp" width="500">
                    <v-btn
                    slot="activator" fab  dark color="transparent">
                        <v-icon color="success">help</v-icon>
                    </v-btn>
                    <v-card>
                        <v-card-title
                        class="headline grey lighten-2 text-xs-cente"
                        primary-title>Comment utiliser l'interface </v-card-title>

                        <v-card-text>
                            1. Retrouvez vos informations à gauche de l'écran. Vous pouvez les modifier en cliquant sur "modifier mes informations" <br><br>
                            2. Dans l'onglet 'Commandes', retrouvez vos commandes avec leur état en temps réel. <br><br>
                            3. Dans l'onglet 'Factures', retrouvez vos factures. Vous pouvez télécharger un pdf en cliquant sur l'icon
                                <v-icon color="indigo" right>picture_as_pdf</v-icon> <br><br>
                            4. Procédez au paiement de votre facture en cliquant sur le boutton
                                <v-btn round color="error ma-0 pa-0" small dark>NON RÉGLÉ</v-btn> lorsqu'il est affiché. <br><br>
                            5. Rendez vous à la page "Invoices" pour afficher vos achat par jours ou mois.<br><br>
                            6. Vous pouvez vous déconnecter en cliquant sur le boutton <v-btn color="warning"><v-icon left >input</v-icon>logout</v-btn>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                            color="primary"
                            flat
                            @click="dialogHelp = false">
                                J'ai compris
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
            <v-spacer></v-spacer>
            <div class="pa-4">
                <v-btn color="warning" @click='logout()'><v-icon left>input</v-icon>logout</v-btn>
            </div>
        </v-layout>

        <v-container fluid fill-height>
            <v-layout row wrap>
                <v-flex xs12 md3>
                    <v-card elevation-12>
                        <v-container grid-list-xs,sm,md,lg,xl>
                            <p class="sub_grey mb-1 mt-2">Nom</p>
                            <p class="subheading">{{user[0].name}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Raison Social</p>
                            <p class="subheading mb-2">{{user[0].legalName}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Address</p>
                            <p class="subheading mb-2">{{user[0].address}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Email</p>
                            <p class="subheading mb-2">{{user[0].email}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Téléphone</p>
                            <p class="subheading mb-2">{{user[0].phone}}</p>
                            <v-divider></v-divider>

                            <p class="sub_grey mb-1 mt-2">Siret</p>
                            <p class="subheading mb-2">{{user[0].siret}}</p>

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
            'invoices'
        ]),
    },

    created () {
        let payload = {
            destination : "clientView",
            id : this.user[0].id,
        }
        this.$store.dispatch('loadClientOrders', payload);
        this.$store.dispatch('loadInvoices', this.user[0].id);
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
            dialogHelp : false,
        }
    },

    props: ['id'],

    methods : {
        logout(){
            this.$store.dispatch('logout');
            window.location.replace("/");
        },
        setProductQuantity(){

            function toObject(arr) {
              var rv = {};
              for (var i = 0; i < arr.length; ++i)
                rv[i] = arr[i];
              return rv;
            }
        },

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
