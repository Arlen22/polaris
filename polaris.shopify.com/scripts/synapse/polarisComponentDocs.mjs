import {readFileSync} from 'fs';
import {resolve} from 'path';
import {unified} from 'unified';
// import remarkParse from 'remark-parse';
import {stripIndents} from 'common-tags';
// import remarkFrontmatter from 'remark-frontmatter';
import matter from './matter.mjs';

export default function polarisComponentDocs(options) {
  const parser = (contents, file) => {
    // turn the file into an AST
    // const tree = unified().use(remarkParse).use(remarkFrontmatter).parse(file);
    // console.log(tree);

    // add the front matter as an object to the file
    // TODO find a way to remove frontmatter from the file contents to avoid referencing
    // example files like alphacarddefault.tsx
    unified().use(matter).parse(file);
    // console.log(file.data.matter);
    const slug = file.history[0].replace('.md', '').replace('./content', '');
    const title = file.data.matter.title;
    // const description = file.data.matter.description;
    let exampleBits;

    if (file.data.matter.examples?.length > 0) {
      exampleBits = file.data.matter.examples.map((e) => {
        const filepath = resolve(process.cwd(), `pages/examples/${e.fileName}`);
        const example = readFileSync(filepath).toString();
        return {
          type: 'BitNode',
          data: {
            title: `${title} component ${e.title}`,
            text: stripIndents(example),
            slug,
          },
        };
      });
    }

    // console.log(exampleBits);

    // throw 'eh';
    const docBit = {
      type: 'BitNode',
      data: {
        title: file.data.matter?.title,
        text: stripIndents(contents),
        slug,
      },
    };

    const allBits = exampleBits ? [docBit, ...exampleBits] : [docBit];

    // console.log(allBits);
    // throw 'eh';

    const constructed = {
      type: 'root',
      children: allBits,
    };

    return constructed;
  };

  Object.assign(this, {Parser: parser});
}