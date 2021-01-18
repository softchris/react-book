import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Todos from '../Todos';
import mocks from './mocks';

storiesOf('Todos', module)
  .add('with todos', () => <Todos todos={mocks.todos} />)


