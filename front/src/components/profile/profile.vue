<template lang="html">
    <div class="">
        <v-layout justify-space-around>
            <h6 class="title primary--text pa-4 pl-1">{{user[0].name}}</h6>
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
                                    <v-tab>Fonctionement</v-tab>

                                    <v-tab-item>
                                        <template>
                                            <v-card-text>

                                                <div class="pt-4 ma-2">
                                                    <tr>
                                                        <th class="pr-2">1 </th>
                                                        <td class=" pb-4">  Allez sur l'onglet   <v-icon>receipt</v-icon>  Orders pour gérer l'afflux de commandes</td>
                                                    </tr>
                                                    <tr>
                                                        <th class="pr-2">2 </th>
                                                        <td class=" pb-4">  Retrouvez toutes les commandes du mois dans l'onglet  <v-icon>list_alt</v-icon>  Orders Board et modifier leur statut si besoin</td>
                                                    </tr>
                                                    <tr>
                                                        <th class="pr-2">3 </th>
                                                        <td class=" pb-4">  Ajoutez et editez vos comptes clients dans l'onglet  <v-icon>perm_contact_calendar</v-icon>  Client Board</td>
                                                    </tr>
                                                    <tr>
                                                        <th class="pr-2">5 </th>
                                                        <td class=" pb-4">  Retrouvez toutes les factures clients rapidement dans l'onglet  <v-icon>import_contacts</v-icon>  Invoice Board. Modifiez leur statut manuellement dans le cas ou un client règle par chèque. Les factures sont créer automatiquement le premier du mois. Vous avez jusqu'à la veille pour modifier vos commandes client</td>
                                                    </tr><tr>
                                                        <th class="pr-2">6 </th>
                                                        <td class=" pb-4">  Cliquez sur le nom de vos clients dans l'onglet  <v-icon>person</v-icon>   Clients pour accéder à toutes les informations les concernant</td>
                                                    </tr>
                                                </div>


                                            </v-card-text>
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
    },

    data () {
        return {
            dialogHelp : false,
        }
    },

    props: ['id'],

    methods : {
        logout(){
            this.$store.dispatch('logout');
            window.location.replace("/");
        },
    },
}
</script>

<style lang="css">
</style>
