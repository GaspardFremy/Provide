<template lang="html">
    <div class="">
        <v-layout row wrap class="maxheight" v-if="this.orders.length >= 0">
            <v-flex xs3 class="cards_order success">
                    <v-card class="ma-2" v-for="orderItem in orders">
                        <v-container @click='displayOrder();displayOrderDetails(orderItem.id);done = false; selected = orderItem' v-bind:class="{ selected: selected == orderItem, ordered : orderItem.status === 'ordered' }">
                            <p class="title text-xs-center">{{orderItem.clientName}}</p>
                            <!-- <p class="subheading ma-0">{{order.Date | moment("calendar").split(" à")[0]}}</p> -->
                            <p class="subheading ma-0">{{orderItem.date | moment("calendar").split(" ")[0] }}</p>
                            <p class="subheading">À {{orderItem.time}}</p>
                            <p>Commande n° {{orderItem.id}}</p>
                        </v-container>
                    </v-card>
            </v-flex>

            <v-flex xs9>
                <p v-if="orders.length === 0" class="headline pa-5">Vous n'avez pas de commandes pour l'instant</p>

                <v-flex xs12 md6 offset-xs2>
                    <v-card flat v-if='!done'>
                        <v-layout v-if='order.length > 0' align-center justify-center row fill-height class="ma-5">
                            <v-container>
                                <p class="subheading"> commande n°{{order[0]['id']}}</p>

                                <p class="headline pt-4">{{order[0]['clientName']}}</p>

                                <p class="headline ma-0 pb-4"> Pour le :  {{order[0]['date']}} - {{order[0]['time']}}</p>
                                <!-- <p class="title ma-0 pt-1">A : </p> -->
                                <p class="pb-2 subheading">Détail de la commande :</p>
                                <p class="headline" v-for="item in order[0]['productQuantity']">{{item}} </p>
                                <v-layout mt-3>
                                    <transition name="fade" mode="out-in">
                                        <v-btn v-if='order[0]["status"] === "ordered"' key="1"  color="success" class="ma-0 mt-4"  @click='switchStatus(order[0]["id"], "pending")'>ACCEPTER LA COMMANDE</v-btn>
                                        <v-btn v-if='order[0]["status"] === "pending"' key="1"  color="accent" class="ma-0 mt-4"  @click='switchStatus(order[0]["id"], "ready")'>COMMANDE PRÊTE</v-btn>
                                        <v-btn v-if='order[0]["status"] === "ready"' key="1"  color="success" class="ma-0 mt-4"  @click='switchStatus(order[0]["id"], "done"), emptyOrderDetails(), done = true'>COMMANDE LIVRÉE</v-btn>
                                    </transition>
                                </v-layout>


                                <v-spacer></v-spacer>
                                <v-btn outline v-if='order[0]["status"] != "canceled" && order[0]["status"] != "done"' key="2" color="error" class="ma-0 mt-4"  @click='switchStatus(order[0]["id"], "canceled"), emptyOrderDetails(), done = true'><v-icon left>cancel</v-icon> ANNULER LA COMMANDE</v-btn>
                            </v-container>
                        </v-layout>
                    </v-card>
                </v-flex>


            </v-flex>
        </v-layout>


    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {


    computed : {
        ...mapGetters([
            'orders',
            'order',
            'orderedProducts',
            'notification'
        ]),
    },


    created () {
        this.$store.dispatch('loadOrders')
    },


    data(){
        return{
            orderLoaded : false,
            selected : true,
            orderDetails : '',
            done: false
        }
    },


    methods : {

        displayOrder(orderId){
            // this.$store.dispatch('loadOrderedProducts', orderId),
            this.orderLoaded = true
        },

        loadOrders() {
            this.$store.dispatch('loadOrders')
        },

        displayOrderDetails(id) {
            this.$store.dispatch('loadOrder', id)
        },

        switchStatus(orderId, newStatus) {
            this.$store.dispatch('switchStatus', {orderId, newStatus });
            this.$store.dispatch('loadOrders');
        },

        emptyOrderDetails(){
            console.log(this.order);
            this.$store.dispatch('loadOrders');
            this.$store.order = [];

        },
        //todo : create a mixins and put showNotif()
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


    watch: {
        notification: function () {
            this.showNotif()
        }
    },
}

</script>

<style>
    .maxheight {
        min-height: 100%;
    }
    .cards_order {
        border-right: 1px solid black;
        height:100vh;
        left: 0;
        right: 0;
        overflow-y: scroll;
    }

    .order-container {
        max-width: 500px;
    }

    .selected {
        -webkit-transition: 0.2s ease-out;
        background-color: #C8E9FB;
        transform: scale(1.02);
        -webkit-box-shadow: 1px 4px 18px 5px rgba(0,0,0,0.25);
        -moz-box-shadow: 1px 4px 18px 5px rgba(0,0,0,0.25);
        box-shadow: 1px 4px 18px 5px rgba(0,0,0,0.25);
    }

    .grow { transition: all .2s ease-in-out; }
    .grow:hover {  }

    .ordered {
        animation: blink_notif 2s infinite;
        color : white;
    }

    @keyframes blink_notif {
        0%   {background-color: #2196F3;}
        50%  {background-color: #36B47B;}
        100% {background-color: #2196F3;}
    }
</style>
