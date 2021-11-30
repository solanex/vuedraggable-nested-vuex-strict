import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash.clonedeep'

Vue.use(Vuex)

//lock for updateChildrenByElementId to prevent multiple (nested) draggable's overwriting eachothers updates.
let updateChildrenLock;

// Helper function to recurse through the element tree to find the requested element by id
const findNestedElementById = (elements, id) => {
  //run through all elements on this level
  for (let element of elements) {
    //check if the current element matches the id
    if (element.id == id)
      return element;

    //if not, check if the element has any children
    if (element.children.length) {
      //run through the children by recursing this function
      let result = findNestedElementById(element.children, id);
      
      //if we found something, return it!
      if (result !== null)
        return result;
    }
  }
  
  //"these are not the elements you are looking for"
  return null;
}

export default new Vuex.Store({
  //make sure the store is strict for this strict example ;)
  strict: true,

  state: {
    //example elements tree
    elements: [
      {
        id: '06a8ff58-e0e2-4424-8e0a-8a418af0cae5',
        name: 'John',
        children: []
      },
      {
        id: '39c13379-e20e-4c31-8949-2f8b7ed16af9',
        name: 'Samanta',
        children: [
          {
            id: '087ba802-cd68-4231-86c5-c8d179e55d23',
            name: 'Francis',
            children: [],
          },
          {
            id: 'fdc0ac23-7bc5-484f-a7a6-6d33c2b76c67',
            name: 'Nicole',
            children: [
              {
                id: '13fbb666-b2e1-427d-87a0-ead193744eb7',
                name: 'Frank',
                children: [],
              }
            ],
          }
        ]
      },
      {
        id: '9e4ef71c-54b4-4fc5-aff7-a0c6beb84198',
        name: 'Tony',
        children: [
          {
            id: '0917d572-9147-468a-93ec-54ffc55ec5d2',
            name: 'Lawrence',
            children: []
          }
        ]
      }
    ]
  },

  mutations: {
    setElements(state, elements) {
      state.elements = elements;
    }
  },

  actions: {
    updateElements({commit}, elements) {
      commit('setElements', elements);
    },
    async updateChildrenByElementId({state, commit}, {elementId, children}) {
      //check if there is a lock and wait for it to resolve
      if (updateChildrenLock)
        await updateChildrenLock;

      //use a promise as a transaction lock
      updateChildrenLock = new Promise((resolve) => {
        //make a deep clone copy of the state.elements so we don't get a mutation error.
        let _elements = cloneDeep(state.elements);

        //find the element we want to change the children from
        let _element = findNestedElementById(_elements, elementId);
        
        //overwrite the children
        _element.children = children;

        console.log(children, _element, _elements);

        //mutate to the state
        commit('setElements', _elements);
        
        //release the lock
        resolve();
      })
      return updateChildrenLock;
    }
  },
  
  getters: {
    getElements: state => state.elements,
    getElementById: state => id => findNestedElementById(state.elements, id),
  },
  modules: {
  }
})
