import { Entities, IdTreeNode, PagingResponse, PagingSuccess, TreeNode, } from 'types.ts';
import { walkTree } from '../../utils/tree';

export function makeQueryParams<
  Q extends {}, E extends Q, U extends keyof Q,
>(
  query: Q,
  exist: E,
  keys: U[],
): Pick<Q, U> {
  return keys.reduce((p, key) => {
    const q = query[key] === undefined ? exist[key] : query[key];

    return ({
      ...p,
      [key]: q,
    });
  }, {} as Pick<Q, U>);
}

export function normalizeTree<
  T extends TreeNode, P extends T & { childs?: P[] }
>(
  nodes: P[],
  formatter?: (node: P, parent?: T) => P,
  idKey: 'id' | 'pathname' = 'id',
  parentId: string = '1',
  filter: (node: P, parent?: T) => boolean = () => true,
): {
    idTree: IdTreeNode[];
    entities: Entities<T>;
  } {
  const idTree: IdTreeNode[] = [];
  const entities: Entities<T> = {};

  if (nodes != null && nodes.length > 0) {
    const first = nodes[0];

    const childrenKey = 'childs' in first ? 'childs' : 'children';

    walkTree(nodes, (node, parent, idTreeNode: IdTreeNode): IdTreeNode | boolean => {
      const p = parent ? entities[`${idTreeNode[idKey]}`] : null;

      let pathname = '';

      if (p) {
        pathname = `${p.pathname},${node.id}`;
      } else if (node.parentId) {
        pathname = `${node.parentId},${node.id}`;
      } else {
        pathname = `${parentId},${node.id}`;
      }

      const id = {
        pathname,
        id: node.id,
        level: pathname.split(',').length - 1,
      };

      const children = node[childrenKey] as P[];

      if (!filter(node, p)) {
        return false;
      }

      const entity = {
        ...(formatter ? formatter(node, p) : node),
        pathname,
        parentId: node.parentId || (parent && parent.id),
      };

      delete entity[childrenKey];

      entity.childrenIds = children && children.map(c => c.id);

      entities[`${entity[idKey]}`] = entity;

      if (Array.isArray(idTreeNode)) {
        idTreeNode.push(id);
      } else if (idTreeNode.children) {
        idTreeNode.children.push(id);
      } else {
        idTreeNode.children = [id];
      }

      return id;
    }, childrenKey, null, idTree);
  }

  return { idTree, entities };
}

export function normalizePage<T extends { id:string }>(
  response: PagingResponse<T>,
  getKey: (v: T) => string = v => v.id,
): PagingSuccess<T> {
  const { result, totalNumber } = response;

  return {
    total: totalNumber,
    ids: result.map(d => getKey(d)),
    entities: result.reduce((p, c) => ({ ...p, [getKey(c)]: c }), {}),
  };
}

type DataValue = string | number;

export function shakeEmptyTreeNode<
  T extends {
    children?: T[];
    data: DataValue[] | { [s:string]: DataValue };
    excluded?: boolean;
    parentExcluded?: boolean;
  }
>(nodes: T[]): T[] {
  if (nodes == null) {
    return null;
  }

  const shaken = nodes.map(node => {
    const children = shakeEmptyTreeNode(node.children);

    const { data } = node;

    let isEmpty = children == null && !node.excluded && !node.parentExcluded;

    if (isEmpty) {
      if (data != null) {
        if (Array.isArray(data)) {
          isEmpty = data.filter(d => d != null).length === 0;
        } else {
          isEmpty = Object.values(data).every(d => d == null);
        }
      }
    }

    return {
      ...node,
      children,
      isEmpty,
    };
  }).filter(({ isEmpty }) => !isEmpty);

  return shaken.length > 0 ? shaken : null;
}
