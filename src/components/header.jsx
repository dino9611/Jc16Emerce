import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "./header.css";
import { FaMotorcycle, FaCartArrowDown } from "react-icons/fa";

class Header extends Component {
  state = {
    isOpen: false,
  };

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    return (
      <div>
        <Navbar className="bg-light px-5 shadow " light expand="md">
          <NavbarBrand href="/">
            <span
              className="font-weight-bold header-brand"
              style={{ color: "#ff8f54" }}
            >
              <FaMotorcycle /> MotoLI
            </span>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {false ? (
                <>
                  <NavItem className="py-2 mx-2">History</NavItem>
                  <NavItem className="py-2 mx-2">
                    <FaCartArrowDown style={{ fontSize: "25px" }} />
                    <Badge
                      style={{
                        position: "relative",
                        bottom: 10,
                        right: 5,
                        backgroundColor: "#ff8f54",
                      }}
                      className="px-1 rounded-circle text-center"
                    >
                      3
                    </Badge>
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav> Nama user</DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Option 1</DropdownItem>
                      <DropdownItem>Option 2</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>Reset</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </>
              ) : (
                <>
                  <NavItem className="mx-2">
                    <button className="header-login rounded px-4 py-2 font-weight-bold">
                      Login
                    </button>
                  </NavItem>
                  <NavItem className="mx-2">
                    <button className="header-login rounded px-4 py-2 font-weight-bold">
                      Sign Up
                    </button>
                  </NavItem>
                </>
              )}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Header;
