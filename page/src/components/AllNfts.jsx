import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: #deb9ef;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 50px;

  button {
    display: flex;
    justify-self: center;
    text-align: center;
    width: 7em;
    padding: 2em;
    border: none;
    background-color: #deb9ef;
    border-radius: 10px;
    font-weight: 700;
    &:hover {
      color: white;
      background-color: #c54bfd;
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
  < .nftDiv {
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

  .nft-text {
    display: grid;
    grid-template-rows: 2em 3em 3em 3em;
    width: 10em;
  }

  .fund {
    text-align: center;
    display: grid;
    justify-content: center;
    align-items: center;
    padding-top: 1em;
    grid-template-rows: 5em 8em;
  }

  .center {
    align-items: center;
    justify-content: center;
    display: flex;
  }

  .formbold-form-input {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 13px 22px;
    border-radius: 5px;
    border: 1px solid #aeace7;
    background: #ffffff;
    font-weight: 500;
    font-size: 16px;
    color: #536387;
    outline: none;
    resize: none;
  }
  .formbold-form-input:focus {
    border-color: #6a64f1;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  }
`;

export default function AllNfts() {
  const [nfts, setNfts] = useState([]);
  const [shortDescription, setShortDescription] = useState([]);
  const [fundAmount, setFundAmount] = useState([]);
  const [user, setUser] = useState({ loggedIn: false, addr: undefined });

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    getNFTs();
  }, [user.addr]);

  async function fundProject() {
    console.log("FUNDED YEY", fundAmount);
    mintNFT("a", "b", "c", 1.0, "d", 20);
    //create NFT and put fundAmount as paramater
  }
  async function mintNFT(type, url, motto, timeStamp, description, fundAmount) {
    try {
      const res = await fcl.mutate({
        cadence: `
        import FlowTutorialMint from 0xf8d6e0586b0a20c7
        import NonFungibleToken from 0xf8d6e0586b0a20c7
        import MetadataViews from 0xf8d6e0586b0a20c7
        import FlowToken from 0x0ae53cb6e3f42a79
        import FungibleToken from 0xee82856bf20e2aa6

        transaction(type: String, url: String, motto: String, timeStamp: UFix64, description: String, fundAmount: Int){
            let recipientCollection: &FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic}

            prepare(signer: AuthAccount){

            if signer.borrow<&FlowTutorialMint.Collection>(from: FlowTutorialMint.CollectionStoragePath) == nil {
            signer.save(<- FlowTutorialMint.createEmptyCollection(), to: FlowTutorialMint.CollectionStoragePath)
            signer.link<&FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(FlowTutorialMint.CollectionPublicPath, target: FlowTutorialMint.CollectionStoragePath)
            }

            self.recipientCollection = signer.getCapability(FlowTutorialMint.CollectionPublicPath)
                                        .borrow<&FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic}>()!
            }
            execute{
                FlowTutorialMint.mintNFT(recipient: self.recipientCollection, type: type, url: url, motto: motto, timeStamp: timeStamp, description: description, fundAmount: fundAmount)
            }
        }
        `,
        args: (arg, t) => [
          arg(type, t.String),
          arg(url, t.String),
          arg(motto, t.String),
          arg(1125867793.1, t.UFix64), //doesn't matter what you put here, the time stamp is calculated on-chain
          arg(description, t.String),
          arg(fundAmount, t.Int),
        ],
        limit: 9999,
      });
      fcl.tx(res).subscribe((res) => {
        if (res.status === 4 && res.errorMessage === "") {
          window.alert("Successefully created NFT!");
          window.location.reload(false);
        }
      });

      console.log("txid", res);
    } catch (error) {
      console.log("err", error);
    }
  }

  async function getNFTs() {
    try {
      const result = await fcl.query({
        cadence: `

          import FlowTutorialMint from 0xf8d6e0586b0a20c7
          import MetadataViews from 0xf8d6e0586b0a20c7
          
          pub fun main(): [FlowTutorialMint.FlowTutorialMintData] {
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
      });

      setNfts(result);
      console.log("result is ", result);
      return nfts;
    } catch (error) {
      console.error("Error querying NFT collection:", error);
    }
  }
  console.log("NFTs:", nfts);
  return (
    <Wrapper>
      <h1>Fund projects</h1>
      <main>
        <section>
          {nfts.map((nft, index) => {
            return (
              <div key={index} className="nftDiv">
                <img src={nft.url} alt="nft" />
                <div class="nft-text">
                  <p class="center">{nft.type}</p>
                  <p class="center">Unique number: {nft.id}</p>
                  <p class="center">{nft.motto}</p>
                  <p class="center">
                    {(() => {
                      console.log("the innitial timeStamp", nft.timeStamp);

                      var epochDate = Math.round(nft.timeStamp * 1000);
                      let options = {
                        hours: "numeric",
                        minutes: "numeric",
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      };

                      return new Date(epochDate)
                        .toLocaleDateString("en-US", options)
                        .toString();

                      //return new Date(epochDate).toString();
                    })()}
                  </p>
                </div>
                <div class="fund">
                  <button onClick={() => fundProject(fundAmount)}>Fund</button>
                  <input
                    type="value"
                    id="fundButton"
                    class="formbold-form-input"
                    onChange={(e) => setFundAmount(e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </Wrapper>
  );
}
