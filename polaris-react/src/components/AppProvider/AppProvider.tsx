import React, {Component} from 'react';

import {EphemeralPresenceManager} from '../EphemeralPresenceManager';
import {MediaQueryProvider} from '../MediaQueryProvider';
import {FocusManager} from '../FocusManager';
import {PortalsManager} from '../PortalsManager';
import {I18n, I18nContext} from '../../utilities/i18n';
import {
  ScrollLockManager,
  ScrollLockManagerContext,
} from '../../utilities/scroll-lock-manager';
import {
  StickyManager,
  StickyManagerContext,
} from '../../utilities/sticky-manager';
import {LinkContext} from '../../utilities/link';
import type {LinkLikeComponent} from '../../utilities/link';
import {
  FeaturesContext,
  classNamePolarisSummerEditions2023,
  classNamePolarisSummerEditions2023ShadowBevelOptOut,
} from '../../utilities/features';
import type {FeaturesConfig} from '../../utilities/features';

import './AppProvider.scss';
import './global.scss';

interface State {
  intl: I18n;
  link: LinkLikeComponent | undefined;
}

export interface AppProviderProps {
  theme?: 'light' | 'light-uplift';
  /** A locale object or array of locale objects that overrides default translations. If specifying an array then your primary language dictionary should come first, followed by your fallback language dictionaries */
  i18n: ConstructorParameters<typeof I18n>[0];
  /** A custom component to use for all links used by Polaris components */
  linkComponent?: LinkLikeComponent;
  /** For toggling features */
  features?: FeaturesConfig;
  /** Inner content of the application */
  children?: React.ReactNode;
}

export class AppProvider extends Component<AppProviderProps, State> {
  private stickyManager: StickyManager;
  private scrollLockManager: ScrollLockManager;

  constructor(props: AppProviderProps) {
    super(props);
    this.stickyManager = new StickyManager();
    this.scrollLockManager = new ScrollLockManager();

    const {i18n, linkComponent} = this.props;

    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      link: linkComponent,
      intl: new I18n(i18n),
    };
  }

  componentDidMount() {
    if (document != null) {
      this.stickyManager.setContainer(document);
      this.setBodyStyles();
      this.setRootAttributes();
    }
  }

  componentDidUpdate({
    i18n: prevI18n,
    linkComponent: prevLinkComponent,
  }: AppProviderProps) {
    const {i18n, linkComponent} = this.props;

    this.setRootAttributes();

    if (i18n === prevI18n && linkComponent === prevLinkComponent) {
      return;
    }

    this.setState({
      link: linkComponent,
      intl: new I18n(i18n),
    });
  }

  setBodyStyles = () => {
    document.body.style.backgroundColor = 'var(--p-color-bg-app)';
    document.body.style.color = 'var(--p-color-text)';
  };

  setRootAttributes = () => {
    const features = this.getFeatures();
    const theme = this.getTheme();

    document.documentElement.classList.toggle(
      'p-theme-light-uplift',
      theme === 'light-uplift',
    );

    document.documentElement.classList.toggle(
      classNamePolarisSummerEditions2023,
      features.polarisSummerEditions2023,
    );

    document.documentElement.classList.toggle(
      classNamePolarisSummerEditions2023ShadowBevelOptOut,
      features.polarisSummerEditions2023ShadowBevelOptOut,
    );
  };

  getTheme = () => this.props.theme ?? 'light';

  getFeatures = () => {
    const {features} = this.props;

    return {
      ...features,
      polarisSummerEditions2023: features?.polarisSummerEditions2023 ?? false,
      polarisSummerEditions2023ShadowBevelOptOut:
        features?.polarisSummerEditions2023ShadowBevelOptOut ?? false,
    };
  };

  render() {
    const {children} = this.props;
    const features = this.getFeatures();

    const {intl, link} = this.state;

    return (
      <FeaturesContext.Provider value={features}>
        <I18nContext.Provider value={intl}>
          <ScrollLockManagerContext.Provider value={this.scrollLockManager}>
            <StickyManagerContext.Provider value={this.stickyManager}>
              <LinkContext.Provider value={link}>
                <MediaQueryProvider>
                  <PortalsManager>
                    <FocusManager>
                      <EphemeralPresenceManager>
                        {children}
                      </EphemeralPresenceManager>
                    </FocusManager>
                  </PortalsManager>
                </MediaQueryProvider>
              </LinkContext.Provider>
            </StickyManagerContext.Provider>
          </ScrollLockManagerContext.Provider>
        </I18nContext.Provider>
      </FeaturesContext.Provider>
    );
  }
}
