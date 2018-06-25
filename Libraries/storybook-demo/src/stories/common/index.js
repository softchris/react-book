import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '../../common/Button';

storiesOf('Button', module)
  .add('with text', () => <Button title={'title for a button'}>text</Button>)
  .add('with markup', () => <Button title={'title for a button'}><h3>My button</h3><span>button text</span></Button>)
