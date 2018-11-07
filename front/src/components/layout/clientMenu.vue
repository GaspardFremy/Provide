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
        class="secondary"
        dark>
            <v-list>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title class="title">
                        <router-link to='/' tag='span' style="cursor:pointer">MAISON LANDEMAINE</router-link>
                    </v-list-tile-title>
                </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-group
                    prepend-icon="store"
                    value="true">
                        <v-list-tile slot="activator">
                        <v-list-tile-title>{{user[0].name}}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                    v-for="item in menuUserActions"
                    @click=""
                    :to="item.link">
                        <v-list-tile-action>
                            <v-icon v-text="item.icon"></v-icon>
                        </v-list-tile-action>
                    <v-list-tile-title v-text="item.title"></v-list-tile-title>
                </v-list-tile>
                    </v-list-group>
                        <v-divider></v-divider>
                    <v-list-group
                    prepend-icon="shopping_cart"
                    value="true">
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
                    </v-list-group>
                        <v-divider></v-divider>
                    <v-list-group
                    prepend-icon="attach_money"
                    value="true">
                        <v-list-tile slot="activator">
                            <v-list-tile-title>Invoices</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile :to="'/invoice/current'">
                            <v-list-tile-action>
                                <v-icon>calendar_today</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-title>Current</v-list-tile-title>
                        </v-list-tile>

                        <v-list-tile :to="'/invoice/history'">
                            <v-list-tile-action>
                                <v-icon>history</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-title>Previous</v-list-tile-title>
                        </v-list-tile>

                    </v-list-group>
                <v-divider></v-divider>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar
        dark
        app
        :clipped-left="clipped"
        class="secondary">
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

import { mapState } from 'vuex'

export default {

    computed: {
        ...mapState([
        'user'
        ])
    },


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
            rightDrawer: false,
            menuUserActions: [
                {icon: 'account_circle', title: 'Profil', link: '/user/profile'},
                // {icon: 'settings', title: 'Settings', link: '/profile/settings'},
            ],
            menuOrderActions: [
                {icon: 'add_shopping_cart', title: 'New Order', link: '/new/order'},
                // {icon: 'restore', title: 'Saved Order', link: '/new/savedorder'},
            ],
            cruds: [
                ['Create', 'add'],
                ['Read', 'insert_drive_file'],
                ['Update', 'update'],
                ['Delete', 'delete']
            ],
            admins: [
                ['Management', 'people_outline'],
                ['Settings', 'settings']
            ],
        }
    },
/*je veux push*/

    name: 'clientMenu',
}
</script>
