<template>
    <Draggable
        group="el"
        :value="realValue"
        @input="input"
        @add="add"
        @remove="remove"
    >
        <div v-for="element in realValue" :key="element.id">
            <div class="element">{{element.name}}</div>
            <NestedDraggable class="nestedDraggable" :elementId="element.id" />
        </div>
    </Draggable>
</template>

<script>
import Draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'NestedDraggable',
    components: {
        Draggable,
    },
    props: {
        value: {
            type: Array,
            default: null,
        },
        elementId: {
            type: String,
            default: null,
        }
    },
    data() {
        return {
            slowdown: false,
        }
    },
    methods: {
        ...mapActions(['updateChildrenByElementId']),
        async input(newValue) {
            /**
             * When moving between 2 (nested) vue.draggable's, both fire input events for their part of the tree
             * at the same time. This might cause a race condition where the dragged element might disapear
             * from the tree since the updates arrive in the wrong order
             * 
             * To fix this we need to listen for the add & remove events of the Draggable, and check if we should
             * wait a little while before sending the update to the store.
             * 
             * Because the add & remove events are fired after the input event, we will first delay processing the input
             * event for a little while, so we will have the feedback from the add & remove events before proceeding.
             */

            return new Promise((resolve) => {
                setTimeout(async() => {
                    // check if we need to slowdown
                    if (this.slowdown){
                        await new Promise((timer) => { setTimeout(timer, 2)});
                        this.slowdown = false;
                    }

                    //if we are using v-model, send an input event back
                    if (this.value)
                        this.$emit('input', newValue)

                    //if looked up the element in the vuex store, update the vuex store.
                    else if (this.elementId)
                        this.updateChildrenByElementId({
                            elementId: this.elementId,
                            children: newValue
                        })
                }, 1)
            })
        },
        add(e) {
            // if we are cloning from another Draggable, we will not bother with the slowdown
            if (e.pullMode == 'clone')
                return;

            // if we are moving up in the hierarchy, we need to slowdown so the remove input event from the 
            // source draggable can be processed first.
            this.slowdown = this.isMovingUp(e);
        },
        remove(e) {
            // if we are moving down in the hierarchy, we need to slowdown so the add input event from the
            // target draggable can be processed first.
            this.slowDown = !this.isMovingUp(e);
        },
        isMovingUp(e) {
            // To determine where we are moving in the hierarchy, we will count the number of nodes in the DOM path
            // between the to and from draggable div element, using javascript's native XPath selector.
            // NB: This is done on the rendered browsers DOM outside of Vue's shadow DOM.
            let toCount = e.to.ownerDocument.evaluate('ancestor::*', e.to, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            let fromCount = e.from.ownerDocument.evaluate('ancestor::*', e.from, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;

            // now we compare the results of both the see where we are going.
            return toCount > fromCount;
        }
    },
    computed: {
        ...mapGetters(['getElementById']),
        realValue() {
            //is this a v-model ?
            if (this.value)
                return this.value;
            //do we need to lookup the element in the store ?
            else if (this.elementId)
                return this.getElementById(this.elementId)?.children
            //nothing ? return an empty array
            else
                return [];
        }
    }
}
</script>

<style>
    .element {
        border: 1px #333 solid;
        width: 10rem;
        padding: .5rem 1rem .5rem 1rem;
        cursor: move;
    }
    .nestedDraggable {
        margin: 0 0 0 4rem;
    }
</style>