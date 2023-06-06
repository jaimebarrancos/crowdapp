import styled from "styled-components";
import * as fcl from "@onflow/fcl";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
  padding: 100px;

  main {
    display: flex;
  }

  div {
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  button {
    width: 100px;
    padding: 10px;
    border: none;
    background-color: #8dfe89;
    border-radius: 20px;
    font-weight: 500;
    &:hover {
      color: white;
      background-color: black;
      cursor: pointer;
    }
  }

  img {
    width: 200px;
  }
`;

function MintComponent() {
  async function mintNFT(type, url, randomNumber, timeStamp) {
    try {
      const res = await fcl.mutate({
        cadence: `
            import FlowTutorialMint from 0xf8d6e0586b0a20c7
            import NonFungibleToken from 0xf8d6e0586b0a20c7
            import MetadataViews from 0xf8d6e0586b0a20c7

            transaction(type: String, url: String, randomNumber: String, timeStamp: UFix64){
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
                    FlowTutorialMint.mintNFT(recipient: self.recipientCollection, type: type, url: url, randomNumber: randomNumber, timeStamp: timeStamp)
                }
            }
            `,
        args: (arg, t) => [
          arg(type, t.String),
          arg(url, t.String),
          arg(randomNumber, t.String),
          arg(1125867793.1, t.UFix64), //doesn't matter what you put here, the time stamp is calculated on-chain
        ],
        limit: 9999,
      });
      fcl.tx(res).subscribe((res) => {
        if (res.status === 4 && res.errorMessage === "") {
          window.alert("NFT Minted!");
          window.location.reload(false);
        }
      });

      console.log("txid", res);
    } catch (error) {
      console.log("err", error);
    }
  }

  return (
    <Wrapper>
      <h1>Mint your Dog!</h1>
      <main>
        <div>
          <img
            src="https://images.unsplash.com/photo-1597733336794-12d05021d510?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
            alt="Mad Dog"
          />
          <h3>Mad Dog</h3>
          <button
            onClick={() =>
              mintNFT(
                "Mad Dog",
                "https://images.unsplash.com/photo-1597733336794-12d05021d510?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
              )
            }
          >
            Mint
          </button>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1517423568366-8b83523034fd"
            alt="Swag Dog"
          />
          <h3>Swag Dog</h3>
          <button
            onClick={() =>
              mintNFT(
                "Swag Dog",
                "https://images.unsplash.com/photo-1517423568366-8b83523034fd",
                "somethin",
                1685867793
              )
            }
          >
            Mint
          </button>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1517519014922-8fc06b814a0e"
            alt="French Dog"
          />
          <h3>French Dog, 7</h3>
          <button
            onClick={() =>
              mintNFT(
                "French Dog",
                "https://images.unsplash.com/photo-1517519014922-8fc06b814a0e",
                "27",
                1685879356160
              )
            }
          >
            Mint
          </button>
        </div>
      </main>
    </Wrapper>
  );
}

export default MintComponent;
