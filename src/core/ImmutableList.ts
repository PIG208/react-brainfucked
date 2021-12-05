type TreeNode<V> = {
  size: number;
  key: number;
  value: V;
  left?: TreeNode<V>;
  right?: TreeNode<V>;
};

const buildTree = <V>(data: V[], start: number, end: number): TreeNode<V> => {
  if (start > end) throw new Error("Cannot parse an empty array");

  const mid = start + Math.floor((end - start) / 2);
  const left = start < mid ? buildTree(data, start, mid - 1) : undefined;
  const right = end > mid ? buildTree(data, mid + 1, end) : undefined;
  return {
    size: (left?.size ?? 0) + (right?.size ?? 0) + 1,
    key: mid,
    value: data[mid],
    left: left,
    right: right,
  };
};

const queryTree = <V>(key: number, node?: TreeNode<V>): V => {
  if (!!!node) throw new Error("List index out of bounds");
  if (node.key === key) return node.value;

  return node.key > key ? queryTree(key, node.left) : queryTree(key, node.right);
};

const updateTree = <V>(key: number, value: V, node?: TreeNode<V>): TreeNode<V> => {
  if (!!!node) throw new Error("List index out of bounds");
  let newNode = Object.assign({}, node);

  if (newNode.key === key) {
    newNode.value = value;
    return newNode;
  }

  if (newNode.key > key) {
    newNode.left = updateTree(key, value, newNode.left);
  } else {
    newNode.right = updateTree(key, value, newNode.right);
  }

  return newNode;
};

const sliceTree = <V>(result: V[], start: number, end: number, node?: TreeNode<V>) => {
  if (!!!node) throw new Error("List index out of range");

  if (node.left) sliceTree(result, start, end, node.left);
  if (node.key >= start && node.key < end) result.push(node.value);
  if (node.right) sliceTree(result, start, end, node.right);
};

const createList = <V>(data: V[]): List<V> => new List({ fromArray: true, array: data });

export class List<V> {
  root: TreeNode<V>;
  constructor(data: { fromArray: true; array: V[] } | { fromArray: false; root: TreeNode<V> }) {
    if (data.fromArray) {
      this.root = buildTree(data.array, 0, data.array.length - 1);
    } else {
      this.root = data.root;
    }
  }

  query(key: number): V {
    return queryTree(key, this.root);
  }

  /**
   * Perform an efficient immutable update to the list
   */
  update(key: number, value: V): List<V> {
    const newRoot = updateTree(key, value, this.root);
    return new List({ fromArray: false, root: newRoot });
  }

  slice(start: number, end: number): V[] {
    let result: V[] = [];
    sliceTree(result, start, end, this.root);
    return result;
  }

  size(): number {
    return this.root.size;
  }
}

export default createList;
