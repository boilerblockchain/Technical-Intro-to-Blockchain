import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Layout } from "../../components/Layout";

// import { AnimatedTree } from "react-tree-graph";
import { Tree } from "react-tree-graph";
import "react-tree-graph/dist/style.css";
import { TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const hash = (...inputs: string[]) => {
  return `(${inputs.join(",")})`.slice(0, 4);
};

interface TreeNode {
  name: string;
  children: TreeNode[] | LeafNode[];
}

interface LeafNode {
  name: string;
}
const buildTree = (leaves: string[], k: number = 2) => {
  const leafNodes = leaves.map((leaf) => [leaf, { name: leaf }]);
  const treeMap = new Map<string, TreeNode | LeafNode>(leafNodes);
  console.log("init", leafNodes);
  const queue = [null, ...leaves];

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
    const children = queue.splice(0, j) as string[];

    // If we don't have k nodes, simply move leftover nodes to the next layer
    if (children.length < k) {
      queue.push(...children);
      continue;
    }

    // A way to combine k nodes e.g hash functions. This is for show.
    const key = hash(...children);
    queue.push(key);
    const descendants = children.map((child) => treeMap.get(child));
    treeMap.set(key, { name: key, children: descendants });
  }

  if (queue.length !== 1) return { map: null, root: null };

  return { map: treeMap, root: queue[0] };
};

// const convertKeyPairsToObj = (treeMap: Map<string, string[]>, root: string) => {
//   console.log("ckp", treeMap, root);
//   const children = treeMap.get(root) as string[];
//   const node = {
//     name: root,
//     children: children.map((child) => convertKeyPairsToObj(treeMap, child)),
//   };
//   return node;
// };

const DEFAULT_TREE = {
  name: "Parent",
  children: [
    {
      name: "Child One",
    },
    {
      name: "Child Two",
    },
  ],
};
const Merkle: NextPage = () => {
  const [value, setValue] = useState("");
  const [keyValues, setKeyValues] = useState(new Map<string, string>());

  const [treeData, setTreeData] = useState(DEFAULT_TREE);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = hash(value);
    setKeyValues(new Map(keyValues.set(key, value)));
  };

  const onChangeAddValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const leaves = Array.from(keyValues.keys());
    const { map: treeMap, root } = buildTree(leaves);
    if (treeMap == null) {
      return;
    }
    setTreeData(treeMap.get(root));
  }, [keyValues]);

  return (
    <Layout title="Merkle Tree">
      <form onSubmit={onFormSubmit}>
        <Typography variant="h5">Data</Typography>
        <TextField
          variant="outlined"
          size="small"
          value={value}
          onChange={onChangeAddValue}
        />
      </form>
      <Tree data={treeData} width={800} height={600} />
    </Layout>
  );
};
export default Merkle;
