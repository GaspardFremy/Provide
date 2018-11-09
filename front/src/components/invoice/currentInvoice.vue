<template lang="html">
    <div>
        <v-layout justify-space-around>
            <h6 class="title primary--text pa-4 pl-1">Facture en cours</h6>
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
                            1. Le premier tableau est un récapitulatif des achats effectués ce moi ci par jour.
                               Cliquez sur les jours pour afficher les commandes effectuées, ainsi que leurs cout hors taxe et après TVA.<br><br>
                            2. Le deuxième tableau affiche tout les achats effectués ce moi-ci.<br><br>
                            3. A la fin de chaque mois, une facture est créer, vous pouvez la retrouver depuis votre profile ou depuis la page 'invoices / previous'.
                               Celle ci permet d'avoir une vue d'ensemble sur les achats effecutés, par mois.
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
                <p>Récapitulatif des achats effectués ce moi ci par jour.</p>
                <v-tabs
                dark
                color="info"
                show-arrows
                class="elevation-1">
                    <v-tabs-slider class="waring"></v-tabs-slider>
                    <v-tab
                    v-for="i in this.$moment().daysInMonth()"
                    :key="i"
                    :href="'#tab-' + i"
                    @click="changeDate(i)">
                    {{ i }}
                    </v-tab>
                    <v-tabs-items>
                        <v-tab-item
                        v-for="i in this.$moment().daysInMonth()"
                        :key="i"
                        :id="'tab-' + i">
                            <v-card flat>
                                <v-card-text>
                                    <template>
                                        <v-data-table
                                        :headers="headers"
                                        :items="clientDailyOrders">
                                            <template slot="no-data">
                                                <v-alert :value="true" color="warning_light" icon="warning">
                                                    Vous n'avez pas effectué de commande ce jour là !
                                                </v-alert>
                                            </template>

                                            <template slot="items" slot-scope="props">
                                                <td>{{ props.item.name }}</td>
                                                <td>{{ props.item.quantity }}</td>
                                                <td>{{ props.item.price }}</td>
                                                <td>{{Math.round(props.item.price * props.item.quantity * 100) / 100}} €</td>
                                            </template>

                                            <template v-if="clientDailyOrders.length > 0" slot="footer">
                                                <td colspan="100%">
                                                    <table class="mt-5">
                                                    <tr>
                                                        <td><span>PRIX TOTAL HT : </span></td>
                                                        <td><span class="subtitle pl-1">{{Math.round(totalByDay * 100) / 100}} €</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td><span>PRIX TTC <br> (TVA 5,5%) : </span></td>
                                                        <td><span class="subtitle pl-1">{{Math.round( getTotalTTC(totalByDay) * 100) / 100 }} €</span></td>
                                                    </tr>
                                                    <v-spacer class="mt-1"></v-spacer>
                                                    <tr>
                                                        <td><span class="mt-1">APRÈS - 10% : </span></td>
                                                        <td><span class="title pl-1">{{ Math.round( getTotalTTC(getTotalReduc(totalByDay)) * 100) / 100 }} €</span></td>
                                                    </tr>
                                                    </table>
                                                </td>
                                            </template>
                                        </v-data-table>
                                    </template>
                                </v-card-text>
                                </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tabs>




                <v-flex mt-5>
                    <p>Récapitulatif de l'ensemble des achats effectués ce moi-ci</p>

                </v-flex>


                        <v-card>
                        <v-card-text>
                            <template>
                              <v-data-table
                                :headers="headers"
                                :items="clientCurrentMonthOrders">

                                <template slot="items" slot-scope="props">
                                  <td>{{ props.item.name }}</td>
                                  <td>{{ props.item.quantity }}</td>
                                  <td>{{ props.item.price }}</td>
                                  <td>{{Math.round(props.item.price * props.item.quantity * 100) / 100}} €</td>
                                </template>

                                <template slot="footer">
                                 <td colspan="100%">
                                     <table class="mt-5">
                                         <tr>
                                             <td><span>PRIX TOTAL HT : </span></td>
                                            <td><span class="subtitle pl-1">{{ Math.round(totalByMonth * 100) / 100 }} €</span></td>
                                          </tr>

                                          <tr>
                                             <td><span>PRIX TTC <br> (TVA 5,5%) : </span></td>
                                             <td><span class="subtitle pl-1">{{ Math.round( getTotalTTC(totalByMonth) * 100) / 100 }} €</span></td>
                                           </tr>
                                           <v-spacer class="mt-1"></v-spacer>
                                          <tr>
                                             <td><span class="mt-1">APRÈS - 10% : </span></td>
                                             <td><span class="title pl-1">{{ Math.round( getTotalTTC(getTotalReduc(totalByMonth)) * 100) / 100 }} €</span></td>
                                           </tr>
                                     </table>
                                 </td>
                               </template>

                              </v-data-table>
                            </template>
                        </v-card-text>
                        </v-card>
            </v-flex>
        </v-layout>
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
            'clientCurrentMonthOrders',
            'clientDailyOrders'
        ]),
        totalByDay(){
            return this.clientDailyOrders.reduce(function(totalByDay, item){
                return totalByDay + (item.price * item.quantity);
           },0);
       },
       totalByMonth(){
           return this.clientCurrentMonthOrders.reduce(function(totalByMonth, item){
               return totalByMonth + (item.price * item.quantity);
          },0);
       }
   },

    created () {
        let payload = {
            day : 1,
            clientId : this.user[0].id
        }
        this.$store.dispatch('loadClientDailyOrder', payload)
        this.$store.dispatch('loadClientCurrentMonthOrders', this.user[0].id)

    },

    methods : {
        changeDate(day){
            let payload = {
                day : day,
                clientId : this.user[0].id
            }
            this.$store.dispatch('loadClientDailyOrder', payload)

        },
        getTotalTTC(total) {
            return Math.round( ((total * 5.5 / 100) + total ) * 100) / 100
        },

        getTotalReduc(total) {
            return Math.round((total - (total * 10/100)) * 100) / 100
        },
    },

    data () {
      return {
          headers: [
          {
            text: 'Total/day',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Amount', value: 'amount' },
          { text: 'Unit Price', value: 'price' },
          { text: 'Total', value: 'total' },
        ],
        values: [
            {
                value: false,
                name: 'Baguette',
                price: 1,
                amount: 6,
                total: 9
            },
            {
                value: false,
                name: 'Baguette tradition',
                price: 1.2,
                amount: 20,
                total: 9
            }
        ],
        dialogHelp: false
      }
    },

    props: ['id']
  }
</script>
