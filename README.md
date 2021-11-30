# Example of nested vuedraggable with strict vuex store

This quick example shows how to use nested vuedraggable with vuex store on strict, since the example included with vuedraggabel will give mutation errors on a strict store.

The issue occurs because the draggable list property is trying to write directly into the passed in array, which is a reference to the state object and will throw a mutation error.

This means we need to handle the update of the list outside of the draggable component. And this is were v-model (value prop and input action) comes in.

This is accomplished by assigning a unique id to each element in the elements list, and using vuex getters and actions to fetch and update the state by the element id in each NestedDraggable and passing these into the value prop and input event of the draggable component. One exception on this is the root NestedDraggabel which is handled through v-model out of App.vue

A small recursive function (*findNestedElementById*) has been declared in store/index.js to traverse the elements tree to find an element by id. 

To prevent multiple (nested) draggable's from overwriting the state when moving an element from one (nested) draggable to the next (nested) a lock is used in the *updateChildrenByElementId* action based on a Promise.

Dependencies:
* [VueDraggable](https://github.com/SortableJS/Vue.Draggable) - The main component this example is about
* [lodash.clonedeep](https://www.npmjs.com/package/lodash.clonedeep) - Used to make a deep clone copy of the state elements to prevent mutation errors in the *updateChildrenByElementId* function
* [uuid](https://www.npmjs.com/package/uuid) - for generating unique id's for new elements
* [node-random-name](https://www.npmjs.com/package/node-random-name) - Used to get unique names when adding elements, not required for implementing the example in another code base




