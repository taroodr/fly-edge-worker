import gql from "graphql-tag";
import * as _ from "lodash";

export const calcTagName = (parsedBody): string[] => {
  const ast = gql(parsedBody["query"]);
  const tags = ast.definitions.map(definition => {
    return definition.selectionSet.selections.map(selection => {
      return selection.name.value;
    });
  });

  // Query名の配列を返す
  // {
  //   allFilms {
  //     films {
  //       title
  //       episodeID
  //     }
  //   }
  // }
  // の場合 ["allFilms"]
  return _.flatten(tags);
};
