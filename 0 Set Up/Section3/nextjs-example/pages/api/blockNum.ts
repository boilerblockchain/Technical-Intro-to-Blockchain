import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

type Data = {
  blockNum: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const provider = ethers.getDefaultProvider("mainnet");
    const blockNum = await provider.getBlockNumber();
    return res.status(200).json({ blockNum });
  }

  res.status(405).setHeader("Allow", ["GET"]).end();
}
