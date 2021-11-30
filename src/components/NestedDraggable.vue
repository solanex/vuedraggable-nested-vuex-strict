<template>
    <Draggable
        group="el"
        :value="realValue"
        @input="input"
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
    methods: {
        ...mapActions(['updateChildrenByElementId']),
        input(newValue) {
            //if we are using v-model, send an input event back
            if (this.value)
                this.$emit('input', newValue)

            //if looked up the element in the vuex store, update the vuex store.
            else if (this.elementId)
                this.updateChildrenByElementId({
                    elementId: this.elementId,
                    children: newValue
                })
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