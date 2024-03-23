
import { it, expect, describe } from 'vitest'
import React from '../core/React'
//question1: How does vitest find the test file and execute?
//question2: when vitest execute, the whole project would be watched so that any change would be detect automatically and throw error if it occurs, by that,
//we can find the error in time.
describe('createElement', () => {
    it('props is null', () => {
        const el = React.createElement('div', null, 'hi')
        expect(el).toEqual({
            type: 'div',
            props: {
                children: [
                    {
                        type: 'TEXT_ELEMENT',
                        props: {
                            nodeValue: 'hi',
                            children: []
                        }
                    }

                ]
            }
        })
    })

    it('should return element vdom', () => {
        const el = React.createElement('div', { id: "id" }, 'hi')
        expect(el).toEqual({
            type: 'div',
            props: {
                id: "id",
                children: [
                    {
                        type: 'TEXT_ELEMENT',
                        props: {
                            nodeValue: 'hi',
                            children: []
                        }
                    }

                ]
            }
        })
    })
})