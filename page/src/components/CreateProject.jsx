import styled from "styled-components";
import * as fcl from "@onflow/fcl";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const StyledForm = styled.div`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: "Inter", sans-serif;
  }
  .formbold-mb-3 {
    margin-bottom: 15px;
  }
  .formbold-relative {
    position: relative;
  }
  .formbold-opacity-0 {
    opacity: 0;
  }
  .formbold-stroke-current {
    stroke: currentColor;
  }
  #supportCheckbox:checked ~ div span {
    opacity: 1;
  }

  .formbold-main-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
  }

  .formbold-form-wrapper {
    margin: 0 auto;
    width: 100%;
    background: white;
    padding: 40px;
  }

  .formbold-img {
    margin-bottom: 45px;
  }

  .formbold-form-title {
    margin-bottom: 30px;
  }
  .formbold-form-title h2 {
    font-weight: 600;
    font-size: 28px;
    line-height: 34px;
    color: #07074d;
  }
  .formbold-form-title p {
    font-size: 16px;
    line-height: 24px;
    color: #536387;
    margin-top: 12px;
  }

  .formbold-input-flex {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }
  .formbold-input-flex > div {
  }
  .formbold-form-input {
    width: 100%;
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
  .formbold-form-label {
    color: #536387;
    font-size: 14px;
    line-height: 24px;
    display: block;
    margin-bottom: 10px;
  }

  .formbold-checkbox-label {
    padding-top: 1em;
    display: flex;
    cursor: pointer;
    user-select: none;
    font-size: 16px;
    line-height: 24px;
    color: #536387;
  }
  .formbold-checkbox-label a {
    margin-left: 5px;
    color: #6a64f1;
  }
  .formbold-input-checkbox {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  .formbold-checkbox-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-right: 16px;
    margin-top: 2px;
    border: 0.7px solid #dde3ec;
    border-radius: 3px;
  }

  .formbold-btn {
    font-size: 16px;
    border-radius: 5px;
    padding: 14px 25px;
    border: none;
    font-weight: 500;
    background-color: #6a64f1;
    color: white;
    cursor: pointer;
    margin-top: 25px;
  }
  .formbold-btn:hover {
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  }

  .formbold-form-input-description {
    width: 100%;
    padding: 13px 22px;
    border-radius: 5px;
    border: 1px solid #dde3ec;
    background: #ffffff;
    font-weight: 500;
    font-size: 16px;
    color: #536387;
    outline: none;
    height: 10em;
    border-color: #aeace7;
  }
  .formbold-form-input-description:focus {
    border-color: #6a64f1;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  }
`;

function CreateProject() {
  const [projectName, setProjectName] = useState(""); // Declare a state variable...

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
    <StyledForm>
      <div class="formbold-main-wrapper">
        <div class="formbold-form-wrapper">
          <form action="https://formbold.com/s/FORM_ID" method="POST">
            <div class="formbold-form-title">
              <h2 class="">Publish your project!</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt.
              </p>
            </div>

            <div class="formbold-mb-3">
              <label for="projectname" class="formbold-form-label">
                Project name
              </label>
              <input
                type="text"
                name="projectname"
                id="projectname"
                class="formbold-form-input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              ></input>
            </div>

            <div class="formbold-mb-3">
              <label for="address2" class="formbold-form-label">
                Short description
              </label>
              <input
                type="text"
                name="address2"
                id="address2"
                class="formbold-form-input"
              />
            </div>

            <div class="formbold-mb-3">
              <label for="state" class="formbold-form-label">
                Description
              </label>
              <textarea
                type="email"
                name="email"
                id="email"
                class="formbold-form-input-description"
              ></textarea>
            </div>
            <div class="formbold-checkbox-wrapper">
              <label for="supportCheckbox" class="formbold-checkbox-label">
                <div class="formbold-relative">
                  <input
                    type="checkbox"
                    id="supportCheckbox"
                    class="formbold-input-checkbox"
                  />
                  <div class="formbold-checkbox-inner">
                    <span class="formbold-opacity-0">
                      <svg
                        width="11"
                        height="8"
                        viewBox="0 0 11 8"
                        fill="none"
                        class="formbold-stroke-current"
                      >
                        <path
                          d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                          stroke-width="0.4"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
                I agree to the
                <a href="#"> terms and conditions.</a>
              </label>
            </div>
            <Link to="/">
              <button
                class="formbold-btn"
                onClick={() =>
                  mintNFT(
                    "234",
                    "https://images.unsplash.com/photo-1517423568366-8b83523034fd",
                    "somethin",
                    1685867793
                  )
                }
              >
                Publish
              </button>
            </Link>
            <button onClick={console.log("textContent")}>PRINT BUTTON</button>
          </form>
        </div>
      </div>
    </StyledForm>
  );
}

export default CreateProject;
