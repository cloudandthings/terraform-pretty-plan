<template>
  <div id="app">
    <div class="stripe"></div>
    <div id="release-notification" class="hidden"></div>
    <div class="container">
    <PrettyPlan/>
    </div>
    <footer id="branding">
        Source on <a href="https://github.com/cloudandthings/terraform-pretty-plan">GitHub</a><br />
        By <a target="_blank" href="https://cloudandthings.io">cloudandthings.io</a><br />
        <!-- <button class="text-button" onclick="showReleaseNotes()">Release Notes</button><br /> -->
   </footer>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PrettyPlan from './components/PrettyPlan.vue';

export default Vue.extend({
  name: 'App',
  components: {
    PrettyPlan
  }
});
</script>

<style>
  body {
      font-family: Avenir, Arial, Helvetica, sans-serif;
      text-rendering: optimizeLegibility;
      background: #ECF7FE;
      color: #000000c0;
      font-size: 15px;
      margin: 0;
  }
  @keyframes fade-in {
      0% {
          opacity: 0;
      }
      100% {
          opacity: 1;
      }
  }

  .stripe {
      width: 100%;
      height: 5px;
      background: #5C4CE4;
      animation-name: wipe-in;
      animation-duration: 1s;
  }
  @keyframes wipe-in {
      0% {
          width: 0%;
      }
      100% {
          width: 100%;
      }
  }

  #release-notification {
      background: #5C4CE4;
      color: white;
      font-weight: bold;
      text-align: center;
      overflow: hidden;
      padding: 10px 0 15px 0;
      height: 20px;
      animation-name: notification-pop-in;
      animation-duration: 2s;
  }
  #release-notification a {
      color: white;
  }
  #release-notification.dismissed {
      animation-name: notification-pop-out;
      animation-duration: .5s;
      height: 0;
      padding: 0;
  }
  @keyframes notification-pop-in {
      0% {
          height: 0;
          padding: 0;
      }
      50% {
          height: 0;
          padding: 0;
      }
  }
  @keyframes notification-pop-out {
      0% {
          height: 20px;
          padding: 10px 0 15px 0;
      }
      100% {
          height: 0;
          padding: 0;
      }
  }

  #modal-container {
      animation-name: fade-in;
      animation-duration: .2s;
  }
  .modal-pane {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #ffffffe6;
      z-index: 10; 
  }
  .modal-content {
      position: fixed;
      width: 60%;
      height: 60%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ffffff;
      box-shadow: 0 2px 6px 0 hsla(0, 0%, 0%, 0.2);
      z-index: 20;
  }
  .modal-close {
      position: absolute;
      right: 0;
      padding: 10px;
  }
  .modal-close button.text-button {
      color: #4526AC;
      text-decoration: none;
      font-weight: normal;
  }
  .release-notes {
      max-width: 80%;
      margin: 0 auto 0 auto;
      overflow-y: auto;
      max-height: 100%;
  }

  #branding {

      float: right;
      padding-top: 10px;
      padding-right: 10px;
      font-size: 10px;
      color: #4526AC;
      text-align: right;
  }
  #branding a {
      color: #4526AC;
  }

  .container {
      margin: 10px 10px 0 10px;
      animation-name: fade-in;
      animation-duration: 1s;
  }
  @media only screen and (min-width: 600px) {
      .container {
          max-width: 80%;
          margin-left: auto;
          margin-right: auto;
      }
  }

  h1, h2 {
      text-align: center;
      color: #4526AC;
  }

  #terraform-plan {
      width: 100%;
      min-height: 100px;
      border: none;
      box-shadow: 0 2px 6px 0 hsla(0, 0%, 0%, 0.2);
      padding: 10px;
      margin-bottom: 10px;
      resize: none;
      background: #ffffffe6;
  }

  button {
      font-size: 18px;
      background: #5C4CE4;
      color: #fff;
      box-shadow: 0 2px 6px 0 hsla(0, 0%, 0%, 0.2);
      border: none;
      border-radius: 2px;
      width: 170px;
      height: 40px;
  }

  button:hover {
      background: #6567EA;
      cursor: pointer;
  }
  button:active {
      background: #5037CA;
  }
  button.text-button {
      background: none;
      box-shadow: none;
      border-radius: 0;
      width: auto;
      height: auto;
      text-decoration: underline;
      font-size: inherit;
      font-weight: inherit;
      font-family: Avenir, Arial, Helvetica, sans-serif; 
      color: inherit;
      text-align: inherit;
      padding: 0;
  }

  #parsing-error-message {
      background-color: #ffffff;
      padding: 10px;
      color: #000000c0;
      margin: 4px;
      box-shadow: 0 2px 6px 0 hsla(0, 0%, 0%, 0.2);
      font-weight: bold;
      border-left: 2px solid red;
      animation-name: error;
      animation-duration: 1s;
  }

  @keyframes error {
      0% {
          background-color: red;
      }
      100% {
          background-color: white;
      }
  }

  .prettyplan ul {
      padding-left: 0;
      font-size: 13px;
  }

  .prettyplan li {
      list-style: none;
      background: #ffffffe6;
      padding: 10px;
      color: #000000c0;
      margin: 4px;
      box-shadow: 0 2px 6px 0 hsla(0, 0%, 0%, 0.2);
  }

  .collapsed, .hidden {
      display: none;
  }

* {
  box-sizing: border-box;
}

.row::after {
  content: "";
  clear: both;
  display: table;
}
  [class*="col-"] {
  float: left;
  padding: 15px;
  /* border: 1px solid red; */
}
.col-1 {width: 8.33%;}
.col-2 {width: 16.66%;}
.col-3 {width: 25%;}
.col-4 {width: 33.33%;}
.col-5 {width: 41.66%;}
.col-6 {width: 50%;}
.col-7 {width: 58.33%;}
.col-8 {width: 66.66%;}
.col-9 {width: 75%;}
.col-10 {width: 83.33%;}
.col-11 {width: 91.66%;}
.col-12 {width: 100%;}


</style>
