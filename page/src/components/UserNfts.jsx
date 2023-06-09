import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";
import styled from "styled-components";
import "./style/styleUserNfts.css";

export default function UserNfts() {
  const [nfts, setNfts] = useState([]);

  const [user, setUser] = useState({ loggedIn: false, addr: undefined });
  let counter = 0;
  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    getNFTs(user.addr);
    counter += 1;
    console.log("NFT GARBAGE " + nfts + " times");
  }, [user.addr]);

  async function getNFTs(addr) {
    try {
      const result = await fcl.query({
        cadence:
          `
                import FlowTutorialMint from 0xf8d6e0586b0a20c7
                import MetadataViews from 0xf8d6e0586b0a20c7
                
                pub fun main(address: Address): [FlowTutorialMint.FlowTutorialMintData] {
                  let collection = getAccount(` +
          user.addr +
          `).getCapability(FlowTutorialMint.CollectionPublicPath)
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
    <div className="wrapper">
      <h1>Your NFTs and your projects</h1>
      <section>
        {nfts.map((nft, index) => {
          return (
            <div key={index} className="nftDiv">
              <img src={nft.url} alt="nft" />
              <div key={index} className="nftText">
                <p>{nft.type}</p>
                <p>{nft.id}</p>
                <p>{nft.motto}</p> {/*timestamp*/}
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
            </div>
          );
        })}
      </section>
    </div>
  );
}
