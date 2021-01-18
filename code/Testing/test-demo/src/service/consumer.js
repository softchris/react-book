import data from './repository';

const item = { title: 'consumer' };

export default [ ...data, { ...item}];
