import _ from 'lodash';

export function walkTree<T extends { [key: string]: any}, P extends {}>(
  treeNodes: T[],
  walk: (node: T, parent?: T, payload?: P) => P | boolean | void,
  childrenKey: string = 'children',
  parent: T = null,
  payload?: any,
) {
  if (!Array.isArray(treeNodes)) {
    return;
  }

  for (let i = 0; i < treeNodes.length; i += 1) {
    const node = treeNodes[i];
    const p = walk(node, parent, payload);
    if (p !== false) {
      const children = node[childrenKey];
      if (children && children.length > 0) {
        walkTree(children, walk, childrenKey, node, p);
      }
    }
  }
}

export function treeToArray<
  T extends { [key: string]: any },
  R extends T & { path: string[], parentId: string, children: string[] }
>(
  nodes: T[],
  key: string = 'id',
  childrenKey: string = 'children',
  path: string[] = [],
): R[] {
  if (nodes == null || nodes.length === 0) {
    return [];
  }

  return nodes.reduce(
    (p: R[], treeNode) => {
      const children = treeNode[childrenKey] as T[] || [];
      const nodePath = [...path, treeNode[key] as string];

      const r = {
        ..._.omit(treeNode, [childrenKey]),
        children: children.map(cn => cn[key] as string),
        path: nodePath,
        parentId: path[path.length - 1],
      } as R;

      const c = treeToArray(children, key, childrenKey, nodePath) as R[];

      return [...p, r, ...c];
    },
    [],
  );
}

export function mapTreeNode<
  T extends { [key: string]: any},
  R extends { children?: R[] }
>(
  treeNodes: T[],
  mapper: (n: T, p: R | null) => R,
  childrenKey: string = 'children',
  parent: R | null = null,
): R[] {
  const ps = [];

  for (let i = 0; i < treeNodes.length; i += 1) {
    const t = treeNodes[i];

    const p = mapper(t, parent);

    if (p) {
      const children = t[childrenKey] as T[];

      if (children && children.length > 0) {
        p.children = mapTreeNode(children, mapper, childrenKey, p);
      }
    }

    ps.push(p);
  }

  return ps.filter(s => s != null);
}
