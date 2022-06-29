
sha256.js- 
STEP 1: Pad the message so that its length is an integral multiple of
512 bits, the block size. The only complication here is that the last
64 bits of the last block must contain a value that is the length of
the message.

STEP 2: Generate the MESSAGE SCHEDULE required for processing
a 512-bit block of the input message. The message schedule consists
of 64 32-bit words. The first 16 of these words are obtained directly
from the 512-bit message block. The rest of the words are obtained
by applying permutation and mixing operations to the some of the
previously generated words.

STEP 3: Apply round-based processing to each 512-bit input message
block. There are 64 rounds to be carried out for each block. For this
round-based processing, we first store the hash values calculated for
the PREVIOUS MESSAGE BLOCK in temporary 32-bit variables
denoted a, b, c, d, e, f, g, h. In the ith round, we permute the values
stored in these eight variables and, with two of the variables, we mix
in the message schedule word words[i] and a round constant K[i].

STEP 4: We update the hash values calculated for the PREVIOUS
message block by adding to it the values in the temporary variables
a, b, c, d, e, f, g, h.