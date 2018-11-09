<template lang="html">
    <div class="">
        <v-layout row wrap align-content-center>
            <h6 class="title primary--text pa-4 pl-1">Nouvelle Commande</h6>
            <div class="pa-3">
                <v-dialog v-model="dialog1" width="500">
                    <v-btn
                    slot="activator" outline fab small class="pa-0 ma-0" color="success">
                        <h3>?</h3>
                    </v-btn>

                    <v-card>
                        <v-card-title
                        class="headline grey lighten-2 text-xs-cente"
                        primary-title>Comment utiliser l'interface </v-card-title>

                        <v-card-text>
                            1. selectionez une catégorie. <br><br>
                            2. Cliquez sur l'icon <v-icon dark color="success">photo_camera</v-icon> pour voir la photo du produit. <br><br>
                            3. Vous pouvez cliquer-glisser le produit dans le panier, ou directement selectioner une quantité, ce qui l'ajoutera automatiquement au panier <br>
                            4. Retirez les produits du panier en cliquant sur l'icon
                            <v-btn left fab small class="error remove_btn">
                                 <v-icon class="">close</v-icon>
                             </v-btn> <br><br>
                            4. Choissisez ensuite une date et une heure de livraison. <br><br>
                            5. Confirmez votre commande<br><br>
                            6. Si nécéssaire, sauvergardez votre commande au moment de la confirmation, vous la retrouverz ensuite dans l'onglet "commandes sauvegardée" en cliquant sur l'icon <v-icon>restore</v-icon> <br><br>
                            7. Suivez l'état de votre commande en vous rendant sur votre profil en cliquand sur l'icon <v-icon>account_circle</v-icon>  puis l'icon <v-icon>info</v-icon>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                            color="primary"
                            flat
                            @click="dialog1 = false">
                                J'ai compris
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </v-layout>

        <v-container grid-list-xs,sm,md,lg,xl>
            <v-layout>
                <v-flex xs12>
                    <v-btn flat color="primary" outline @click='switchCategory("pains")'><img src="@/assets/icon/pain.png" class="category_icon pr-3 pl-0">Pains</v-btn>
                    <v-btn flat color="primary" outline @click='switchCategory("vienoiseries")'><img src="@/assets/icon/croissant.png" class="category_icon pr-3 pl-0">Vienoiseries</v-btn>
                    <v-btn flat color="primary" outline @click='switchCategory("pâtisseries")'><img src="@/assets/icon/muffin.png" class="category_icon pr-3 pl-0">Pâtisseries</v-btn>
                    <v-btn flat color="primary" outline @click='switchCategory("autre")'><img src="@/assets/icon/autre.png" class="category_icon pr-3 pl-0">Autres</v-btn>
                </v-flex>
            </v-layout>
            <v-container  grid-list-xs>
                <v-layout row wrap>
                    <v-flex xs9>
                        <draggable element="v-layout" wrap  v-model="products" :options="{group:'panier'}" @start="drag=false"  :ghmove="checkMove" class="xs-3">
                            <v-flex v-for="product in products" xs3 justify-space-around class="ma-1">
                                <v-card class="products product_card" >
                                    <v-card-title primary-title>
                                        <v-flex  xs8>
                                          <div class="card_info subheading">{{product.name}}</div>
                                          <template v-if="product.name.length < 15"><br></template>
                                          <div class="card_info subheading pt-3">{{product.price}}€</div>
                                          <p>total : {{Math.round((product.quantity * product.price) * 100) / 100}} €</p>
                                        </v-flex>
                                        <v-spacer></v-spacer>
                                        <v-flex primary-title xs4>
                                          <v-layout>
                                              <v-flex offset-xs5>
                                                  <v-tooltip bottom>
                                                     <v-icon slot="activator" dark color="info" class="camera">photo_camera</v-icon>
                                                     <span><img :src="getPic(product.imgURL)" alt="">  </span>
                                                  </v-tooltip>
                                              </v-flex>
                                          </v-layout>
                                          <v-layout class="mt-2">
                                              <v-select
                                               :items="productAmount"
                                               v-model="product.quantity"
                                               label="0"
                                               single-line
                                               append-icon="add_circle_outline"
                                               @change="appendProduct(product)"
                                             ></v-select>
                                          </v-layout>
                                        </v-flex>
                                    </v-card-title>
                                </v-card>
                            </v-flex>
                        </draggable>
                    </v-flex>

                    <v-flex xs3>
                        <v-card>
                            <p class="title text-md-center pt-3">Panier</p>
                            <draggable v-model="cart" :options="{group:'panier'}">
                                <div v-if="cart.length < 1" class="subheading text-md-center drag_here">Déposez ici vos articles</div>
                                <v-flex  v-for="(item, index) in cart">
                                  <v-card class="ma-1">
                                    <v-card-title primary-title>
                                      <v-flex  xs9>
                                          <div class="card_info subheading">{{item.name}}</div>
                                          <div class="card_info subheading pt-3">{{item.price}}€</div>
                                           <p>total : {{Math.round((item.quantity * item.price) * 100) / 100}}€</p>
                                      </v-flex>
                                      <v-spacer></v-spacer>
                                      <div class="borderLeft">
                                          <v-flex primary-title xs3>
                                              <v-spacer></v-spacer>
                                              <v-btn @click="removed(index, item.id)" left fab small class="error mb-3 remove_btn">
                                                  <v-icon class="pa-3">close</v-icon>
                                              </v-btn>
                                              <v-select
                                               :items="productAmount"
                                               v-model="item.quantity"
                                               label="0"
                                               single-line
                                               auto
                                               append-icon="add_circle_outline"
                                               hide-details></v-select>
                                          </v-flex>
                                      </div>

                                    </v-card-title>
                                  </v-card>
                                </v-flex>
                            </draggable>

                            <v-container>
                                <v-menu
                                ref="menu2"
                                :close-on-content-click="false"
                                v-model="menu1"
                                :nudge-right="40"
                                :return-value.sync="date"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px">
                                    <v-text-field
                                      slot="activator"
                                      v-model="date"
                                      label="Choissisez une date"
                                      prepend-icon="event"
                                      readonly></v-text-field>
                                    <v-date-picker v-model="date" :allowed-dates="allowedDates" @input="$refs.menu2.save(date)"></v-date-picker>
                                </v-menu>
                                <v-menu
                                ref="menu"
                                :close-on-content-click="false"
                                v-model="menu2"
                                :nudge-right="40"
                                :return-value.sync="time"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px">
                                    <v-text-field
                                      slot="activator"
                                      v-model="time"
                                      label="Choissisez une heure"
                                      prepend-icon="access_time"
                                      readonly></v-text-field>
                                    <v-time-picker format="24hr" v-model="time"  min="7:30" max="19:30" @change="$refs.menu.save(time)"></v-time-picker>
                                </v-menu>

                                <table class="mt-5">
                                    <tr>
                                       <td><span>PRIX TOTAL HT : </span></td>
                                       <td><span class="subtitle pl-5">{{Math.round(this.totalCart * 100) / 100}}  €</span></td>
                                     </tr>
                                     <v-spacer class="mt-3"></v-spacer>
                                     <tr>
                                        <td><span>PRIX TTC <br> (TVA 5,5%) : </span></td>
                                        <td><span class="subtitle pl-5"> {{getTotalTTC(this.totalCart)}} €</span></td>
                                      </tr>
                                      <v-spacer class="mt-3"></v-spacer>
                                     <tr>
                                        <td><span class="mt-5">APRÈS - 10% : </span></td>
                                        <td><span class="title pl-5">{{getTotalReduc(getTotalTTC(this.totalCart))}} €</span></td>
                                      </tr>
                                </table>
                                <v-layout class="mt-5"row justify-center>
                                    <v-dialog v-model="dialog" persistent max-width="290">
                                      <v-btn :disabled='!cartIsNotEmpty()' slot="activator" color="primary" class="white--text">passer commande</v-btn>
                                      <v-card>
                                        <v-container v-if="!cartIsNotEmpty()">
                                            <p>Veuillez remplire le panier, renseigner une date et une heure de livraison <br>  </p>
                                            <v-btn color="warning" flat @click.native="dialog = false">retour au panier</v-btn>
                                        </v-container>

                                        <div v-else>
                                            <v-card-title class="title pb-2">Détail de la commande</v-card-title>
                                            <v-container>
                                                <v-layout row wrap v-for='product in cart'>
                                                    <v-flex>
                                                        <p>{{product.name}} x {{product.quantity}}</p>
                                                    </v-flex>
                                                </v-layout>

                                                <v-layout row wrap class="pt-2">
                                                    <v-flex>
                                                        <p>Pour le 12/08 à 19h</p>
                                                    </v-flex>
                                                </v-layout>
                                                <!-- The 'saved order' feature is not ready yet. Code below is not necessary -->
                                                <!-- <div @click="showInput = !showInput">
                                                    <v-checkbox
                                                     class="check"
                                                     v-model="checkbox"
                                                     value="1"
                                                     label="Sauvegarder la commande"
                                                     data-vv-name="checkbox"
                                                     type="checkbox"
                                                     required></v-checkbox>
                                                </div> -->
                                                 <transition name="fade">
                                                    <div v-if="showInput" class="pt-2">
                                                       <v-text-field
                                                       label="Nomez votre commande"
                                                       placeholder="Ex: Mardi matin"
                                                       v-model="orderName"
                                                       outline
                                                       required></v-text-field>
                                                   </div>
                                                  </transition>
                                            </v-container>
                                            <v-card-actions>
                                                <v-layout justify-space-around>
                                                    <v-flex>
                                                        <v-btn color="warning" flat @click.native="dialog = false">modifier</v-btn>
                                                    </v-flex>
                                                    <v-flex>
                                                        <router-link to="/user/profile"><v-btn color="info" flat @click.native="dialog = false" @click="takeOrder(cart)">confirmer</v-btn></router-link>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card-actions>
                                        </div>
                                      </v-card>
                                    </v-dialog>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-container>
    </div>
</template>

<script>

import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'

export default {


    components: {
        draggable
    },


    data(){
        return {
            orderName: null,
            showInput : false,
            checkbox: 0,
            date: null,
            time: null,
            menu: false,
            modal: false,
            menu1: false,
            menu2: false,
            drag: true,
            isActive: false,
            testapi:'' ,
            dialog1: false,
            dialog: false,
            truc: 0,
            productAmount: [
             0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20
            ]
        }
    },


    created () {
        this.$store.dispatch('loadProducts', 'pains')
    },


    computed: {

        ...mapGetters([
            'totalCart',
            'user',
            'products'
        ]),

        cart: {
            get() {
                return this.$store.state.cart
            },
            set(value) {
                this.$store.commit('setCart', value)
            }
        },

        products: {
            get() {
                return this.$store.state.products
            },
            set(value) {
                this.$store.commit('setProducts', value)
            }
        },

        dragOptions () {
           return  {
             animation: 0,
             group: {
                 name: 'panier',
                 pull: 'clone',
                 put: false,
               },
            };
         },

        getId(product) {
            console.log('ok');
        }
    },


    methods: {

        switchCategory(payload){
            this.$store.dispatch('loadProducts', payload)
        },

        appendProduct: function(value){
            this.$store.commit('setCartBySelect', value);
        },

        removed: function(index, productId) {
            let payload = {index, productId}
            this.$store.commit('removeProduct', payload)
        },

        onMove ({relatedContext, draggedContext}) {
            const relatedElement = relatedContext.element;
            const draggedElement = draggedContext.element;
            return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
        },

        checkMove: function(evt){
            return (evt.draggedContext.element.name!=='apple');
        },

        // :todo get product's id within the evt param for setting cart
        // onEnd: function(evt){
        //     // console.log("new index :"),
        //     // console.log(evt),
        //     // console.log(this.cart),
        //     // console.log("id")
        //
        //     // console.log(evt.to.__vue__.el.__vue__.value[0].id)
        //
        //     // console.log(evt.to.__vue__.el.__vue__)
        //     //
        // },

        allowedDates: function allowedDates(val) {
            return ![1].includes(new Date(val).getDay());
        },

        takeOrder(payload){
            let order = {
                products : payload,
                clientId : this.user[0].id,
                deadlineDate : this.date,
                deadlineTime : this.time,
                saved : this.checkbox,
                orderName : this.orderName
            }
            this.$store.dispatch('takeOrder', order)
        },

        cartIsNotEmpty(){
            return this.cart.length > 0 && this.date != null && this.time != null

        },

        getPic(imgURL) {
             return require('@/assets/products/' + imgURL + '.jpg')
        },

        getTotalTTC(total) {
            return Math.round( ((total * 5.5 / 100) + total ) * 100) / 100
        },

        getTotalReduc(total) {
            return Math.round((total - (total * 10/100)) * 100) / 100
        },
    },


     watch: {
       isDragging (newValue) {
         if (newValue){
           this.delayedDragging = true
           return
         }
         this.$nextTick( () =>{
              this.delayedDragging = false
         })
       }
    },

}
</script>

<style lang="css">
    .card_info {
        color: #9A9A9A;
    }

    .input-group__details {
        display: none;
    }

    .input-group--select .input-group__selections {
        width: 20px;
    }

    .card__title{
        padding: 10px;
    }

    .card__title--primary{
        padding: 10px;
    }

    .btn--floating{
        height: 20px;
        width: 20px;
    }

    .drag_here {
        border: 1px dashed #635BCF;
        padding: 10px;
        margin: 10px;
    }

    .product_card {
        min-width: 210px;
        min-height: 150px;
    }

    .category_icon {
        height: 20px;
    }

    .check label {
        font-size: 13px;
    }

    .remove_btn {
        width: 25px !important;
        height: 25px !important;
    }

    .camera {
        padding-bottom: 15px;
    }
</style>
