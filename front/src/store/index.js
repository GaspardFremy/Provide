import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VuexPersist from 'vuex-persist';

const $axios = 'http://localhost:3000';

Vue.use(Vuex)
Vue.use(VueAxios, axios)

const vuexLocalStorage = new VuexPersist({
	key: 'vuex',
	storage: window.localStorage,
	reducer: (state) => ({
		user: state.user,
		clients: state.clients
	}),
})

export const store = new Vuex.Store({
	state: {
		clientInfo: [],
		clients: [],
		logErr: [],
		user: [],
		cart: [],
		products: [],
		orders: [],
		order: [],
		orderedProducts: [],
		orderDetails: [],
		clientCurrentMonthOrders: [],
		clientDailyOrders: [],
		clientMonthlyOrders : [],
		invoiceStatusByMonth: [],
		isPayed:[],
		invoices: [],
		allInvoices:[],
		savedOrders: [],
		clientOrders: [],
		allOrders: [],
		notification: [],
		i: 0,
	},
	mutations: {
		// CLIENT NEW ORDER
		setCartBySelect: (state, value) => {
			let existingProduct = state.cart.find(function(obj) {
				return obj.id === value.id;
			});

			if (existingProduct) {
				value.quantity++;
			} else {
				state.cart.push(value);
			}
		},
		setCart: (state, value) => {
			//First check if product is allready in cart.
            //Todo : get directly the product's id. Cause getting it by index leads to crappy bugs
			let productId = value[value.length - 1].id;

			var existingProduct = state.cart.find(function(obj) {
				return obj.id === productId;
			});
			//If so, iterate quantity
			if (existingProduct) {
				existingProduct.quantity++;
			}
			//If not, set it with quantity = 1
			else {
				value[value.length - 1].quantity = 1
				state.cart = value
			}
		},
		setProducts: (state, value) => {
			state.products = state.products
		},
		removeProduct: (state, payload) => {
			state.cart.splice(payload.index, 1);
			let productIndex = state.products.findIndex(x => x.id === payload.productId);
			state.products[productIndex].quantity = 0;
		},
		SET_PRODUCTS(state, products) {
			state.products = products
		},


		// CLIENT SAVED ORDERS
		SET_SAVED_ORDERS(state, savedOrders) {
			state.savedOrders = savedOrders
		},
		SET_CLIENTS_ORDERS(state, clientOrders) {
			state.clientOrders = clientOrders
		},
		SET_CLIENTS_CURRENT_MONTH_ORDERS(state, clientCurrentMonthOrders) {
			state.clientCurrentMonthOrders = clientCurrentMonthOrders
		},
		SET_CLIENTS_DAILY_ORDER(state, clientDailyOrders) {
			state.clientDailyOrders = clientDailyOrders
		},

		SET_CLIENTS_MONTHLY_ORDER(state, clientMonthlyOrders) {
			state.clientMonthlyOrders = clientMonthlyOrders
		},

		SET_INVOICE_STATUS_BY_MONTH(state, invoiceStatusByMonth) {
			state.invoiceStatusByMonth = invoiceStatusByMonth
			state.isPayed = invoiceStatusByMonth[0]['status']
		},

		SET_INVOICES(state, invoices){
			state.invoices = invoices;
		},


		// STORE ORDERS
		SET_STORE_ORDERS(state, orders) {
			state.orders = orders
		},
		SET_STORE_ORDER(state, order) {
			state.order = order
		},
		SET_ALL_ORDERS(state, allOrders) {
			state.allOrders = allOrders
		},
		SET_ORDER_DETAILS(state, orderedProducts) {
			state.orderedProducts = orderedProducts
		},
		SET_NOTIF(state, notifInfo) {
			state.notification = notifInfo
		},
		RESET_NOTIF(state) {
			state.notification = null
		},


		//STORE's CLIENTS
		SET_CLIENT_INFO(state, clientInfo) {
			state.clientInfo = clientInfo
		},

		SET_CLIENTS(state, clients) {
			state.clients = clients
		},

		SET_ALL_INVOICES(state, allInvoices) {
			state.allInvoices = allInvoices
		},

		// AUTH SYSTEM
		SET_USER(state, userInfo) {
			state.user = userInfo
		},
		CLEAR_ERR(state) {
			state.logErr = null
		},
		SET_LOGERR(state, logErr) {
			state.logErr = logErr
		},
		LOGOUT(state) {
			state.user = []
		}
	},

	actions: {
		//STORE NEW CLIENT
		submitNewClient({commit, dispatch}, clientInfo) {
			axios
				.post($axios + '/users/new/client', {
					clientInfo: clientInfo
				})
				.then(function(response) {
					commit('SET_NOTIF', response);
					dispatch('loadClients')
				})
				.catch(function(error) {
					console.log(error);
				});
		},


		// CLIENT NEW ORDER
		loadProducts({commit}, payload) {
			axios
				.get($axios + '/products/' + payload)
				.then(r => r.data)
				.then(products => {
					commit('SET_PRODUCTS', products)
				})
		},

		takeOrder({commit}, order) {
			axios
				.post($axios + '/orders/new', {
					order: order
				})
				.then(function(response) {
					commit('SET_NOTIF', response);
				})
				.catch(function(error) {
					console.log(error);
				});
		},

		// CLIENT SAVED ORDERS
		loadSavedOrders({commit}, payload) {
			axios
				.get($axios + '/orders/saved/' + payload)
				.then(r => r.data)
				.then(savedOrders => {
					commit('SET_SAVED_ORDERS', savedOrders)
				})
		},

		// CLIENT ORDERS
		loadClientOrders({commit}, payload) {
			function getClientOrders({commit}, payload) {
				axios
					.get( $axios + '/orders/client/' + payload.id)
					.then((response) => {
						for (let item of response.data) {
							item.name = item.name.split(',')
							item.quantity = item.quantity.split(',')
							item.price = item.price.split(',')
							item.total = 0
							for (var i = 0; i < item.quantity.length; i++) {
								let quantity = item.quantity[i]
								let price = item.price[i]
								item.total += quantity * price
							}
							item.productQuantity = item.name.map((e, i) => e + " x " + item.quantity[i])
						}
						commit('SET_CLIENTS_ORDERS', response.data)
					})
			}
			console.log(payload);
			//Get the data a first time

			// If it's a call from the provider side, do only one call.
			if(payload.destination === "adminView"){
				getClientOrders({commit}, payload);
			}

			// If it's a call from the client side update orders every 10s
			if(payload.destination === "clientView"){
				getClientOrders({commit}, payload);
				setInterval(() => {
					getClientOrders({commit}, payload);
				}, 10000)
			}

		},

		// CLIENT ORDERS
		loadClientCurrentMonthOrders({commit}, payload) {
			function getclientCurrentMonthOrders({commit}, payload) {
				axios
					.get( $axios + '/invoices/currentMonth/' + payload)
					.then((response) => {
						commit('SET_CLIENTS_CURRENT_MONTH_ORDERS', response.data)
					})
			}
			//Get the data a first time
			getclientCurrentMonthOrders({commit}, payload);
		},


		// CLIENT ORDERS
		loadClientDailyOrder({commit}, payload) {
			function getClientDailyOrder({commit}, payload) {
				axios
					.get( $axios + '/invoices/currentMonthByDay/' + payload.day +'/'+ payload.clientId)
					.then((response) => {
						commit('SET_CLIENTS_DAILY_ORDER', response.data)
					})
			}
			getClientDailyOrder({commit}, payload);
		},

		// CLIENT ORDERS
		loadClientMonthlyOrder({commit, dispatch}, payload) {
			function getClientMonthlyOrder({commit, dispatch}, payload) {
				axios
					.get( $axios + '/invoices/currentYearByMonth/' + payload.month +'/'+ payload.clientId)
					.then((response) => {
						commit('SET_CLIENTS_MONTHLY_ORDER', response.data)
						dispatch('checkInvoiceStatus', payload);
					})
			}
			getClientMonthlyOrder({commit, dispatch}, payload);
		},

		// CHECK INVOICES STATUS BY MONTH
		checkInvoiceStatus({commit}, payload) {
			function getInvoiceStatus({commit}, payload) {
				axios
					.get( $axios + '/invoices/statusByMonth/' + payload.month +'/'+ payload.clientId)
					.then((response) => {
						commit('SET_INVOICE_STATUS_BY_MONTH', response.data)
					})
			}
			getInvoiceStatus({commit}, payload);
		},

		// LOAD EVERY INVOICES FOR A GIVEN CLIENT
		loadInvoices({commit}, payload) {
			function getInvoices({commit}, payload) {
				axios
					.get( $axios + '/invoices/all/'+ payload)
					.then((response) => {
						commit('SET_INVOICES', response.data)
					})
			}
			getInvoices({commit}, payload);
		},


		// STORE ORDERS (not the done or canceled ones)
		loadOrders({commit}) {
			//First request
			axios.get($axios + '/orders/').then((response) => {
				for (let item of response.data) {
					item.name = item.name.split(',')
					item.quantity = item.quantity.split(',')
					item.price = item.price.split(',')
					item.total = 0
					for (var i = 0; i < item.quantity.length; i++) {
						let quantity = item.quantity[i]
						let price = item.price[i]
						item.total += quantity * price
					}
					item.productQuantity = item.name.map((e, i) => e + " x " + item.quantity[i])
				}
				commit('SET_STORE_ORDERS', response.data)
			})


			// Then update orders every 10s
			// this if i = 0 condition is here to prevent the setInterval
			// to launch each time the user is clicking back on 'orders'.
			// If this is the case, the api call is made 1 time every 10s
			// * number  of clik
			if (this.state.i === 0){
				this.state.i = 1;
				setInterval(() => {
					console.log('updating orders');
					axios.get($axios + '/orders/').then((response) => {
						commit('SET_STORE_ORDERS', response.data)
					})
				}, 10000)
			}

		},

		//load one unique order
		loadOrder({commit}, payload) {
			axios.get($axios + '/orders/' + payload).then((response) => {
				for (let item of response.data) {
					item.name = item.name.split(',')
					item.quantity = item.quantity.split(',')
					item.price = item.price.split(',')
					item.total = 0
					for (var i = 0; i < item.quantity.length; i++) {
						let quantity = item.quantity[i]
						let price = item.price[i]
						item.total += quantity * price
					}
					item.productQuantity = item.name.map((e, i) => e + " x " + item.quantity[i])
				}
				commit('SET_STORE_ORDER', response.data)
			})
		},

		//ALL ORDERS
		loadAllOrders({commit}) {
			//First request
			axios.get($axios + '/orders/all').then((response) => {
					for (let item of response.data) {
						item.name = item.name.split(',')
						item.quantity = item.quantity.split(',')
						item.price = item.price.split(',')
						item.total = 0
						for (var i = 0; i < item.quantity.length; i++) {
							let quantity = item.quantity[i]
							let price = item.price[i]
							item.total += quantity * price
						}
						item.productQuantity = item.name.map((e, i) => e + " x " + item.quantity[i])
					}
					commit('SET_ALL_ORDERS', response.data)
				})

			// Then update orders every 100s
			setInterval(() => {
				axios.get($axios + '/orders/all').then((response) => {
					commit('SET_ALL_ORDERS', response.data)
				})
			}, 100000)
		},

		// EDIT ORDER STATUS
		patchOrderStatus({commit, dispatch}, payload) {
			function editOrderStatus({commit, dispatch}, payload) {
				axios
					.patch( $axios + '/orders/editStatus/' + payload.orderId +'/'+ payload.status)
					.then((response) => {
						commit('SET_NOTIF', response);
						dispatch('loadAllOrders')
					})
			}
			editOrderStatus({commit, dispatch}, payload);
		},

		loadOrderedProducts({commit}, orderId) {
			axios.get($axios + '/orders/' + orderId).then((response) => {
				commit('SET_ORDER_DETAILS', response.data)
			})
		},

		switchStatus({commit,dispatch}, payload) {
			let id = payload.orderId;
			// let newCategory = payload.newCategory
			axios
				.patch($axios + '/orders/changestatus', {
					order: payload
				})
				.then(function(response) {
					commit('SET_NOTIF', response);
					dispatch('loadOrder', payload.orderId);
				})
				.catch(function(error) {
					console.log(error);
				});
		},


		//STORE'S CLIENT INFO GIVEN AN ID
		loadClientInfo({commit}, payload) {
			axios.get($axios + '/users/client/' + payload).then((response) => {
				commit('SET_CLIENT_INFO', response.data)
			})
		},

		// STORE's CLIENT
		loadClients({commit}) {
			axios.get($axios + '/users/clients/').then((response) => {
				commit('SET_CLIENTS', response.data)
			})
		},

		// STORE'S CLIENT INVOICES
		loadAllInvoices({commit}) {
			axios.get($axios + '/invoices/all/').then((response) => {
				commit('SET_ALL_INVOICES', response.data)
			})
		},

		// EDIT CLIENT INVOICES STATUS
		patchInvoiceStatus({commit, dispatch}, payload) {
			function editInvoiceStatus({commit, dispatch}, payload) {
				axios
					.patch( $axios + '/invoices/editStatus/' + payload.invoiceId +'/'+ payload.status)
					.then((response) => {
						commit('SET_NOTIF', response);
						dispatch('loadAllInvoices')
					})
			}
			editInvoiceStatus({commit, dispatch}, payload);
		},

		//AUTH SYSTEM
		connect({commit}, connectInfo) {
			axios
				.post($axios + '/users/connect', {
					connectInfo: connectInfo
				})
				.then(function(response) {
					if (typeof(response.data) == 'object') {
						commit('SET_USER', response.data);
						commit('CLEAR_ERR');
					} else {
						commit('SET_LOGERR', response.data);
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},

		logout({commit}) {
			commit('LOGOUT');
		}
	},
	getters: {
		// CLIENTS
		clients(state) {
			return state.clients
		},

		client(state) {
			return (id) => {
				return state.clients.find((clients) => {
					return clients.id === id
				})
			}
		},

		topClients(state) {
			return state.clients.sort((clientA, clientB) => {
				return clientA.revenues < clientB.revenues
			})
		},

		// CLIENT NEW ORDER
		products(state) {
			return state.products
		},

		cart(state) {
			return state.cart
		},

		count(state) {
			return state.count
		},

		totalCart(state) {
			let total = 0;
			for (var i = 0; i < state.cart.length; i++) {
				total = total + state.cart[i].price * state.cart[i].quantity
			}
			return total
		},


		// CLIENT SAVED ORDERS
		savedOrders(state) {
			return state.savedOrders
		},

		// CLIENT ORDERS
		clientOrders(state) {
			return state.clientOrders
		},

		// CLIENT CURRENT MONTH ORDERS
		clientCurrentMonthOrders(state){
			return state.clientCurrentMonthOrders
		},

		// CLIENT MONTHLY ORDERS BY DAY
		clientDailyOrders(state){
			return state.clientDailyOrders
		},

		// CLIENT MONTHLY ORDERS BY DAY
		clientMonthlyOrders(state){
			return state.clientMonthlyOrders
		},

		// INVOICE STATUS FOR A GIVEN MONTH
		invoiceStatusByMonth(state){
			return state.invoiceStatusByMonth
		},

		// INVOICE STATUS FOR A GIVEN MONTH
		invoices(state){
			return state.invoices
		},

		//CHECK IF AN INVOICE IS PAYED
		isPayed(state){
			return state.isPayed
		},



		// STORE ORDERS
		orders(state) {
			return state.orders
		},
		order(state) {
			return state.order
		},

		orderedProducts(state) {
			return state.orderedProducts
		},

		orderDetails(state) {
			return state.orderDetails
		},

		allOrders(state) {
			return state.allOrders
		},


		//STORE's CLIENTS
		clients(state) {
			return state.clients
		},

		//STORE'S CLIENTS INVOICES
		allInvoices(state) {
			return state.allInvoices
		},

		// NOTIFICATION
		notification(state) {
			return state.notification
		},

		// CLIENT INFO GIVEN AN ID
		clientInfo(state) {
			return state.clientInfo
		},

		//USER Auth
		user(state) {
			return state.user
		},

		logErr(state) {
			return state.logErr
		}
	},
	plugins: [vuexLocalStorage.plugin],
})
