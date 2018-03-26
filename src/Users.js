import React from 'react';

const createState = (type, data) => ({
  view: definitions => {
    const renderFn = definitions[type];
    return renderFn ? renderFn(data) : null;
  },
});

const STATES = {
  init: () => createState('NOT_LOADED'),
  loading: () => createState('LOADING'),
  failure: error => createState('FAILURE', error),
  success: data => createState('SUCCESS', data),
};

const fakeFetch = () =>
  new Promise(resolve => {
    setTimeout(
      () => resolve([{ id: 1, name: 'Robin' }, { id: 2, name: 'Dustin' }]),
      1500,
    );
  });

class Users extends React.Component {
  state = { ...STATES.init() };

  componentDidMount() {
    this.fetch();
  }

  fetch = async () => {
    this.setState({ ...STATES.loading() });

    fakeFetch()
      .then(data => this.setState({ ...STATES.success(data) }))
      .catch(error => this.setState({ ...STATES.failure(error) }));
  };

  render() {
    return (
      <div>
        <h3>User List</h3>

        {this.state.view({
          NOT_LOADED: () => <div>Not Loaded</div>,
          LOADING: () => <div>Loading...</div>,
          FAILURE: error => <div>An error has happened</div>,
          SUCCESS: users => (
            <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>
          ),
        })}
      </div>
    );
  }
}

export default Users;
