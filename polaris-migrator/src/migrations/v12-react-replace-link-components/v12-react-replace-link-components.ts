import type {API, FileInfo, JSXAttribute, JSXOpeningElement} from 'jscodeshift';

import {
  insertJSXAttribute,
  insertJSXComment,
  removeJSXAttributes,
  renameProps,
  replaceJSXAttributes,
} from '../../utilities/jsx';
import {POLARIS_MIGRATOR_COMMENT} from '../../constants';

export default function v12ReactReplaceLinkComponents(
  fileInfo: FileInfo,
  {jscodeshift: j}: API,
) {
  const source = j(fileInfo.source);

  const localElementName = 'Link';

  source.findJSXElements(localElementName).forEach((element) => {
    const allAttributes =
      (j(element).find(j.JSXOpeningElement).get().value as JSXOpeningElement)
        .attributes ?? [];

    if (allAttributes.some((attribute) => attribute.type !== 'JSXAttribute')) {
      insertJSXComment(j, element, POLARIS_MIGRATOR_COMMENT);
      return;
    }

    const jsxAttributes = allAttributes as JSXAttribute[];

    const monochromeAttribute = jsxAttributes.find(
      (attribute) => attribute.name.name === 'monochrome',
    );

    if (monochromeAttribute && monochromeAttribute.value !== null) {
      insertJSXComment(j, element, POLARIS_MIGRATOR_COMMENT);
      return;
    }

    const isMonochrome = Boolean(monochromeAttribute);

    const removeUnderlineAttribute = jsxAttributes.find(
      (attribute) => attribute.name.name === 'removeUnderline',
    );

    if (removeUnderlineAttribute && removeUnderlineAttribute.value !== null) {
      insertJSXComment(j, element, POLARIS_MIGRATOR_COMMENT);
      return;
    }

    const isNotUnderlined = Boolean(removeUnderlineAttribute);

    const externalAttribute = jsxAttributes.find(
      (attribute) => attribute.name.name === 'external',
    );

    if (externalAttribute && externalAttribute.value !== null) {
      insertJSXComment(j, element, POLARIS_MIGRATOR_COMMENT);
      return;
    }

    const isExternal = Boolean(externalAttribute);

    const options = {
      componentName: localElementName,
      from: 'url',
      to: 'href',
    };

    const componentName = options.componentName;
    const props = {[options.from]: options.to};

    renameProps(j, source, componentName, props);

    if (isMonochrome) {
      insertJSXAttribute(j, element, 'tone', 'inherit');
      removeJSXAttributes(j, element, 'monochrome');
    }

    if (isNotUnderlined) {
      replaceJSXAttributes(j, element, 'removeUnderline', '', '');
    }

    if (isExternal) {
      insertJSXAttribute(j, element, 'target', '_blank');
      removeJSXAttributes(j, element, 'external');
    }
  });

  return source.toSource();
}
