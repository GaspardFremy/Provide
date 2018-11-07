<template>
    <div>
        <v-navigation-drawer
          persistent
          :mini-variant="miniVariant"
          :clipped="clipped"
          v-model="drawer"
          enable-resize-watcher
          fixed
          app
          class="header"
          dark>
        <v-list>
            <v-list-tile>
                <v-list-tile-action>
                    <v-icon>home</v-icon>
                </v-list-tile-action>
                <v-list-tile-title class="title"><router-link to='/' tag='span' style="cursor:pointer">MAISON LANDEMAINE</router-link></v-list-tile-title>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-group
                prepend-icon="store_mall_directory"
                value="false">
                <v-list-tile slot="activator">
                    <v-list-tile-title>{{user[0].name}}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                v-for="item in menuUserActions"
                @click=""
                :to="item.link"
                isActive="false">
                    <v-list-tile-action>
                        <v-icon v-text="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title v-text="item.title"></v-list-tile-title>
                </v-list-tile>
            </v-list-group>
            <v-divider></v-divider>
            <v-list-group
                prepend-icon="dashboard"
                value="false">
                <v-list-tile slot="activator">
                    <v-list-tile-title>Dashboards</v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                v-for="item in dashboardsList"
                @click=""
                :to='item.link'>
                    <v-list-tile-action>
                        <v-icon v-text="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title v-text="item.title"></v-list-tile-title>
                </v-list-tile>
            </v-list-group>
            <!-- <v-divider></v-divider> -->
            <!-- Order board bellow is not supposed to be in the provider menu
            as long as the provider can't create an order for a client -->
            <!-- <v-list-group
                prepend-icon="shopping_cart"
                value="false">
                <v-list-tile slot="activator">
                    <v-list-tile-title>Order</v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                v-for="item in menuOrderActions"
                @click=""
                :to='item.link'>
                    <v-list-tile-action>
                        <v-icon v-text="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title v-text="item.title"></v-list-tile-title>
                </v-list-tile>
            </v-list-group> -->
            <v-divider></v-divider>
            <v-list-group class="pt-2"
                prepend-icon="person"
                value="true">
                <v-list-tile slot="activator">
                    <v-badge right color="primary">
                      <span slot="badge">{{totalClients}}</span>
                      <v-list-tile-title>Clients</v-list-tile-title>
                    </v-badge>
                </v-list-tile>
                <v-list-tile
                v-for="client in clients"
                :to="'/client/profile/' + client.id">
                <v-list-tile-title v-text="client.name"></v-list-tile-title>
                </v-list-tile>
            </v-list-group>
            <v-divider></v-divider>
        </v-list>
        </v-navigation-drawer>
        <v-toolbar
        dark
        app
        :clipped-left="clipped"
        class="header">
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-btn icon @click.stop="miniVariant = !miniVariant">
                <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>Provide Easy</v-toolbar-title>
        </v-toolbar>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { mapState } from 'vuex'

export default {

    data () {
        return {
            clipped: false,
            drawer: true,
            items: [{
                icon: 'shopping_cart',
                title: 'Order',
            },
            {
                icon: 'insert_chart',
                title: 'Invoice'
            }],
            miniVariant: false,
            right: true,
            rightDrawer: true,
            menuUserActions: [
                {icon: 'receipt', title: 'Orders', link: '/store/orders'},
                {icon: 'account_circle', title: 'Profil', link: '/profile'},
                // {icon: 'settings', title: 'Settings', link: '/profile/settings'},
            ],
            menuOrderActions: [
                {icon: 'add_shopping_cart', title: 'New Order', link: '/new/order'},
                {icon: 'restore', title: 'Saved Order', link: '/new/savedorder'},
            ],
            archivedMonth : ['January', 'Febuary', 'March', 'April', 'May'],
            dashboardsList : [
                // Sales board is not ready to be shown
                // {title : 'Sales Board', icon: 'attach_money', link : '/dashboard/salesboard'},
                {title : 'Orders Board', icon: 'list_alt', link : '/dashboard/orderboard'},
                {title : 'Clients Board', icon: 'perm_contact_calendar', link : '/dashboard/clientsboard'},
                {title : 'Invoices Board', icon: 'import_contacts', link : '/dashboard/invoicesboard'},
            ]
        }
    },


    computed: {

        ...mapGetters([
            'clients'
        ]),

        ...mapState([
            'user'
        ]),

        totalClients: function () {
            return this.clients.length
        }
    },


    created () {
        this.$store.dispatch('loadClients')
    },
}
</script>
