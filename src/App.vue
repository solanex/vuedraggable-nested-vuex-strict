<template>
  <div>
    <div class="btn" @click="addElement">Add element</div>
    <NestedDraggable v-model="elements" />
  </div>  
</template>

<script>
import NestedDraggable from './components/NestedDraggable.vue'
import { mapGetters, mapActions } from 'vuex';
import { v4 as uuid4 } from 'uuid';
import randomName from 'node-random-name';

export default {
  name: 'App',
  components: {
    NestedDraggable,
  },
  methods: {
    ...mapActions(['updateElements']),
    addElement() {
      this.elements = [
        ...this.elements,
        {
          id: uuid4(),
          name: randomName({first: true, random: Math.random}),
          children: [],
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getElements']),
    elements: {
      get() {
        return this.getElements
      },
      set(elements) {
        this.updateElements(elements);
      }
    }
  },
}
</script>

<style>
  .btn {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-weight: 600;
    color: rgba(243, 244, 246, 1);
    margin-right: 0.5rem;
    margin-bottom: 1rem;
    cursor: pointer;
    border-radius: 0.25rem;
    background-color: rgba(59, 130, 246, 1);
    width: 10rem;
  }
</style>
