<template>
  <div>
    <div v-if="noAutoPlanFound">
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
      <br /><br />
      <input
        type="checkbox"
        id="Update"
        value="update"
        v-model="checkedActions"
      />
      <label for="Update">Update</label>
      <input
        type="checkbox"
        id="Create"
        value="create"
        v-model="checkedActions"
      />
      <label for="Create">Create</label>
      <input
        type="checkbox"
        id="Destroy"
        value="destroy"
        v-model="checkedActions"
      />
      <label for="Destroy">Destroy</label>
      <input
        type="checkbox"
        id="Recreate"
        value="recreate"
        v-model="checkedActions"
      />
      <label for="Recreate">Recreate</label>
      <input type="checkbox" id="Read" value="read" v-model="checkedActions" />
      <label for="Read">Read</label>

      <div class="row">
        <div class="col-6">
          <p>Hide changes to the following props:</p>
          <span v-for="prop in topProps" :key="'ignore_' + prop.name">
            <input
              type="checkbox"
              :id="'ignore_' + prop.name"
              :value="prop.name"
              v-model="ignoredProps"
            />
            <label :for="'ignore_' + prop.name">{{ prop.name }}</label>
          </span>
        </div>
        <div class="col-6">
          <p>Only show changes to the following props:</p>
          <span v-for="prop in topProps" :key="'include_' + prop.name">
            <input
              type="checkbox"
              :id="'include_' + prop.name"
              :value="prop.name"
              v-model="includeOnlyProps"
            />
            <label :for="'include_' + prop.name">{{ prop.name }}</label>
          </span>
        </div>
      </div>


      <input
        type="checkbox"
        id="FancyView"
        value="fancyView"
        v-model="fancyView"
      />
      <label for="FancyView">FancyView</label>

      <PrettyPlanActions :actions="filtered" :fancyView="fancyView" />
    </div>
  </div>
</template>

<script lang="js">
import Vue from "vue";
import PrettyPlanActions from './PrettyPlan.Actions.vue';

import { parse } from "../helpers/parse";
// import { Action, Warning } from "../helpers/interfaces";


export default Vue.extend({
  name: "PrettyPlan",
  components: {
    PrettyPlanActions
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
