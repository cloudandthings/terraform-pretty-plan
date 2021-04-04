<template>
    <div>
        <div class=fakeMenu>
          <div class="fakeButtons fakeClose"></div>
          <div class="fakeButtons fakeMinimize"></div>
          <div class="fakeButtons fakeZoom"></div>
        </div>
        <div class="fakeScreen">
          <p class="lineBlurb">
            🚀 Pretty Plan 🚀 
          </p>
          <p class="lineBlurb">
            This will turn your terraform JSON plan into something more. Paste a json plan in the box below and prettify it. 
            This has not been tested with terraform modules and IAM policy change and can only be used with terraform 0.12.0+.
            To generate a plan:
          </p>
          <p class="line">$ terraform plan -out=plan.out</p>
          <p class="line">$ terraform show -json plan.out > plan.json</p>
          <p class="line">><span class="cursor">_</span></p>
        </div>
        </div>

</template>

<script lang="js">
import Vue from "vue";

export default Vue.extend({
  name: "PrettyPlanWelcome"
})
</script>

<style scoped>
/* https://codepen.io/addyosmani/pen/avxmvN */
.fakeButtons {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  border: 1px solid #000;
  position: relative;
  top: 6px;
  left: 6px;
  background-color: #ff3b47;
  border-color: #9d252b;
  display: inline-block;
}

.fakeMinimize {
  left: 11px;
  background-color: #ffc100;
  border-color: #9d802c;
}

.fakeZoom {
  left: 16px;
  background-color: #00d742;
  border-color: #049931;
}

.fakeMenu {
  min-width: 550px;
  box-sizing: border-box;
  height: 25px;
  background-color: #bbb;
  margin: 0 auto;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

.fakeScreen {
  background-color: #151515;
  box-sizing: border-box;
  min-width: 550px;
  margin: 0 auto;
  margin-bottom: 10px;
  padding: 20px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.fakeScreen p {
  position: relative;
  left: 0%;
  margin-left: -5px;
  text-align: left;
  font-size: 1em;
  font-family: monospace;
  white-space: normal;
  overflow: hidden;
  /* width: 0; */
}

span {
  color: #fff;
  font-weight: bold;
}

.line {
  color: #fff;
}

.lineBlurb {
  color:#5C4CE4;
}


.cursor {
  -webkit-animation: blink 1s 11.5s infinite;
  -moz-animation: blink 1s 8.5s infinite;
  -o-animation: blink 1s 8.5s infinite;
  animation: blink 1s 8.5s infinite;
}

@-webkit-keyframes blink {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-moz-keyframes blink {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-o-keyframes blink {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-webkit-keyframes type {
  to {
    width: 17em;
  }
}

@-moz-keyframes type {
  to {
    width: 17em;
  }
}

@-o-keyframes type {
  to {
    width: 17em;
  }
}

@keyframes type {
  to {
    width: 17em;
  }
}
</style>
