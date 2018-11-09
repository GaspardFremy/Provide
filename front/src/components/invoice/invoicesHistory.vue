<template lang="html">
    <div>
        <v-layout justify-space-around>
            <h6 class="title primary--text pa-4">Historique des factures</h6>
            <div class="pa-3">
                <v-dialog v-model="dialogHelp" width="500">
                    <v-btn
                    slot="activator" outline fab small class="pa-0 ma-0" color="success">
                        <h3>?</h3>
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

            <v-dialog v-model="showPayement" width="500">
                <v-card>
                    <v-card-title primary-title>
                      <p>Veuillez entrer vos inforations bancaires</p>
                    </v-card-title>
                    <v-card-text>
                        <card class='stripe-card'
                        :class='{ complete }'
                        stripe='pk_test_tczn4vZ49Q6XCyZ8Gk7SXDxD'
                        :options='stripeOptions'
                        @change='complete = $event.complete'/>
                        <v-btn class='pay-with-stripe ma-0 mt-3' @click='pay' :disabled='!complete'>Payer</v-btn>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        color="primary"
                        flat
                        @click="showPayement = false">
                            annuler
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>


        <v-layout row>
            <v-flex xs12 sm10 offset-sm1>

                <transition name="fade">
                   <div v-if="messageSuccess">
                       <v-alert
                       :value="true"
                       color="success"
                       icon="check_circle">
                       Votre paiement a bien été éffectué.   Merci !
                       </v-alert>
                   </div>

                </transition>

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
                                                                    <v-btn @click="payInvoice(months.indexOf(i)+1)" slot="activator" color="success"> PAYER EN LIGNE </v-btn>
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
// import { stripeKey, stripeOptions } from './stripeConfig.json'
import { Card, createToken } from 'vue-stripe-elements-plus'

  export default {

    computed: {
        ...mapState([
            'user',
        ]),
        ...mapGetters([
            'clientMonthlyOrders',
            'invoiceStatusByMonth',
            'isPayed',
            'payementStatus'
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
            this.monthBeingPayed = payload.month;
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
                this.showPayement = true;
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
        pay () {
            createToken().then(data =>{
                data.token.card
                this.payload = {
                    invoiceId : this.invoiceStatusByMonth[0]['id'],
                    invoiceAmount :  this.getTotalReduc(this.getTotalTTC(this.invoiceStatusByMonth[0]['amount'])),
                    token : data.token,
                    userId : this.user[0]['id'],
                    userEmail : this.user[0]['email']
                },
                this.$store.dispatch('payement', this.payload)
            })
        }
    },
    components: { Card },

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
            complete: false,
            stripeOptions: {

            },
            showPayement : false,
            invoiceAmout : null,
            monthBeingPayed : 1,
            messageSuccess : false
        }
    },

    watch: {
        payementStatus: function (val) {
            if (this.payementStatus === "succeeded"){
                this.showPayement = false
                let payload = {
                    month : this.monthBeingPayed,
                    clientId : this.user[0].id
                }
                this.messageSuccess = true
                let self = this
                setTimeout(function(){
                    self.messageSuccess = false
                    console.log('msg succ false');

                }, 4000);

                this.$store.dispatch('checkInvoiceStatus', payload);
            }
        },
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
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
