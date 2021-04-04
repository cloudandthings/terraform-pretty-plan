<template>
  <div>
    <div v-if="noAutoPlanFound">
        <PrettyPlanWelcome/>

      <textarea
        id="terraform-plan"
        spellcheck="false"
        v-model="textPlan"
      ></textarea>
      <br />
      <button @click="loadTextPlan(textPlan)">Prettify it!</button>
    </div>
    <div id="parsing-error-message" v-if="parsingError">
      That doesn't look like a Terraform plan. Did you copy the entire output
      from the terraform show plan command?
    </div>
    <div id="prettyplan" class="prettyplan" v-if="foundValidPlan">
      <ul id="errors" class="errors"></ul>
      <ul id="warnings" class="warnings"></ul>
      <button class="expand-all" v-if="!allVisible" @click="accordionAll(true)">
        Expand all
      </button>
      <button
        class="collapse-all"
        v-if="allVisible"
        @click="accordionAll(false)"
      >
        Collapse all
      </button>

      <div class="row">
        <div class="col-4">
          <p>Show changes causing these actions:</p>
          <span v-for="action in availableActions" :key="action">
            <label class="chkcontainer">{{action}}
              <input type="checkbox" :id="action" :value="action" v-model="checkedActions">
              <span class="checkmark"></span>
            </label>
          </span>
        </div>
        <div class="col-4">
          <p>Hide changes to these props:</p>
          <span v-for="prop in topProps" :key="'ignore_' + prop.name">

            <label class="chkcontainer">{{prop.name}}
              <input type="checkbox" :id="'ignore_' + prop.name" :value="prop.name" v-model="ignoredProps">
              <span class="checkmark"></span>
            </label>

          </span>
        </div>
        <div class="col-4">
          <p>Only show changes to these props:</p>
          <span v-for="prop in topProps" :key="'include_' + prop.name">
            
            <label class="chkcontainer">{{prop.name}}
              <input type="checkbox" :id="'include_' + prop.name" :value="prop.name" v-model="includeOnlyProps">
              <span class="checkmark"></span>
            </label>
          </span>
        </div>
      </div>

            <label class="chkcontainer">FancyView
              <input type="checkbox" id="FancyView" value="fancyView" v-model="fancyView">
              <span class="checkmark"></span>
            </label>


      <PrettyPlanActions :actions="filtered" :fancyView="fancyView" />
    </div>
  </div>
</template>

<script lang="js">
import Vue from "vue";
import PrettyPlanActions from './PrettyPlan.Actions.vue';
import PrettyPlanWelcome from './PrettyPlan.Welcome.vue';

import { parse } from "../helpers/parse";
// import { Action, Warning } from "../helpers/interfaces";


export default Vue.extend({
  name: "PrettyPlan",
  components: {
    PrettyPlanActions,
    PrettyPlanWelcome
  },
  data() {
    let actions = [];
    return {
      noAutoPlanFound: false,
      textPlan: "",
      foundValidPlan: false,
      parsingError: false,
      actions,
      allVisible: false,
      availableActions: ["update", "create", "destroy", "recreate", "read"],
      checkedActions: ["update", "create", "destroy", "recreate", "read"],
      fancyView:[],
      ignoredProps:[],
      includeOnlyProps:[],
      topProps: []
    };
  },
  computed: {
    filtered() {
      return this.actions
        .filter( (action) => this.checkedActions.includes(action.type))
        .map( (action) => {
          action.filteredChanges = action.changes
            .filter((change) => !this.ignoredProps.includes(change.property))
            .filter((change) => {
              
              if (this.includeOnlyProps.length === 0) {
                return true;
              } else {
                return this.includeOnlyProps.includes(change.property);
              }
              
            });
          return action
        })
        .filter( (action) => action.filteredChanges.length > 0);
    }
  },
  mounted() {
    fetch("plan.json")
      .then((response) => response.json())
      .then((data) => this.parseRawJson(data))
      .catch((response) => {
        this.noAutoPlanFound = true;
        console.log(response);
      });
  },
  methods: {
    accordion: function(e) {
        e.isOpen = !e.isOpen;
    },
    accordionAll: function(action) {
        this.allVisible = action;
        this.actions = this.actions.map((e) => {
            e.isOpen = action;
            return e;
          })
    },
    loadTextPlan: function (data) {
      try {
        this.parsingError = false;
        this.foundValidPlan = false;
        const jsonData = JSON.parse(data);
        this.parseRawJson(jsonData);
        this.foundValidPlan = true;
      } catch (e) {
        this.parsingError = true;
      }


    },
    parseRawJson: function(data) {
        const rawPlan = parse(data);
        this.actions = rawPlan.actions.map((e) => {
            e.isOpen = false;
            return e;
          });

          const top3PropsObj = this.actions.reduce((acc, action) => {
            const changes = action.changes.map(c => c.property);
            acc = acc.concat(changes);
            return acc;
          }, [])
          .reduce((acc, curr) => {

            acc[curr] ??= {name: curr, count: 0};
            acc[curr]['count']++;
            
            return acc;
          }, {});

          this.topProps = Object.keys(top3PropsObj)
          .map((key) => top3PropsObj[key])
          .sort((a, b) => b.count - a.count)
          .slice(0,5);

          this.foundValidPlan = true;
    }
  },
});
</script>

<style scoped>
label {
  color:#000
}

/* The container */
.chkcontainer {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 15px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color:#000000c0
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
/* .container:hover input ~ .checkmark {
  background-color: #ccc;
} */

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #5C4CE4;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}



</style>
