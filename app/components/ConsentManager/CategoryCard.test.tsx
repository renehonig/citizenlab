// libraries
import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

// component to test
import CategoryCard from './CategoryCard';

// mock utilities
jest.mock('utils/cl-intl');

describe('<CategoryCard />', () => {
  const category = 'analytics';

  const categoryDestinations = {
    analytics: [
      {
        name: 'Google Analytics',
        description: 'Google Analytics is the most popular marketing tool for the web. It’s free and provides a wide range of features. It’s especially good at measuring traffic sources and ad campaigns.',
        category: 'Analytics',
        website: 'http://google.com/analytics',
        id: 'Google Analytics',
      },
      {
        name: 'MarketingTool',
        description: 'MarketingTool is the most popular marketing tool for the web. It’s free and provides a wide range of features. It’s especially good at measuring traffic sources and ad campaigns.',
        category: 'Tag Managers',
        website: 'http://random.com/marketing',
        id: 'MarketingTool',
      },
    ]
  };

  const handleChange = jest.fn();

  beforeEach(() => {
  });

  it('renders correctly when null', () => {
    const wrapper = shallow(
      <CategoryCard
        key={category}
        category={category}
        destinations={categoryDestinations[category]}
        checked={null}
        handleChange={handleChange}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly when allowed', () => {
    const wrapper = shallow(
      <CategoryCard
        key={category}
        category={category}
        destinations={categoryDestinations[category]}
        checked={true}
        handleChange={handleChange}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly when disallowed', () => {
    const wrapper = shallow(
      <CategoryCard
        key={category}
        category={category}
        destinations={categoryDestinations[category]}
        checked={false}
        handleChange={handleChange}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('lets you change your preference', () => {
    const wrapper = shallow(
      <CategoryCard
        key={category}
        category={category}
        destinations={categoryDestinations[category]}
        checked={null}
        handleChange={handleChange}
      />
    );
    wrapper.find(`#${category}-radio-false`).simulate('change', [category, false]);
    expect(handleChange).toBeCalledWith(category, false);

    wrapper.find(`#${category}-radio-true`).simulate('change', [category, true]);
    expect(handleChange).toBeCalledWith(category, true);
  });
});
