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
  console.debug("BUILD TREE");
  const leafNodeHashes = Array.from(dataStorage.keys()).sort();
  console.debug("leafNodeHashes", leafNodeHashes);

  let remainingNodes = leafNodeHashes.map((hash) => ({ value: hash }));
  let parentNodes = [];
  for (let i = 0; i < remainingNodes.length; i += NUM_CHILDREN) {
    const siblingNodes = remainingNodes.slice(i, i + NUM_CHILDREN);
    const siblingHashes = siblingNodes.map((node) => node.value);

    const parentNode = {
      value: testHash(...siblingHashes),
      children: siblingHashes,
    };

    console.debug({ parentNode });
    parentNodes.push(parentNode);
    treeStorage.set(parentNode.value, parentNode);

    // go to next level
    console.debug({ i, remainingNodes, parentNodes });
    if (i + NUM_CHILDREN >= remainingNodes.length && parentNodes.length > 1) {
      remainingNodes = parentNodes;
      parentNodes = [];
      i = 0;
      console.debug("NEXT LEVEL");
    }
  }

  rootHash = parentNodes[0].value;
  console.debug({ rootHash });
};

const drawTree = () => {
  const queue = [rootHash, null];

  let depth = 0;
  let siblingIndex = 0;

  while (queue.length) {
    let currHash = queue.shift();
    if (currHash == null) {
      if (!queue.length) break;

      queue.push(null);
      depth++;
      siblingIndex = 0;
      continue;
    }

    let currNode = treeStorage.get(currHash);

    drawNode(currNode.value, depth, siblingIndex);

    siblingIndex++;
  }
};

const drawNode = (text, depth, siblingIndex) => {
  const node = document.createElement("div");
  const levelHeight = 50;
  const nodeWidth = 100;
  node.textContent = text;
  node.style.transform = `translate(${depth * levelHeight}px, ${
    siblingIndex * nodeWidth
  })`;

  treeBox.appendChild(node);
};

const insertLeaf = (value) => {
  const key = testHash(value);
  dataStorage.set(key, value);

  treeStorage.clear();
  treeBox.textContent = "";
  buildTree();
  drawTree();
  //storage.set(key, { data: value });

  // const rootKey = storage.keys[0];
};

const treeBox = document.getElementById("treeBox");
const controlBox = document.getElementById("controlBox");
const storageBox = document.getElementById("storageBox");
const addButton = document.getElementById("addButton");
const dataInput = document.getElementById("dataInput");

addButton.addEventListener("click", () => insertLeaf(dataInput.value));
