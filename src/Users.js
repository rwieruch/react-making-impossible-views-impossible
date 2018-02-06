import React from 'react';

const createState = (type, data) => {
  return {
    fold: definitions => {
      const renderFn = definitions[type];
      return renderFn ? renderFn(data) : null;
    },
  };
};

const STATES = {
  init: () => createState('NOT_LOADED'),
  loading: () => createState('LOADING'),
  failure: error => createState('FAILURE', error),
  success: data => createState('SUCCESS', data),
};

const fakeFetch = () => {
  return new Promise(res => {
    setTimeout(() => res([{ id: 1, name: 'foo' }]), 1000);
  });
};

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...STATES.init() };
  }

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
    const { fold } = this.state;

    return (
      <div>
        <h3>User List</h3>

        {fold({
          NOT_LOADED: () => <div>Not Loaded</div>,
          LOADING: () => <div>Loading...</div>,
          FAILURE: error => <div>An error has happened</div>,
          SUCCESS: users => (
            <ul>
              {users.map(user => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          ),
        })}
      </div>
    );
  }
}

export default Users;