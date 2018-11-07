<template lang="html">
    <div>
        <h6 class="title primary--text pt-4 pl-4">Sales Board</h6>
        <v-container fluid grid-list-xl>
            <v-layout row align-content-space-between wrap>
                <v-flex xs6 sm3>
                    <v-card hover color="success" class="white--text">
                        <v-container class="text-sm-center">
                            <div>Average Basket</div>
                            <div class="headline mt-1">30 €</div>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs6 sm3>
                    <v-card hover color="accent" class="white--text">
                        <v-container class="text-sm-center">
                            <div>Daily Order</div>
                            <div class="headline mt-1">30 €</div>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs6 sm3>
                    <v-card hover color="info" class="white--text">
                        <v-container class="text-sm-center">
                            <div>Week Revenues</div>
                            <div class="headline mt-1">30 €</div>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex xs6 sm3>
                    <v-card hover color="purple" class="white--text">
                        <v-container class="text-sm-center">
                            <div>Profit</div>
                            <div class="headline mt-1">30 €</div>
                        </v-container>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12 sm9>
                    <div>
                        <!-- <line-chart
                        :chart-data="datacollection"
                        :height="200">
                        </line-chart> -->
                    </div>
                </v-flex>
                <v-flex xs12 sm3>
                    <v-card>
                        <v-card>
                            <v-card-title class="text-xs-center"><h4 class="headline">top clients</h4></v-card-title>
                                <v-divider></v-divider>
                                <v-list dense>
                                    <v-list-tile v-for="item in topClients" class="list_items container-flex">
                                        <div>{{item.name}}</div>
                                        <div>{{item.revenues}}</div>
                                    </v-list-tile>
                                </v-list>
                            </v-card>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>


<script>

  // import LineChart from './LineChart.js'
  import { mapGetters } from 'vuex'

  export default {

    //
    // components: {
    //   LineChart
    // },


    computed: {
        ...mapGetters([
        'topClients'
        ])
    },


    data () {
        return {
            datacollection: {
                labels: ['January', 'February', 'March', 'April', 'May'],
                datasets: [
                    {
                        label: 'revenues',
                        backgroundColor: '#60D3A0',
                        data: [120, 100, 140, 150, 120, 145]
                    },
                    {
                        label: 'Profit',
                        backgroundColor: '#019AE8',
                        data: [130, 110, 128, 110, 190, 145]
                    }
                ]
            }
        }
    },

    mounted () {
        // this.renderChart(this.datacollection, {responsive: true, maintainAspectRatio: false})
    },
}
</script>

<style>
    .small {
        max-width: 100%;
        margin:  300px;
    }

    .list_items {
        border-bottom: 1px solid #60D3A0;
        width: 90%;
        margin: auto;
    }

    .container-flex {
        display: flex;
        justify-content: space-between;
    }
</style>
