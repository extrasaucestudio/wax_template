<template>
	<div class="immersysapp">
		<div class="header clearfix">
			<div class="header-logo">
				<nuxt-link to="/"><img src="~/static/logos/immersys-logo.png" alt="immersys logo"/></nuxt-link>
			</div>
			<div class="header-nav">
				<ul>
					<li><NuxtLink to="/">Crafting</NuxtLink></li>
					<li><NuxtLink to="/shop">Shop</NuxtLink></li>
				</ul>
			</div>
			<div class="header-wallet">
				<UserConnected v-if="user"/>
				<ConnectWallet v-else />
			</div>
		</div>
		<div class="content">
			<notifications position="bottom right" classes="immersysnotifications"/>
			<Nuxt />
		</div>
		<Footer />
		<LoginModal />
		<EnergyModal />
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import ConnectWallet from '~/components/layout/ConnectWallet'
import UserConnected from '~/components/layout/UserConnected'
import Footer from '~/components/layout/Footer.vue'
import LoginModal from '~/components/modals/Login.vue'
import EnergyModal from '~/components/modals/Energy.vue'

export default {
	components: {
    ConnectWallet,
    UserConnected,
		LoginModal,
		EnergyModal,
		Footer,
  },
  computed: {
    ...mapState(['user'])
  },
	head() {
		return {
			bodyAttrs: {
				class: 'immersysapp'
			}
		}
	}
}
</script>

<style>
	@font-face {
	    font-family: 'Rajdhani';
	    src: url('~/static/fonts/Rajdhani/Rajdhani-Bold.woff2') format('woff2'),
	        url('~/static/fonts/Rajdhani/Rajdhani-Bold.woff') format('woff');
	    font-weight: bold;
	    font-style: normal;
	    font-display: swap;
	}

	@font-face {
	    font-family: 'Rajdhani';
	    src: url('~/static/fonts/Rajdhani/Rajdhani-Light.woff2') format('woff2'),
	        url('~/static/fonts/Rajdhani/Rajdhani-Light.woff') format('woff');
	    font-weight: 300;
	    font-style: normal;
	    font-display: swap;
	}

	@font-face {
	    font-family: 'Rajdhani';
	    src: url('~/static/fonts/Rajdhani/Rajdhani-Regular.woff2') format('woff2'),
	        url('~/static/fonts/Rajdhani/Rajdhani-Regular.woff') format('woff');
	    font-weight: normal;
	    font-style: normal;
	    font-display: swap;
	}

	@font-face {
	    font-family: 'Rajdhani';
	    src: url('~/static/fonts/Rajdhani/Rajdhani-Medium.woff2') format('woff2'),
	        url('~/static/fonts/Rajdhani/Rajdhani-Medium.woff') format('woff');
	    font-weight: 500;
	    font-style: normal;
	    font-display: swap;
	}

	@font-face {
	    font-family: 'Rajdhani';
	    src: url('~/static/fonts/Rajdhani/Rajdhani-SemiBold.woff2') format('woff2'),
	        url('~/static/fonts/Rajdhani/Rajdhani-SemiBold.woff') format('woff');
	    font-weight: 600;
	    font-style: normal;
	    font-display: swap;
	}

	.vue-notification-template.immersysnotifications {
		background: #292929;
		padding: 10px;
	}
	.vue-notification-template.immersysnotifications.success {
		background: #66a663;
	}
	.vue-notification-template.immersysnotifications.warning {
		background: #ca8744;
	}
	.vue-notification-template.immersysnotifications.error {
		background: #ca4444;
	}
	.vue-notification-template.immersysnotifications .notification-content {
		line-break: anywhere;
	}
  .vue-notification-template.immersysnotifications .notification-content a {
  	text-decoration: underline;
  	color: #fff;
  }

	.clearfix::after {
		content: "";
		clear: both;
		display: table;
	}
	.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
 
    text-align: center;
  }
  .modal-layerclose {
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  .modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    background: #030033;
    z-index: 2;
  }
  .modal-content .modal-xmark {
    display: inline-block;
    font-size: 30px;
    position: absolute;
    right: 10px;
    top: 15px;
    padding: 0 5px;
    background: #393ba7;
    border: 1px solid #2b3990;
    transition: 0.2s;
    cursor: pointer;
  }
  .modal-content .modal-xmark:hover {
    background: #24307a;
  }

  @media only screen and (max-width: 480px) {
    .modal-content { width: 380px; }
  }
  @media only screen and (max-width: 576px) {
    .modal-content { width: 470px; }
  }
	.immersys-button {
		background: #393ba7;
		border: 1px solid #2b3990;
		border-radius: 20%;
		padding: 5px 10px;
		text-align: center;
		font-family: 'Rajdhani';
		font-weight: bold;
		font-size: 18px;
		color: #fff;
		transition: 0.2s;
		cursor: pointer;
	}
	.immersys-button:hover {
		background: #24307a;
	}
	.immersys-button.disabled {
		cursor: not-allowed;
		border: 1px solid #7b7b7b;
		background: #7b7b7b;
	}
	.immersys-button.disabled:hover {
		background: #7b7b7b;
	}
	a {
		color: #bcf8ff;
		text-decoration: none;
		transition: 0.2s;
	}
	a:hover {
		color: #70e6ff;
	}
	select {
		font-family: 'Rajdhani';
		background: #292929;
    color: #fff;
    box-shadow: none;
    border: none;
    font-size: 16px;
    font-weight: bold;
	}

	/** fix for footer bottom **/
	html, body, #__nuxt {
		height: 100%;
	}
	#__layout {
		min-height:100%;
   	position:relative;
	}

	/** layout css **/
	body {
		background: #030033;
		font-family: 'Rajdhani';
		color: #fff;
		margin: 0;
		padding: 0;
	}
	.header, .content {
		padding: 0 35px;
	}
	.header {
		height: 70px;
		background: #000;
	}
	.header .header-logo,
	.header .header-nav {
		display: inline-block;
	}
	.header .header-logo img {
		max-height: 60px;
	}

	.header .header-nav {
		height: 100%;
		margin-left: 40px;
		vertical-align: top;
	}
	.header .header-nav ul {
		height: 100%;
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: flex;
		align-items: center;
	}
	.header .header-nav ul li {
		display: inline-block;
		margin-right: 20px;
	}
	.header .header-nav ul li a {
		font-size: 20px;
		position: relative;
		color: #fff;
	}

	.header .header-nav ul li a.nuxt-link-exact-active,
	.header .header-nav ul li a:hover {
		color: #70e6ff;
	}

	.header .header-nav ul li a.nuxt-link-exact-active::after,
	.header .header-nav ul li a:hover::after {
		display: block;
		content: '';
		position: absolute;
		bottom: -5px;
		width: 100%;
		height: 2px;
		background: #70e6ff;
	}

	.header .header-wallet {
		display: flex;
	  justify-content: center;
	  align-items: center;
		float: right;
		height: 100%;
	}
	.content {
		padding-bottom: 30px; /** footer size **/
	}

	.immersys-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    text-align: left;
  }
  .immersys-list > li {
    display:inline-block;
    background: #292929;
    vertical-align: top;
    width: 160px;
    margin: 0 20px 20px 0;
    padding: 0 10px 20px;
  }
  .immersys-list .immersys-img {
    text-align: center;
  }
  .immersys-list .immersys-img img {
    display: inline-block;
    max-width: 100%;
  }
  .immersys-list .immersys-iteminfo p {
  	margin: 0;
  	margin-top: 10px;
  	text-align: center;
  }
  .immersys-list .immersys-iteminfo .price {
  	font-size: 18px;
  	font-weight: bold;
  	color: #70e6ff;
  }
  .immersys-list .immersys-materials {
    list-style-type: none;
    margin: 0;
    padding: 0;
    text-align: left;
  }
  .immersys-list .immersys-materials > li {
  	margin-top: 10px;
  }
  .immersys-list .immersys-materials > li p {
  	margin: 0;
  }
  .immersys-list .immersys-materials span.amount {
    font-weight: bold;
  }
  .immersys-list .immersys-materials span.amountOK {
    color: #77b473;
  }
  .immersys-list .immersys-materials span.amountKO {
    color: #b43444;
  }
  .immersys-list .immersys-action {
    text-align: center;
  }

  /** ugly need refactoring button **/
  .immersys-list .immersys-action .immersys-button {
  	margin-top: 10px;
    width: 100%;
  }
  .immersys-list .immersys-action .immersys-button.disabled {
  	margin-top: 10px;
    width: auto;
  }
  .immersys-nolist {
    margin-top: 50px;
    text-align: center;
  }
</style>