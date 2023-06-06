import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: #e5e5e5;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 50px;

  button {
    width: 100px;
    padding: 10px;
    border: none;
    background-color: #8dfe89;
    border-radius: 10px;
    font-weight: 700;
    &:hover {
      color: white;
      background-color: black;
      cursor: pointer;
    }
  }

  section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 30px;
    padding: 10%;
  }

  .nftDiv {
    padding: 10px;
    background-color: #141414;
    border-radius: 20px;
    color: white;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25);
    img {
      width: 140px;
      border-radius: 10px;
    }
    p {
      font-size: 14px;
    }
  }
`;

export default function UserNfts() {
  const [nfts, setNfts] = useState([]);

  const [user, setUser] = useState({ loggedIn: false, addr: undefined });
  let counter = 0;
  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    getNFTs("0x211a69734d329807");
    counter += 1;
    console.log("NFT GARBAGE " + nfts + " times");
  }, [user.addr]);

  async function getNFTs(addr) {
    try {
      const result = await fcl.query({
        cadence: `
                import FlowTutorialMint from 0xf8d6e0586b0a20c7
                import MetadataViews from 0xf8d6e0586b0a20c7
                
                pub fun main(address: Address): [FlowTutorialMint.FlowTutorialMintData] {
                  let collection = getAccount(0xf8d6e0586b0a20c7).getCapability(FlowTutorialMint.CollectionPublicPath)
                                    .borrow<&{MetadataViews.ResolverCollection}>()
                                    ?? panic("Could not borrow a reference to the nft collection")
                
                  let ids = collection.getIDs()
                
                  let answer: [FlowTutorialMint.FlowTutorialMintData] = []
                
                  for id in ids {
                    
                    let nft = collection.borrowViewResolver(id: id)
                    let view = nft.resolveView(Type<FlowTutorialMint.FlowTutorialMintData>())!
                
                    let display = view as! FlowTutorialMint.FlowTutorialMintData
                    answer.append(display)
                  }
                    
                  return answer
                }
                `,
        args: (arg, t) => [arg(addr, t.Address)], // arg(argument, t.type)
      });
      setNfts(result);

      console.log(result);
    } catch (error) {
      console.log("err", error);
    }
  }

  return (
    <Wrapper>
      <h1>Best projects</h1>
      <main>
        <section>
          {nfts.map((nft, index) => {
            return (
              <div key={index} className="nftDiv">
                <img src={nft.url} alt="nft" />
                <p>{nft.type}</p>
                <p>Unique number: {nft.id}</p>
                <p>{nft.randomNumber}</p> {/*timestamp*/}
                <p>
                  {(() => {
                    console.log("the innitial timeStamp", nft.timeStamp);

                    var epochDate = Math.round(nft.timeStamp * 1000);
                    /*let options = {
                      hours: "numeric",
                      minutes: "numeric",
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    };

                    return new Date(epochDate)
                      .toLocaleDateString("en-US", options)
                      .toString();
                      */
                    // take this out:
                    return new Date(epochDate).toString();
                  })()}
                </p>
              </div>
            );
          })}
        </section>
      </main>
    </Wrapper>
  );
}