import { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types'
import Error from './ErrorMessage';
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
              <UserPermissions key={id} user={user}/>
            )}</tbody>
          </Table>
        </div>
        <p>Hey!</p>
      </div>
    )}
  </Query>
);

class UserPermissions extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };
  // we're only using props to seed the initial state, hence not strictly violating the single source of truth pattern
  state = {
    permissions: this.props.user.permissions,
  }
  handlePermissionChange = (e) => {
    // either add or remove the permission to the array on state
    const checkbox = e.target;
    let updatedPermissions = [...this.state.permissions];
    // add or remove the permissions
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter((permission) => permission !== checkbox.value);
    }
    this.setState({ permissions: updatedPermissions });
  }
  render() {
    const user = this.props.user;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        { possiblePermisssions.map((permission, idx) =>
          <td key={idx}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                id={`${user.id}-permission-${permission}`}
                type="checkbox"
                checked={this.state.permissions.includes(permission)}
                value={permission}
                onChange={this.handlePermissionChange}/>
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

