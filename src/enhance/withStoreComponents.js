import withFirestore from './withFirestore';

const withStoreComponents = withFirestore(() => ({
  collection: 'components',
  id: 'components',
}));

export default withStoreComponents;
