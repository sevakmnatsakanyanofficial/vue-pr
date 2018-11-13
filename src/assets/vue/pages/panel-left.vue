<template>
  <f7-page>
    <f7-navbar v-bind:title="settingsTranslate"></f7-navbar>

    <f7-list>
      <f7-list-item v-on:click="$f7router.navigate('/profile/')" link="" v-bind:title="profileTranslate"></f7-list-item>
      <f7-list-item v-on:click="$f7router.navigate('/history/')" link="" v-bind:title="historyTranslate"></f7-list-item>
      <f7-list-item v-on:click="$f7router.navigate('/about/')" link="" v-bind:title="aboutTranslate"></f7-list-item>
      <f7-list-item v-on:click="$f7router.navigate('/language/')" link="" v-bind:title="languageTranslate"></f7-list-item>
      <f7-list-item v-bind:title="logoutTranslate" v-on:click="logout()"></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
    // Import Common Methods mixin
    import CommonMethods from 'mixins/common-methods.vue'

    export default {
        mixins: [CommonMethods]
    };
</script>
