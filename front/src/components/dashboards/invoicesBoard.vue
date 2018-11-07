<template lang="html">
    <div>
        <h6 class="title primary--text pa-4">Invoices Board</h6>
        <v-container fluid fill-height>
            <v-layout row justify-space-between>
                <v-flex xs12>
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-card>
                            <v-card-text>
                                <v-flex xs10>
                                    <span class="title ">Changement manuel du statut de la facture n° {{this.editedInvoiceId}} de {{this.editedInvoiceName}}</span>
                                </v-flex>
                                <v-radio-group v-model="radios">
                                    <v-radio value="0" color="primary" class="pt-3">
                                        <div slot="label">La facture <strong>n'est pas</strong> payée</div>
                                    </v-radio>
                                    <v-radio value="1" color="primary">
                                        <div slot="label">La facture <strong>est</strong> payée</div>
                                    </v-radio>
                                </v-radio-group>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click="dialog = false">Cancel</v-btn>
                                    <v-btn color="blue darken-1" flat @click="saveEdit(editedInvoiceId)">Save</v-btn>
                                </v-card-actions>
                            </v-card-text>
                        </v-card>
                    </v-dialog>

                    <v-data-table
                    :rows-per-page-items="[2, 50, 100]"
                    :headers="headers"
                    :items="allInvoices"
                    hide-actions
                    class="elevation-2 text-xs-center" >
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.name }}</td>
                            <td class="text-xs-left">{{ props.item.id }}</td>
                            <td class="text-xs-left">{{ props.item.createdDate | moment("l") }}</td>
                            <td class="text-xs-left">{{ props.item.createdDate | moment("add", "1 month") | moment("l")}}</td>
                            <td class="text-xs-left">{{ props.item.amount }}</td>
                            <td class="text-xs-left">
                                <v-btn round color="success ma-0 pa-0" small dark v-if=" props.item.status === 1">réglé</v-btn>
                                <v-btn round color="error ma-0 pa-0" small dark v-if=" props.item.status === 0">non réglé</v-btn>
                            </td>
                            <td class="text-xs-left">
                                <v-btn fab small dark color="warning_light" @click="editInvoiceStatus(props.item.name, props.item.id)"><v-icon> edit </v-icon></v-btn>
                            </td>
                        </template>
                        <template slot="pageText" slot-scope="props">
                          Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
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
            'allInvoices',
            'notification'
        ])
    },

    created () {
        this.$store.dispatch('loadAllInvoices');
    },

    methods : {
        editInvoiceStatus(name, id){
            this.dialog = true;
            this.editedInvoiceName = name;
            this.editedInvoiceId = id;
        },
        saveEdit(id){
            let payload = {
                status : this.radios,
                invoiceId : this.editedInvoiceId,
            }
            this.$store.dispatch('patchInvoiceStatus', payload)
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
          editedInvoiceId: null,
          editedInvoiceName: null,
          headers: [
            { text: 'Client', value: 'client'},
            { text: 'numéro facture', value: 'id' },
            { text: 'création', value: 'createdDate'},
            { text: 'échéance', value: 'due'},
            { text: 'montant', value: 'amount'},
            { text: 'statut', value: 'status'},
            { text: 'modifier statut', value: 'edit satus'}
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
