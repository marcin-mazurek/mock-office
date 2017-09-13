import React from 'react';
import { action, storiesOf } from '@kadira/storybook';
import EditableField from '../../src/lib/gui/components/EditableField/index';

const props = {
  onSave: action('onSave'),
  onCancel: action('onCancel')
};

storiesOf('EditableField', module)
  .add('edit bolded text', () => (
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pulvinar purus tellus,
      quis bibendum tortor laoreet nec. Maecenas a sem non odio gravida volutpat id fermentum orci.
      Aenean <b><EditableField value="et quam nec diam" {...props} /></b> lacinia bibendum.
      Nunc semper in risus eu aliquam. Vestibulum augue nibh, vestibulum vitae neque vitae,
      vestibulum dictum purus. Curabitur id est vitae augue venenatis bibendum. Pellentesque
      habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis lorem
      dui, <b><EditableField value="cursus id tempus" {...props} /></b>, quis auctor sed velit.
      Suspendisse non sagittis orci. Suspendisse sed ante augue. Pellentesque habitant morbi
      tristique senectus et netus et malesuada fames ac turpis egestas.
    </div>
  ));
