import { publish } from 'gh-pages';

publish('dist', err => console.error(err));
