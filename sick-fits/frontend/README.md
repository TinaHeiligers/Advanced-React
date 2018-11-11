# Advanced-React

frontend
Cloudinary account: https://cloudinary.com/console/settings/upload

## Notes
1. If you want to be able to click on a label to activate an input contained within, add an id to the input that matches the htmlFor attribute of the label. See the Permissions.js file for an example.

### Using a callback function outside of a render Prop
In the Permissions.js component, the updatePermissions method can be triggered automatically by changing the input onChange method to:
```
  <input
    id={`${user.id}-permission-${permission}`}
    type="checkbox"
    checked={this.state.permissions.includes(permission)}
    value={permission}
    onChange={(e) => this.handlePermissionChange(e, updatePermissions)}/>
```
Then, in the `handlePermissionChange` function, we use the `updatePermissions` function as a callback to `setState`. It has to be a callback because setState is asynchronous.
The handlePermissionChange method changes to:
```
  handlePermissionChange = (e, updatePermissions) => {
    // either add or remove the permission to the array on state
    const checkbox = e.target;
    let updatedPermissions = [...this.state.permissions];
    // add or remove the permissions
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter((permission) => permission !== checkbox.value);
    }
    this.setState({ permissions: updatedPermissions }, updatePermissions);
  }
```
Note: we use the short-hand version of invoking a callback function above. To be explicit, this is:
```
  this.setState({ permissions: updatedPermissions}, function() {
    updatePermissions;
  })
```
