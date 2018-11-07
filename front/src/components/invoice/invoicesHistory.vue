<template lang="html">
    <div>
        <v-layout justify-space-around>
            <h6 class="title primary--text pa-4">Historique des factures</h6>
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
                            1. Cliquez sur chaque mois pour afficher la facture correspondante. <br><br>
                            2. Si la facture correspondante n'a pas été payée, vous pouvez le faire en cliquant sur le boutton
                            <v-btn small color="success"> PAYER EN LIGNE</v-btn> <br><br>
                            3. Si la facture correspondante a été payée, vous verrez alors la mention "Facture payée<v-icon small dark color="success">done</v-icon>" <br><br>
                            4. A tout moment, vous pouvez télécharger le pdf de la facture en cliquant sur le boutton
                            <v-btn color="indigo" class="white--text" outline> TÉLÉCHARGER <v-icon right>picture_as_pdf</v-icon></v-btn> <br><br>
                            5. Vous ne pouvez pas payer ou télécharger le pdf d'une facture en cours.

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
        </v-layout>


        <v-layout row>
            <v-flex xs12 sm10 offset-sm1>
                <p>Récapitulatif des achats effectués cette année par mois</p>
                <v-tabs
                dark
                color="accent"
                show-arrows
                class="elevation-1">
                    <v-tab
                    v-for="i in months"
                    :key="i"
                    :href="'#tab-' + i"
                    @click="changeMonth(i)">
                    {{ i }}
                    </v-tab>
                    <v-tabs-items>
                        <v-tab-item
                        v-for="i in months"
                        :key="i"
                        :id="'tab-' + i">
                            <v-card flat>
                                <v-card-text>
                                    <template>
                                        <v-data-table
                                        :headers="headers"
                                        :items="clientMonthlyOrders">
                                            <template slot="no-data">
                                                <v-alert :value="true" color="warning_light" icon="warning">
                                                    Vous n'avez pas effectué de commande ce mois là
                                                </v-alert>
                                            </template>
                                            <template slot="items" slot-scope="props">
                                                <td>{{ props.item.name }}</td>
                                                <td>{{ props.item.quantity }}</td>
                                                <td>{{ props.item.price }}</td>
                                                <td>{{Math.round(props.item.price * props.item.quantity * 100) / 100}} €</td>
                                            </template>

                                            <template v-if="clientMonthlyOrders.length > 0" slot="footer">
                                                <td colspan="100%">
                                                  <v-layout class="mt-5">
                                                      <v-flex xs-6>
                                                          <table>
                                                              <tr>
                                                                  <td><span>PRIX TOTAL HT : </span></td>
                                                                  <td><span class="subtitle pl-1">{{Math.round(totalByMonth * 100) / 100}} €</span></td>
                                                              </tr>
                                                              <tr>
                                                                  <td><span>PRIX TTC <br> (TVA 5,5%) : </span></td>
                                                                  <td><span class="subtitle pl-1">{{getTotalTTC(totalByMonth)}} €</span></td>
                                                              </tr>
                                                              <v-spacer class="mt-1"></v-spacer>
                                                              <tr>
                                                                  <td><span class="mt-1">APRÈS - 10% : </span></td>
                                                                  <td><span class="title pl-1">{{getTotalReduc(getTotalTTC(totalByMonth))}} €</span></td>
                                                              </tr>
                                                          </table>
                                                      </v-flex>

                                                      <v-flex xs-6>
                                                          <table>
                                                              <tr>
                                                                  <v-btn
                                                                  @click="showPdf(months.indexOf(i)+1)"
                                                                  color="indigo"
                                                                  class="white--text"
                                                                  outline>
                                                                      TÉLÉCHARGER
                                                                      <v-icon right>picture_as_pdf</v-icon>
                                                                  </v-btn>
                                                              </tr>
                                                              <tr v-if='isPayed === 0'>
                                                                  <v-btn
                                                                  @click="payInvoice(months.indexOf(i)+1)"
                                                                  color="success">
                                                                      PAYER EN LIGNE
                                                                  </v-btn>
                                                              </tr>
                                                              <tr v-if='isPayed === 1'>
                                                                    <p class="ml-2 mt-3">Facture payée <v-icon small dark color="success">done</v-icon></p>
                                                              </tr>
                                                          </table>
                                                      </v-flex>
                                                  </v-layout>
                                                </td>
                                            </template>
                                        </v-data-table>
                                    </template>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tabs>


                <!-- ALERT BOX -->
                <template>
                    <div class="text-xs-center">
                        <v-dialog v-model="isCurrentMonth" width="500">
                          <v-card>
                            <v-card-text v-model='alertText'>
                                Il s'agit de la facture du mois en cours. <br>
                                {{alertText}}
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" flat @click="isCurrentMonth = false"> OK </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                    </div>
                </template>
            </v-flex>
        </v-layout>
    </div>
</template>



<script>
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
import { Card, createToken } from 'vue-stripe-elements-plus'

  export default {

    computed: {
        ...mapState([
            'user',
        ]),
        ...mapGetters([
            'clientMonthlyOrders',
            'invoiceStatusByMonth',
            'isPayed'
        ]),
        totalByMonth(){
            return this.clientMonthlyOrders.reduce(function(totalByMonth, item){
                return totalByMonth + (item.price * item.quantity);
           },0);
       },
   },

    created () {
        let payload = {
            month : 1,
            clientId : this.user[0].id
        }
        this.$store.dispatch('loadClientMonthlyOrder', payload);
    },

    methods : {
        changeMonth(monthAbr){
            let payload = {
                month : this.months.indexOf(monthAbr) + 1,
                clientId : this.user[0].id
            }
            this.$store.dispatch('loadClientMonthlyOrder', payload);
        },

        getTotalTTC(total) {
            return Math.round( ((total * 5.5 / 100) + total ) * 100) / 100
        },

        getTotalReduc(total) {
            return Math.round((total - (total * 10/100)) * 100) / 100
        },
        payInvoice(month){
            if (month == this.$moment().month() + 1) {
                this.alertText = "Vous ne pouvez pas la régler avant la fin du mois."
                this.isCurrentMonth = true
            }
            else {
                console.log('ok proceed to payement');
            }
        },

        showPdf(month){
            if (month == this.$moment().month() + 1) {
                this.alertText = 'Vous ne pouvez pas télécharger le PDF correspondant car il n\'est pas exhaustif'
                this.isCurrentMonth = true
            }
            else {
                console.log('ok here is your pdf');
            }
        },
    },

    data () {
        return {
            months : ['January', 'Febuary', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November','December'],
            headers: [
                { text: 'Total/day', align: 'left', sortable: false, value: 'name'},
                { text: 'Amount', value: 'amount' },
                { text: 'Unit Price', value: 'price' },
                { text: 'Total', value: 'total' },
            ],
            isCurrentMonth: false,
            alertText: null,
            dialogHelp: null,
        }
    },

    props: ['id']
}
</script>

<style media="screen">
    .border_top {
        border-top: 1px solid grey;
    }
    .stripe-card {
        width: 300px;
        border: 1px solid grey;
    }
    .stripe-card.complete {
        border-color: green;
    }
</style>
