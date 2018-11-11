import { Component } from 'react';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table'
import SickButton from './styles/SickButton'

const possiblePermisssions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) =>
    console.log(data) || (
      <div>
        <Error error={error} />
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermisssions.map((permission, idx) => (<th key={idx}>{permission}</th>))}
                <th>👇</th>
              </tr>
            </thead>
            <tbody>{data.users.map((user, id) =>
              <User key={id} user={user}/>
            )}</tbody>
          </Table>
        </div>
        <p>Hey!</p>
      </div>
    )}
  </Query>
);

class User extends Component {
  render() {
    const user = this.props.user;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        { possiblePermisssions.map((permission, idx) =>
          <td key={idx}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input type="checkbox"/>
            </label>
          </td>
        )}
        <td>
          <SickButton>Update!</SickButton>
        </td>
      </tr>)
  }
}
export default Permissions;

