<template>
    <div>
      <div id="parsing-error-message" class="hidden">
        That doesn't look like a Terraform plan. Did you copy the entire output
        (without colouring) from the plan command?
      </div>
      <div id="prettyplan" class="prettyplan">
        <ul id="errors" class="errors"></ul>
        <ul id="warnings" class="warnings"></ul>
        <button class="expand-all" v-if="!allVisible" @click="accordionAll(true)">Expand all</button>
        <button class="collapse-all" v-if="allVisible" @click="accordionAll(false)">Collapse all</button>
        <br><br>
        <input type="checkbox" id="Update" value="update" v-model="checkedActions">
        <label for="Update">Update</label>
        <input type="checkbox" id="Create" value="create" v-model="checkedActions">
        <label for="Create">Create</label>
        <input type="checkbox" id="Destroy" value="destroy" v-model="checkedActions">
        <label for="Destroy">Destroy</label>
        <input type="checkbox" id="Recreate" value="recreate" v-model="checkedActions">
        <label for="Recreate">Recreate</label>
        <input type="checkbox" id="Read" value="read" v-model="checkedActions">
        <label for="Read">Read</label>

        <hr>

        <span v-for="prop in topProps" :key="'ignore_'+prop.name">
          <input type="checkbox" :id="'ignore_'+prop.name" :value="prop.name" v-model="ignoredProps">
          <label :for="'ignore_'+prop.name">Ignore {{prop.name}}</label>
        </span>

        <hr>

        <span v-for="prop in topProps" :key="'include_'+prop.name">
          <input type="checkbox" :id="'include_'+prop.name" :value="prop.name" v-model="includeOnlyProps">
          <label :for="'include_'+prop.name">Include {{prop.name}}</label>
        </span>

        <hr>
        <input type="checkbox" id="FancyView" value="fancyView" v-model="fancyView">
        <label for="FancyView">FancyView</label>

        <ul id="actions" class="actions">
          <li :class="action.type" v-for="action, index in filtered" :key="index">
            <div class="summary" @click="accordion(action)">
              <span class="badge">{{action.type}}</span>

              <span class="id">
                <span class="id-segment prefix" v-for="prefix in action.id.prefixes" :key="prefix">{{prefix}}</span>
                <span class="id-segment type">{{action.id.type}}</span>
                <span class="id-segment name">
                  {{action.id.name}}
                  <span class="id-segment index" v-if="action.id.index" >[{{action.id.index}}]</span>
                </span>
              </span>

              <span class="change-count"> {{action.filteredChanges.length}} changes </span>
            </div>
            <div class="changes" v-if="action.isOpen">
              <span class="change-count"> {{action.id.address}} </span>
              
              <table>
                <tbody>
                  <tr v-for="change in action.filteredChanges" :key="change.property">
                    <td class="property"  v-if="!fancyView.includes('fancyView')">{{change.property}}</td>
                    <td class="old-value" v-if="!fancyView.includes('fancyView')"><pre>{{change.old}}</pre></td>
                    <td class="new-value" v-if="!fancyView.includes('fancyView')"><pre>{{change.new}}</pre></td>
                    <td v-if="fancyView.includes('fancyView')">
                      <b>{{change.property}}</b>
                      <vue-json-compare :oldData="change.old" :newData="change.new">
                    </vue-json-compare></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script lang="js">
import Vue from "vue";
import vueJsonCompare from 'vue-json-compare';

import { parse } from "../helpers/parse";
// import { Action, Warning } from "../helpers/interfaces";


export default Vue.extend({
  name: "PrettyPlan",
  components: {
    vueJsonCompare
  },
  data() {
    let actions = [];
    return {
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
      .then((data) => {
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
          
      })
      .catch((response) => console.log(response));
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
    }
  },
});
</script>
