<template lang="html">
  <div>
    <div class="loading-title">
      <h1 class="loader--title">Loading Data</h1>
    </div>
    <div class="data-loader" />
  </div>
</template>

<script>
export default {
  name: 'Loading',
};
</script>

<style lang="css">
.loading-title {
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  line-height: 34px;
}
.data-loader,
.data-loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.data-loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid #2c82c5;
  border-right: 1.1em solid #f3f3f3;
  border-bottom: 1.1em solid #f3f3f3;
  border-left: 1.1em solid #f3f3f3;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.loader--title {
  font-size: 20px;
}
</style>
