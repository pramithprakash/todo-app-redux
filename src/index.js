import ReactDom from 'react-dom';
import React, {Fragment} from 'react';
import {createStore} from 'redux';

function TodoApp (state = {}, action) {
    switch(action.type) {
        case 'ADD_ITEM' :
            return {...state, items: [...state.items, { id: action.newItem,
                text: action.newItem,
                completed: false }
            ]}
       case 'DELETE_ITEM' :
            return {...state, items: state.items.filter(t => {
                    if(t.id !== action.itemId){
                        return t;
                    }
                })
            }
        case 'TOGGLE_TODO':
            return {...state, items: state.items.map(t => {
                    if(t.id == action.itemId){
                        t.completed = !t.completed;
                        return t;
                    } else {
                        return t;
                    }
                })
            }

        default :
            return state;
    }
}

const store = createStore(TodoApp, {
    items : [
        {"text" : "Item1", id : "1", completed: false},
        {"text" : "Item2", id : "2", completed: false}
    ]
});

let inputElement = null;

const Header = props => <h1>{props.name}</h1>;

const ListItems = ({items}) => <ul className="list-group">{items.map(i => <li className={"list-group-item " + (i.completed ? 'completed' : '')} key={i.id}>
    <input type="checkbox" checked={i.completed} onClick={completedItem} data-id={i.id} id={i.id} />
    <label htmlFor={i.id}>{i.text}</label>
    <a data-id={i.id} onClick={deleteItem}>Delete</a></li>)}</ul>;

const AddItems = () => {
        return (<form onSubmit={addItem}>
            <input type="text" placeholder="Add Item" ref={node => inputElement = node} className="form-control" />
            <input type="submit" className="btn btn-primary" />
        </form>);
    }

function addItem(e) {
    e.preventDefault();
    const newItem = inputElement.value.trim();
    if (newItem == ''){return false}
    store.dispatch({
        type: 'ADD_ITEM',
        newItem
    });
    inputElement.value = '';
}

function deleteItem(e) {
    e.preventDefault();
    const itemId = e.target.dataset.id;
    store.dispatch({
        type: 'DELETE_ITEM',
        itemId
    });
}

function completedItem(e) {
    const itemId = e.target.dataset.id;
    store.dispatch({
        type: 'TOGGLE_TODO',
        itemId
    });
}

store.subscribe(() => {
    const {items} = store.getState();
    ReactDom.render(
        <Fragment><Header name="Todo App" /><AddItems /><ListItems items={items} /></Fragment>,
        document.getElementById('root')
    );
})

store.dispatch({type: 'DEFAULT'});
