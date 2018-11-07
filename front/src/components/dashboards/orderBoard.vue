<template lang="html">
    <div>
        <h6 class="title primary--text pa-4">Order Board</h6>
        <v-container fluid fill-height>
            <v-layout row justify-space-between>
                <v-flex xs12>
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-card>
                            <v-card-text>
                                <v-flex xs10>
                                    <span class="title ">Changer le statut de la commande de {{this.editedOrderClientName}} pour le {{this.editedOrderDate}} à {{this.editedOrderTime}}</span>
                                </v-flex>
                                <v-radio-group v-model="radios">
                                    <v-radio value="ordered" color="warning_light" class="pt-3">
                                        <div slot="label"><strong>non vue</strong></div>
                                    </v-radio>
                                    <v-radio value="pending" color="primary" class="pt-3">
                                        <div slot="label"><strong>en cours de préparation</strong></div>
                                    </v-radio>
                                    <v-radio value="ready" color="primary" class="pt-3">
                                        <div slot="label"><strong>prête</strong></div>
                                    </v-radio>
                                    <v-radio value="done" color="success" class="pt-3">
                                        <div slot="label"><strong>livrée</strong></div>
                                    </v-radio>
                                    <v-radio value="canceled" color="error" class="pt-3">
                                        <div slot="label"><strong>Annuler la commande</strong></div>
                                    </v-radio>
                                </v-radio-group>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click="dialog = false">Cancel</v-btn>
                                    <v-btn color="blue darken-1" flat @click="saveEdit(editedOrderId)">Save</v-btn>
                                </v-card-actions>
                            </v-card-text>
                        </v-card>
                    </v-dialog>

                    <template>
                        <v-data-table
                        :rows-per-page-items="[7,20, 50, 100]"
                        :headers="headers"
                        :items="allOrders"
                        class="elevation-1">
                            <template slot="items" slot-scope="props">
                                <td class="text-xs-left">{{ props.item.clientName }}</td>
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
                                <td class="text-xs-left">
                                    <v-btn fab small dark color="warning_light" @click="editOrderStatus(props.item.clientName, props.item.date, props.item.time, props.item.id )"><v-icon> edit </v-icon></v-btn>
                                </td>
                            </template>
                            <template slot="pageText" slot-scope="props">
                              Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                            </template>
                        </v-data-table>
                    </template>
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
            'allOrders',
            'notification'
        ])
    },

    created () {
        this.$store.dispatch('loadAllOrders');
    },

    methods : {
        editOrderStatus(clientName, date, time, id){
            this.dialog = true;
            this.editedOrderId = id;
            this.editedOrderClientName = clientName;
            this.editedOrderDate = date;
            this.editedOrderTime = time;
        },
        saveEdit(id){
            let payload = {
                status : this.radios,
                orderId : id
            }
            this.$store.dispatch('patchOrderStatus', payload)
            this.dialog = false;
        },
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
    },

    data(){
      return{
          radios: null,
          dialog: false,
          editedOrderId: null,
          editedOrderClientName: null,
          editedOrderDate: null,
          editedOrderTime: null,
          headers: [
            { text: 'Client', value: 'client'},
            { text: 'Commandé le', value: 'created date'},
            { text: 'Pour le', value: 'due date'},
            { text: 'Heure', value: 'hour'},
            { text: 'Contenu', value: 'content'},
            { text: 'Prix', value: 'price'},
            { text: 'Statut', value: 'satus'},
            { text: 'Modifier statut', value: 'edit satus'}
          ],
      }
    },

    watch: {
        notification: function () {
            this.showNotif()
        },
    },
  }
</script>
