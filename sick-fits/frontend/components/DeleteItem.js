import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  update = (cache, payload) => {
    // manually update the cache on the client so that it matches the server:
    // 1. Read the items that we want to display
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
    console.log(data, payload)
    // 2. filter the deleted item out of the page
    data.items = data.items.filter((item) => item.id !== payload.data.deleteItem.id);
    // 3. put the items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }
  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}>
        {(deleteItem, { error }) => (
          <button onClick={() => {
            if (confirm(`Are you sure you want to delete this item? ${this.props.id}`)) {
              deleteItem().catch(err => {
                alert(err.message);
              });
            }
          }}>{ this.props.children }</button>
         )}
      </Mutation>
    );
  }
}
export default DeleteItem;
