<template>
    <ul id="actions" class="actions">
          <li :class="action.type" v-for="action, index in actions" :key="index">
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
</template>

<script>
import Vue from "vue";
import vueJsonCompare from 'vue-json-compare';

export default Vue.extend({
  name: "PrettyPlanActions",
  props: [
      'actions',
      'fancyView'
  ],
  components: {
    vueJsonCompare
  },
  methods: {
    accordion: function(e) {
        e.isOpen = !e.isOpen;
    }
  }
})
</script>

<style scoped>

  .prettyplan ul.warnings li {
      border-left: 3px solid #757575;
  }

  .prettyplan ul.actions li.update {
      border-left: 3px solid #ff8f00;
  }
  .prettyplan ul.actions li.create {
      border-left: 3px solid #2e7d32;
  }
  .prettyplan ul.actions li.destroy {
      border-left: 3px solid #b71c1c;
  }
  .prettyplan ul.actions li.recreate {
      border-left: 3px solid #1565c0;
  }
  .prettyplan ul.actions li.read {
      border-left: 3px solid #519bf0;
  }

  .badge {
      display: inline-block;
      text-transform: uppercase;
      margin-right: 10px;
      padding: 3px;
      font-size: 12px;
      font-weight: bold;
  }
  .warnings .badge {
      color: #757575;
  }
  li.update .badge {
      color: #ff8f00;
  }
  li.create .badge {
      color: #2e7d32;
  }
  li.destroy .badge {
      color: #b71c1c;
  }
  li.recreate .badge {
      color: #1565c0;
  }
  li.read .badge {
      color: #519bf0;
  }


  .id-segment:not(:last-child)::after {
      content: " > ";
  }
  .id-segment.name, .id-segment.type {
      font-weight: bold;
  }
  .id-segment.index {
      font-weight: bold;
      color:  #757575;
  }

  .change-count {
      float: right;
  }

  .summary {
      cursor: pointer;
  }

  .changes {
      margin: 5px auto 0 auto;
      padding: 5px;
  }
  .changes table {
      width: 100%;
      word-break: break-all;
      font-size: 13px;
  }
  .changes table td {
      padding: 10px;
      width: 40%;
  }
  pre {
      white-space: pre-wrap;
  }
  .changes table td.property {
      width: 20%;
      text-align: right;
      font-weight: bold;
  }
  .changes table tr:nth-child(even) {
      background-color: #f5f5f5;
  }

  .forces-new-resource {
      color: #b71c1c;
  }


</style>