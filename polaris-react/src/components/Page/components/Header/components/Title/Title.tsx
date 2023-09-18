import React from 'react';

import {classNames} from '../../../../../../utilities/css';
import {Bleed} from '../../../../../Bleed';
import {Text} from '../../../../../Text';
import {useFeatures} from '../../../../../../utilities/features';

import styles from './Title.scss';

export interface TitleProps {
  /** Page title, in large type */
  title?: string;
  /** Page subtitle, in regular type */
  subtitle?: string;
  /** Important and non-interactive status information shown immediately after the title. */
  titleMetadata?: React.ReactNode;
  /** Removes spacing between title and subtitle */
  compactTitle?: boolean;
}

export function Title({
  title,
  subtitle,
  titleMetadata,
  compactTitle,
}: TitleProps) {
  const {polarisSummerEditions2023} = useFeatures();
  const className = classNames(
    styles.Title,
    subtitle && styles.TitleWithSubtitle,
  );

  const titleMarkup = title ? <h1 className={className}>{title}</h1> : null;

  const titleMetadataMarkup = titleMetadata ? (
    <Bleed marginBlock="1">{titleMetadata}</Bleed>
  ) : null;

  const wrappedTitleMarkup = (
    <div className={styles.TitleWrapper}>
      {titleMarkup}
      {titleMetadataMarkup}
    </div>
  );

  const subtitleMarkup = subtitle ? (
    <div
      className={classNames(
        styles.SubTitle,
        compactTitle && styles.SubtitleCompact,
      )}
    >
      <Text as="p" variant={polarisSummerEditions2023 ? 'bodySm' : undefined}>
        {subtitle}
      </Text>
    </div>
  ) : null;

  return (
    <>
      {wrappedTitleMarkup}
      {subtitleMarkup}
    </>
  );
}
