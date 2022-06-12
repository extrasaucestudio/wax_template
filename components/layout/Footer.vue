<template>
	<div class="footer clearfix">
		<div class="footer-credit"><p>App crafted by <a href="https://twitter.com/Wapaca" target="_blank">Wapaca</a></p></div>
		<div class="footer-copyright"><p>&copy; 2022 <a href="https://immersys.io/" target="_blank">Immersys</a></p></div>
	</div>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style scoped>
.footer {
	position:absolute;
	bottom:0;
	left: 0;
	right: 0;
	height: 30px;
	line-height: 30px;
	text-align: center;
	background: #000;
	padding: 0 35px;
}
.footer-credit, .footer-copyright {
	display: inline-block;
}
.footer-credit {
	float: right;
	font-size: 14px;
}
p {
	margin: 0;
	padding: 0;
}

</style>
