/**
 * Temporary hash functions for dev
 *
 */
const testHash = (...input) => {
  return `{${input.join(",")}}`;
};

/** Children per node. 2 for binary tree */
const NUM_CHILDREN = 2;

/** Stores all the nodes in the Merkle tree.
 * The nodes are the values, and the associated hashes are the keys
 */
const treeStorage = new Map();

/** Stores the actual data, which are the leaf nodes in the tree.
 * The data is the value, and the hash of the data is the key
 */
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

const insertTreeNodes = () => {
  const leafNodeHashes = Array.from(dataStorage.keys()).sort();

  let remainingNodes = leafNodeHashes.map((hash) => ({ value: hash }));
  let parentNodes = [];
  for (let i = 0; i < remainingNodes.length; i += NUM_CHILDREN) {
    const siblingNodes = remainingNodes.slice(i, i + NUM_CHILDREN);
    const siblingHashes = siblingNodes.map((node) => node.value);

    const parentNode = {
      value: testHash(...siblingHashes),
      children: siblingHashes,
    };

    parentNodes.push(parentNode);
    treeStorage.set(parentNode.value, parentNode);

    if (i + NUM_CHILDREN >= remainingNodes.length && parentNodes.length > 1) {
      remainingNodes = parentNodes;
      parentNodes = [];
      i = -NUM_CHILDREN;
    }
  }

  rootHash = parentNodes.length ? parentNodes[0].value : null;
  // console.debug(Array.from(treeStorage.entries()).map(([k, v]) => ({ k, v })));
};

const drawTree = (container) => {
  container.textContent = "";

  if (rootHash == null) return;

  const queue = [rootHash, null];

  let depth = 0;
  let siblingIndex = 0;

  const treeHeight = Math.ceil(
    Math.log(dataStorage.size) / Math.log(NUM_CHILDREN)
  );

  while (queue.length) {
    const currHash = queue.shift();
    if (currHash == null) {
      if (!queue.length) break;

      queue.push(null);
      depth++;
      siblingIndex = 0;
      continue;
    }

    const currNode = treeStorage.get(currHash);
    const text = currHash;
    // text = currNode.value;
    if (currNode) {
      queue.push(...currNode.children);
    }

    drawNode(container, text, treeHeight, depth, siblingIndex);

    siblingIndex++;
  }
};

/**
 *  Braindead node positioning
 *  Don't look at this, use a library pls
 */
const drawNode = (container, text, treeHeight, depth, siblingIndex) => {
  const node = document.createElement("span");

  node.textContent = text;
  node.style.position = "absolute";

  const invHeight = treeHeight - depth;

  const leftOffsetUnits = invHeight ? Math.pow(2, invHeight - 1) - 1 / 2 : 0;
  const leftOffset = leftOffsetUnits * spacing;

  const siblingOffset = siblingIndex * Math.pow(2, invHeight) * spacing;

  const leftDistance = leftOffset + siblingOffset;

  node.style.transform = `translate(${leftDistance}px, ${
    depth * nodeHeight
  }px)`;
  node.style.width = `${nodeWidth}px`;
  node.style.height = `${nodeHeight}px`;

  node.style.backgroundColor = "red";

  container.appendChild(node);
};

const buildTree = () => {
  treeStorage.clear();
  insertTreeNodes();
  drawTree(treeBox);
};

const handleUnfocusKeypress = (element) => (event) => {
  console.debug(event.key);
  if (event.key === "Enter") {
    element.blur();
  }
};

const updateData = (oldValue) => {
  const d1 = document.getElementById(oldValue);
  // nothing changed
  if (d1.textContent === oldValue) {
    return;
  }
  // console.debug("updateDate", oldValue);
  const oldHash = testHash(oldValue);

  const d2 = document.getElementById(oldHash);

  const newHash = testHash(d1.textContent);
  if (dataStorage.has(newHash)) {
    alert("Can't change to value that already exists");
    d1.textContent = oldValue;
    return;
  }

  dataStorage.delete(oldHash);
  dataStorage.set(newHash, d1.textContent);

  d2.textContent = newHash;
  d2.id = newHash;

  const clone = d1.cloneNode(true);
  clone.id = clone.textContent;
  console.debug("textContet", clone.textContent);

  // TODO some weird reference kept if using clone.textContent, replaced with clone.id for now
  clone.addEventListener("blur", () => updateData(clone.id));
  d1.parentElement.replaceChild(clone, d1);
  clone.addEventListener("keypress", handleUnfocusKeypress(clone));

  buildTree();
};

const insertLeaf = (value) => {
  const key = testHash(value);
  if (dataStorage.has(key)) {
    alert("Value already exists");
    return;
  }
  dataStorage.set(key, value);

  const row = document.createElement("tr");
  const d1 = document.createElement("td");
  const d2 = document.createElement("td");
  const d3 = document.createElement("td");
  const deleteButton = document.createElement("button");

  d1.setAttribute("contentEditable", "true");
  d1.addEventListener("blur", () => updateData(value));
  d1.addEventListener("keypress", handleUnfocusKeypress(d1));
  d1.id = value;
  d1.textContent = value;

  d2.id = key;
  d2.textContent = key;

  deleteButton.classList.add("deleteButton");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => {
    dataStorage.delete(
      deleteButton.parentElement.previousElementSibling.textContent
    );
    console.debug(
      deleteButton.parentElement.previousElementSibling.textContent
    );
    row.remove();
    buildTree();
  });

  d3.appendChild(deleteButton);

  row.append(d1, d2, d3);
  el.storageTableBody.appendChild(row);

  //storage.set(key, { data: value });

  // const rootKey = storage.keys[0];
  buildTree();
};

const updateLeaf = (key) => {
  dataStorage.set(key, value);
};

/**
 * Initializing Stuffs
 */
const el = Object.fromEntries(
  [
    "treeBox",
    "dataInput",
    "dataForm",
    "nodeWidthInput",
    "nodeWidthText",
    "nodeHeightInput",
    "nodeHeightText",
    "spacingInput",
    "spacingText",
    "storageTableBody",
  ].map((id) => {
    const element = document.getElementById(id);
    return [id, element];
  })
);

let nodeHeight;
let nodeWidth;
let spacing;

const updateNodeWidth = (width) => {
  nodeWidth = width;
  el.nodeWidthText.textContent = `${nodeWidth} px`;
};
const updateNodeHeight = (height) => {
  nodeHeight = height;
  el.nodeHeightText.textContent = `${nodeHeight} px`;
};
const updateSpacing = (newSpacing) => {
  spacing = newSpacing;
  el.spacingText.textContent = `${spacing} px`;
};

updateNodeWidth(60);
updateNodeHeight(40);
updateSpacing(80);

el.nodeWidthInput.addEventListener("input", (e) =>
  updateNodeWidth(e.target.value)
);
el.nodeHeightInput.addEventListener("input", (e) =>
  updateNodeHeight(e.target.value)
);
el.spacingInput.addEventListener("input", (e) => updateSpacing(e.target.value));

el.nodeWidthInput.addEventListener("change", () => drawTree(treeBox));
el.nodeHeightInput.addEventListener("change", () => drawTree(treeBox));
el.spacingInput.addEventListener("change", () => drawTree(treeBox));

el.dataForm.addEventListener("submit", (e) => {
  e.preventDefault();
  insertLeaf(dataInput.value);
  dataInput.value = "";
});

// addButton.addEventListener("click", () => insertLeaf(dataInput.value));

/**
 *
 * Showable code / exercises based on chainshot exercises
 *
 *
 */

class MerkleTree {
  constructor(leaves) {
    this.leaves = leaves;
  }

  /**
   * Calculates a Merkle Tree root from leaves
   *
   * This is an iterative approach. Try creating a recursive solution as an exercise?
   */
  getRoot(k = 2) {
    const queue = [null, ...this.leaves];

    while (true) {
      // This adds a `null` after every "layer" of the tree
      // Since we know we hit a new layer if the top of the queue is a `null`
      if (queue[0] == null) {
        queue.shift();

        // This ends the entire loop once there are not enough nodes for another layer
        if (queue.length < k) {
          break;
        }
        queue.push(null);
      }

      // Grab up to k siblings, without including nodes from the next layer
      let j;
      for (j = 0; j < k; j++) {
        if (queue[j] == null) break;
      }
      const siblings = queue.splice(0, j);

      // If we don't have k nodes, simply move leftover nodes to the next layer
      if (siblings.length < k) {
        queue.push(...siblings);
        continue;
      }

      // A way to combine k nodes e.g hash functions. This is for show.
      const combo = `(${siblings.join("+")})`;
      queue.push(combo);
    }

    // Returns the root or the leftover nodes if we can't make a k-nary tree
    return queue.length === 1 ? queue[0] : queue;
  }

  getProof(hash) {
    return this.getProofByIndex(this.leaves.indexOf(hash));
  }

  getProofByIndex(index) {
    const proof = [];
    const queue = [null, ...this.leaves];

    while (true) {
      if (queue[0] == null) {
        queue.shift();

        if (queue.length < k) {
          break;
        }

        ///////////////////////////////
        // Generate proof part
        ///////////////////////////////
        const left = index % 2;
        const pair = left ? index - 1 : index + 1;
        if (pair < queue.length) {
          proof.push({ data: queue[pair], left });
        }
        index = Math.floor(index / 2);
        ///////////////////////////////

        queue.push(null);
      }

      let j;
      for (j = 0; j < k; j++) {
        if (queue[j] == null) break;
      }
      const siblings = queue.splice(0, j);

      if (siblings.length < k) {
        queue.push(...siblings);
        continue;
      }

      const combo = `(${siblings.join("+")})`;
      queue.push(combo);
    }

    return proof;
  }
}

const verifyProof = (proof, node, root, concat) => {
  let hash = node;
  for (node of proof) {
    if (node.left) {
      hash = concat(node.data, hash);
    } else {
      hash = concat(hash, node.data);
    }
  }
  return hash === root;
};

/* console.log(getRoot([])) */
/* console.log(getRoot(['A'])) */
// console.log(getRoot(["A", "B", "C", "D", "E"]));
