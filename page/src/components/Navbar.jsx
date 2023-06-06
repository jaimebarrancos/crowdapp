import * as fcl from "@onflow/fcl";
import styled from "styled-components";
import { useState, useEffect } from "react";
import "../flow/config";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.nav`
  width: -webkit-fill-available;
  background-color: #d8ccff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2em 1em;

  button {
    background-color: white;
    padding: 0.3em 2em;
    border: none;
    border-radius: 0.5em;
    font-size: 18px;
    height: 50px;

    &:hover {
      color: white;
      background-color: black;
      cursor: pointer;
    }
  }

  div {
    display: flex;
    gap: 15px;
  }
  box {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

function Navbar() {
  const [user, setUser] = useState({ loggedIn: false, addr: undefined });
  const [flow, setFlow] = useState(0);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    if (user.addr !== "") getFlow(user.addr);
  }, [user.addr]);

  const logOut = async () => {
    await fcl.unauthenticate();
    setUser({ addr: undefined, loggedIn: false });
  };

  const logIn = async () => {
    await fcl.authenticate();
  };
  //testnet flowtoken: 0x7e60df042a9c0868
  //fungibletoken: 0x9a0766d93b6608b7
  async function getFlow(address) {
    try {
      const res = await fcl.query({
        cadence: `
                  import FlowToken from 0x0ae53cb6e3f42a79 
                  import FungibleToken from 0xee82856bf20e2aa6
    
                  pub fun main(address: Address): UFix64{
                    let balanceVault =  getAccount(address).getCapability(/public/flowTokenBalance).borrow<&FlowToken.Vault{FungibleToken.Balance}>()!
                    return balanceVault.balance
                  }`,
        args: (arg, t) => [arg(address, t.Address)],
      });
      setFlow(res);
    } catch (error) {
      console.log("err:", error);
    }
  }
  return (
    <Wrapper>
      <h1>Crowdapp</h1>
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/contributions">
        <button>Your contributions</button>
      </Link>
      <Link to="/publish">
        <button>Publish</button>
      </Link>

      {user.loggedIn ? (
        <div>
          <button onClick={() => logOut()}>Logout</button>
          <box>
            <span>Address - {user.addr}</span>
            <span>Flow Balance - {flow}</span>
          </box>
        </div>
      ) : (
        <button onClick={() => logIn()}>Login</button>
      )}
    </Wrapper>
  );
}

export default Navbar;
