import React from 'react';
import type {ComponentProps} from 'react';
import {mountWithApp} from 'tests/utilities';
import {matchMedia} from '@shopify/jest-dom-mocks';

import {Tabs} from '../../Tabs';
import {Filters} from '../../Filters';
import {IndexFilters} from '..';
import {IndexFiltersMode} from '../../../utilities/index-filters';
import type {IndexFiltersProps} from '../IndexFilters';
import {
  SearchFilterButton,
  SortButton,
  UpdateButtons,
  EditColumnsButton,
} from '../components';

describe('IndexFilters', () => {
  const defaultProps: IndexFiltersProps = {
    onQueryChange: jest.fn(),
    onQueryClear: jest.fn(),
    queryValue: 'foo',
    onSort: jest.fn(),
    queryPlaceholder: 'Bar',
    sortOptions: [
      {
        label: 'Order number',
        value: 'order-number asc',
        directionLabel: 'Ascending',
      },
      {
        label: 'Order number',
        value: 'order-number desc',
        directionLabel: 'Descending',
      },
      {
        label: 'Customer name',
        value: 'customer-name asc',
        directionLabel: 'A-Z',
      },
      {
        label: 'Customer name',
        value: 'customer-name desc',
        directionLabel: 'Z-A',
      },
      {label: 'Date', value: 'date asc', directionLabel: 'A-Z'},
      {label: 'Date', value: 'date desc', directionLabel: 'Z-A'},
      {
        label: 'Payment status',
        value: 'payment-status asc',
        directionLabel: 'Ascending',
      },
      {
        label: 'Payment status',
        value: 'payment-status desc',
        directionLabel: 'Descending',
      },
      {
        label: 'Fulfillment status',
        value: 'fulfillment-status asc',
        directionLabel: 'A-Z',
      },
      {
        label: 'Fulfillment status',
        value: 'fulfillment-status desc',
        directionLabel: 'Z-A',
      },
      {label: 'Total', value: 'total asc', directionLabel: 'Ascending'},
      {label: 'Total', value: 'total desc', directionLabel: 'Descending'},
    ],
    sortSelected: ['order-number asc'],
    primaryAction: {
      type: 'save',
      onAction: jest.fn(),
    },
    cancelAction: {
      onAction: jest.fn(),
    },
    tabs: [
      {
        id: 'foo',
        content: 'Foo',
      },
    ],
    selected: 0,
    onSelect: jest.fn(),
    filters: [],
    appliedFilters: [],
    onClearAll: jest.fn(),
    mode: IndexFiltersMode.Default,
    setMode: jest.fn(),
    canCreateNewView: true,
    onCreateNewView: jest.fn(),
    showEditColumns: false,
  };

  beforeEach(() => {
    matchMedia.mock();
  });

  afterEach(() => {
    jest.resetAllMocks();
    matchMedia.restore();
  });

  it('reacts correctly to pressing the search button and invokes setMode with the filtering argument', () => {
    const setMode = jest.fn();
    const wrapper = mountWithApp(
      <IndexFilters {...defaultProps} setMode={setMode} />,
    );
    wrapper.act(() => {
      wrapper.find(SearchFilterButton)!.trigger('onClick');
    });

    expect(setMode).toHaveBeenCalledWith(IndexFiltersMode.Filtering);
  });

  it('calls onEditStart with IndexFiltersMode.Filtering when clicked', () => {
    const setMode = jest.fn();
    const onEditStart = jest.fn();
    const wrapper = mountWithApp(
      <IndexFilters
        {...defaultProps}
        setMode={setMode}
        onEditStart={onEditStart}
      />,
    );
    wrapper.act(() => {
      wrapper.find(SearchFilterButton)!.trigger('onClick');
    });

    expect(onEditStart).toHaveBeenCalledWith(IndexFiltersMode.Filtering);
  });

  it('renders non-disabled tabs if the current mode is Default', () => {
    const wrapper = mountWithApp(<IndexFilters {...defaultProps} />);

    expect(wrapper).toContainReactComponent(Tabs, {
      disabled: false,
    });
  });

  it('overrides and disables tabs even if the current mode is Default', () => {
    const wrapper = mountWithApp(<IndexFilters {...defaultProps} disabled />);

    expect(wrapper).toContainReactComponent(Tabs, {
      disabled: true,
    });
  });

  it('renders the SearchFilterButton tooltipContent with keyboard shortcut by default', () => {
    const wrapper = mountWithApp(<IndexFilters {...defaultProps} />);

    expect(wrapper).toContainReactComponent(SearchFilterButton, {
      tooltipContent: 'Search and filter (F)',
    });
  });

  it('onQueryChange gets called correctly', () => {
    const wrapper = mountWithApp(
      <IndexFilters {...defaultProps} mode={IndexFiltersMode.Filtering} />,
    );

    wrapper.act(() => {
      wrapper.find(Filters)!.trigger('onQueryChange', 'bar');
    });

    expect(defaultProps.onQueryChange).toHaveBeenCalledWith('bar');
  });

  it('onSort gets called correctly', () => {
    const wrapper = mountWithApp(<IndexFilters {...defaultProps} />);
    wrapper.act(() => {
      wrapper.find(SortButton)!.trigger('onChange', ['customer-name asc']);
    });

    expect(defaultProps.onSort).toHaveBeenCalledWith(['customer-name asc']);
  });

  describe('filters', () => {
    it('passes the filters down correctly', () => {
      const filters: ComponentProps<typeof IndexFilters>['filters'] = [
        {
          key: 'foo',
          label: 'Foo',
          filter: <div>Filter</div>,
          pinned: false,
          onAction: jest.fn(),
        },
      ];

      const wrapper = mountWithApp(
        <IndexFilters
          {...defaultProps}
          filters={filters}
          mode={IndexFiltersMode.Filtering}
        />,
      );

      expect(wrapper).toContainReactComponent(Filters, {
        filters,
      });
    });
  });

  describe('in EditingColumns mode', () => {
    it('renders the UpdateButtons component', () => {
      const wrapper = mountWithApp(
        <IndexFilters
          {...defaultProps}
          mode={IndexFiltersMode.EditingColumns}
        />,
      );

      expect(wrapper).toContainReactComponent(UpdateButtons);
    });

    it('does not render the Filters component', () => {
      const wrapper = mountWithApp(
        <IndexFilters
          {...defaultProps}
          mode={IndexFiltersMode.EditingColumns}
        />,
      );

      expect(wrapper).not.toContainReactComponent(Filters);
    });

    it('does not render the SortButton or SearchFilterButton component', () => {
      const wrapper = mountWithApp(
        <IndexFilters
          {...defaultProps}
          mode={IndexFiltersMode.EditingColumns}
        />,
      );

      expect(wrapper).not.toContainReactComponent(SortButton);
      expect(wrapper).not.toContainReactComponent(SearchFilterButton);
    });

    it('does not render the EditColumnsButton', () => {
      const wrapper = mountWithApp(
        <IndexFilters
          {...defaultProps}
          mode={IndexFiltersMode.EditingColumns}
        />,
      );

      expect(wrapper).not.toContainReactComponent(EditColumnsButton);
    });
  });

  describe('pressing f', () => {
    it('moves from Default mode to Filtering mode', () => {
      const onEditStart = jest.fn();

      mountWithApp(
        <IndexFilters
          {...defaultProps}
          mode={IndexFiltersMode.Default}
          onEditStart={onEditStart}
        />,
      );

      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'f',
        }),
      );

      expect(onEditStart).toHaveBeenCalledWith(IndexFiltersMode.Filtering);
    });
  });

  describe('pressing escape', () => {
    it('does not call the cancelAction.onAction method when in Default mode', () => {
      mountWithApp(
        <IndexFilters {...defaultProps} mode={IndexFiltersMode.Default} />,
      );

      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
        }),
      );

      expect(defaultProps.cancelAction.onAction).not.toHaveBeenCalled();
    });

    it('does call the cancelAction.onAction method when in Filtering mode', () => {
      mountWithApp(
        <IndexFilters {...defaultProps} mode={IndexFiltersMode.Filtering} />,
      );

      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
        }),
      );

      expect(defaultProps.cancelAction.onAction).toHaveBeenCalled();
    });

    it('does call the cancelAction.onAction method when in EditingColumns mode', () => {
      mountWithApp(
        <IndexFilters
          {...defaultProps}
          mode={IndexFiltersMode.EditingColumns}
        />,
      );

      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
        }),
      );

      expect(defaultProps.cancelAction.onAction).toHaveBeenCalled();
    });
  });

  describe('disableKeyboardShortcuts', () => {
    it('renders the SearchFilterButton tooltipContent without the keyboard shortcut', () => {
      const wrapper = mountWithApp(
        <IndexFilters {...defaultProps} disableKeyboardShortcuts />,
      );

      expect(wrapper).toContainReactComponent(SearchFilterButton, {
        tooltipContent: 'Search and filter',
      });
    });

    it('does not moves from Default mode to Filtering mode when pressing f', () => {
      const onEditStart = jest.fn();

      mountWithApp(
        <IndexFilters
          {...defaultProps}
          mode={IndexFiltersMode.Default}
          onEditStart={onEditStart}
          disableKeyboardShortcuts
        />,
      );

      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'f',
        }),
      );

      expect(onEditStart).not.toHaveBeenCalledWith(IndexFiltersMode.Filtering);
    });

    it('does not call the cancelAction.onAction method when pressing escape in Filtering mode', () => {
      mountWithApp(
        <IndexFilters
          {...defaultProps}
          mode={IndexFiltersMode.Filtering}
          disableKeyboardShortcuts
        />,
      );

      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
        }),
      );

      expect(defaultProps.cancelAction.onAction).not.toHaveBeenCalled();
    });

    it('does not call the cancelAction.onAction method when pressing escape in EditingColumns mode', () => {
      mountWithApp(
        <IndexFilters
          {...defaultProps}
          mode={IndexFiltersMode.EditingColumns}
          disableKeyboardShortcuts
        />,
      );

      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
        }),
      );

      expect(defaultProps.cancelAction.onAction).not.toHaveBeenCalled();
    });
  });

  describe('disabled', () => {
    it('renders Filters with the disabled props', () => {
      const filters: ComponentProps<typeof IndexFilters>['filters'] = [
        {
          key: 'foo',
          label: 'Foo',
          filter: <div>Filter</div>,
          pinned: false,
          onAction: jest.fn(),
        },
      ];

      const wrapper = mountWithApp(
        <IndexFilters
          {...defaultProps}
          filters={filters}
          mode={IndexFiltersMode.Filtering}
          disabled
        />,
      );

      expect(wrapper).toContainReactComponent(Filters, {
        filters,
        disableFilters: true,
        disableQueryField: true,
      });
    });

    it('renders UpdateButtons with the disabled props when filtering', () => {
      const wrapper = mountWithApp(
        <IndexFilters
          {...defaultProps}
          mode={IndexFiltersMode.Filtering}
          disabled
        />,
      );

      expect(wrapper).toContainReactComponent(UpdateButtons, {
        disabled: true,
      });
    });

    it('renders EditColumnsButton with the disabled prop', () => {
      const wrapper = mountWithApp(
        <IndexFilters {...defaultProps} disabled showEditColumns />,
      );

      expect(wrapper).toContainReactComponent(EditColumnsButton, {
        disabled: true,
      });
    });
  });

  describe('EditColumnsButton', () => {
    it('renders when showEditColumns is true', () => {
      const wrapper = mountWithApp(
        <IndexFilters {...defaultProps} showEditColumns />,
      );

      expect(wrapper).toContainReactComponent(EditColumnsButton);
    });

    it('does not renders when showEditColumns is false', () => {
      const wrapper = mountWithApp(
        <IndexFilters {...defaultProps} showEditColumns={false} />,
      );

      expect(wrapper).not.toContainReactComponent(EditColumnsButton);
    });

    it.each([IndexFiltersMode.EditingColumns, IndexFiltersMode.Filtering])(
      'does not renders when IndexFiltersMode is %s',
      (mode: IndexFiltersMode) => {
        const wrapper = mountWithApp(
          <IndexFilters {...defaultProps} mode={mode} showEditColumns />,
        );

        expect(wrapper).not.toContainReactComponent(EditColumnsButton);
      },
    );

    it('sets mode to EditingColumns when clicked', () => {
      const setMode = jest.fn();
      const wrapper = mountWithApp(
        <IndexFilters {...defaultProps} setMode={setMode} showEditColumns />,
      );
      wrapper.act(() => {
        wrapper.find(EditColumnsButton)!.trigger('onClick');
      });

      expect(setMode).toHaveBeenCalledWith(IndexFiltersMode.EditingColumns);
    });

    it('calls onEditStart with IndexFiltersMode.EditingColumns when clicked', () => {
      const onEditStart = jest.fn();
      const wrapper = mountWithApp(
        <IndexFilters
          {...defaultProps}
          onEditStart={onEditStart}
          showEditColumns
        />,
      );
      wrapper.act(() => {
        wrapper.find(EditColumnsButton)!.trigger('onClick');
      });

      expect(onEditStart).toHaveBeenCalledWith(IndexFiltersMode.EditingColumns);
    });
  });
});
