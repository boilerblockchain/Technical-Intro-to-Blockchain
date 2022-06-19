/**
 * Temporary hash functions for dev
 *
 */
const testHash = (...input) => {
  return `{${input.join(",")}}`;
};

const NUM_CHILDREN = 2;

/**
 * Maps as key-value storage
 * Maps a Hash to TreeNode | LeafNode | data/string
 */
const treeStorage = new Map();
const dataStorage = new Map();

// interface LeafNode {
//   /** The key used to access our data from storage */
//   value: Hash;
// }

// interface TreeNode {
//   /** The hash of all children */
//   value: Hash;
//   children: Hash[];
// }

let rootHash;

const buildTree = () => {
  const leafNodeHashes = Array.from(dataStorage.keys()).sort();

  const remainingNodes = leafNodeHashes.map((hash) => ({ value: hash }));
  const parentNodes = [];
  for (let i = 0; i < remainingNodes.length; i += NUM_CHILDREN) {
    const siblingNodes = remainingNodes.slice(i, i + NUM_CHILDREN);
    const siblingHashes = siblingNodes.map((node) => node.value);

    const parentNode = {
      value: testHash(...siblingHashes),
      children: siblingHashes,
    };
    parentNodes.push(parentNode);
    treeStorage.set(parentNode.value, parentNode);

    // go to next level
    if (i + NUM_CHILDREN >= remainingNodes.length && parentNodes.length > 1) {
      remainingNodes = parentNodes;
      parentNodes = [];
      i = 0;
    }
  }

  rootHash = parentNodes[0].value;
};

const displayTree = () => {};

const insertLeaf = (value) => {
  const key = testHash(value);
  dataStorage.set(key, value);

  buildTree();
  //storage.set(key, { data: value });

  // const rootKey = storage.keys[0];
};

const treeBox = document.getElementById("treeBox");
const controlBox = document.getElementById("controlBox");
const storageBox = document.getElementById("storageBox");
const addButton = document.getElementById("addButton");
const dataInput = document.getElementById("dataInput");
