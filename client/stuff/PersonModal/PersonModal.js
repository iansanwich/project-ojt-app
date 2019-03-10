import React, { Component, Fragment } from "react";
import styled from "styled-components";
import _ from "lodash";
import { Spring } from "react-spring/renderprops";
import { Link, withRouter, Route, Switch } from "react-router-dom";

import { Item, Box, Container, Area } from "src/components/blocks";
import { Button, Typography } from "src/components/elements";
import { LoadingScene } from "src/components/compounds";

import PersonInformation from "./components/PersonInformation";
import PersonEdit from "./components/PersonEdit";
import PersonChangePassword from "./components/PersonChangePassword";

import axios from "axios";

const StyledPerson = styled.div`
  /* border: 1px solid magenta; */
  width: 100%;
  min-height: 100%;
  position: relative;
  display: grid;
  grid-template-areas:
    "header back"
    "body back";
  grid-template-rows: auto 3fr;
  grid-template-columns: 3fr 1fr;
  z-index: 100;

  > * {
    z-index: 100;
  }

  @media (max-width: ${p => p.theme.breakpoint.tabletLandscape}) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .area-person-header {
    grid-area: header;
    background-color: ${p => p.theme.color.grey.light};
    padding-bottom: ${p => p.theme.size.s};
    display: grid;
    grid-template-columns: auto 1fr;
    min-height: ${p => p.theme.incrementFixed(4)};
  }

  .container-person-close {
    margin-left: auto;
  }

  .area-person-body {
    /* border: 1px solid magenta; */
    grid-area: body;
    background-color: ${p => p.theme.color.white};
    overflow-y: auto;

    /* @media (max-width: ${p => p.theme.breakpoint.tabletLandscape}) {
      overflow-y: unset;
    } */
  }

  .area-person-back {
    grid-area: back;
    grid-column: 1 / -1;
    background-image: linear-gradient(
      to top right,
      ${p => p.theme.color.primary.dark},
      ${p => p.theme.color.primary.main}
    );
    opacity: 0.8;
    z-index: 99;

    @media (max-width: ${p => p.theme.breakpoint.tabletLandscape}) {
      display: none;
    }
  }

  .item-person-profilePicture { 
    width: ${p => p.theme.incrementFixed(8)};
    height: ${p => p.theme.incrementFixed(8)};
    background-color: ${p => p.theme.color.grey.light};
  }


  .item-personInformation-divider {
    width: 100%;
    height: var(--size-xxs);
    background-color: ${p => p.theme.color.primary.light};
  }

  .item-personInformation-property {
    min-width: ${p => p.theme.incrementFixed(12)};
    max-width: ${p => p.theme.incrementFixed(12)};
  }

  /* >>> PersonEdit */
  .item-personEdit-input-name {
    width: ${p => p.theme.incrementFixed(8)};
  }

  .item-personEdit-divider {
    width: 100%;
    height: var(--size-xxs);
    background-color: ${p => p.theme.color.primary.light};
  }

  .item-personEdit-input {
    width: ${p => p.theme.incrementFixed(16)};    
  }

`;

export class Person extends Component {
  state = {
    person: null,
    isLoading: false,
    errors: null
  };

  fetchPerson = () => {
    const { ...state } = this.state;
    const { ...props } = this.props;

    this.setState({ ...state, isLoading: true }, () => {
      axios
        .get(`/api/users/${props.match.params.id}`)
        .then(res => {
          this.setState({ ...state, person: res.data, isLoading: false });
        })
        .catch(err => {
          this.setState({
            ...state,
            isLoading: false,
            errors: err.response.data
          });
        });
    });
  };

  componentDidMount() {
    this.fetchPerson();
  }

  handleInputChange = e => {
    this.setState({
      person: { ...this.state.person, [e.target.name]: e.target.value }
    });
  };

  render() {
    const { history, match } = this.props;
    const { person, isLoading, errors } = this.state;

    return (
      <StyledPerson>
        {/* >>> AREA: header */}
        <Spring
          delay={100}
          native
          from={{ transform: "translateX(-100%)" }}
          to={{ transform: "translateX(0%)" }}
        >
          {style => (
            <Area
              NAME="person-header"
              padding="inset-base"
              as="header"
              animate={style}
            >
              <Box wrap>
                {isLoading ? null : errors || _.isEmpty(person) ? null : (
                  <Fragment>
                    <Item margin="wrap-base">
                      <Item as={Link} to={`${match.url}`} replace>
                        <Typography variant="display-1" as="h1">
                          {person.username}
                        </Typography>
                      </Item>
                    </Item>

                    <Item margin="wrap-base">
                      <Button
                        variant="secondary"
                        as={Link}
                        to={`${match.url}/edit-person`}
                        replace
                      >
                        <Item center margin="inline-s">
                          <i className="fas fa-edit" />
                        </Item>
                        Edit Person
                      </Button>
                    </Item>

                    <Item margin="wrap-base">
                      <Button
                        variant="secondary"
                        as={Link}
                        to={`${match.url}/change-password`}
                        replace
                      >
                        <Item center margin="inline-s">
                          <i className="fas fa-lock" />
                        </Item>
                        Change Password
                      </Button>
                    </Item>
                  </Fragment>
                )}
              </Box>

              <Container NAME="person-close">
                <Item>
                  <Button
                    variant="secondary"
                    icon
                    rounded
                    onClick={() => {
                      history.goBack();
                    }}
                  >
                    <i className="fas fa-times" />
                  </Button>
                </Item>
              </Container>
            </Area>
          )}
        </Spring>

        {/* >>> AREA: body */}
        <Spring
          delay={100}
          native
          from={{ transform: "translateX(-100%)" }}
          to={{ transform: "translateX(0%)" }}
        >
          {style => (
            <Area NAME="person-body" padding="inset-base" animate={style}>
              {isLoading ? (
                <LoadingScene />
              ) : errors || _.isEmpty(person) ? (
                <Item>
                  <Typography variant="base">User not found</Typography>
                </Item>
              ) : (
                <Switch>
                  <Route
                    exact
                    path={`${match.url}`}
                    render={() => <PersonInformation data={person} />}
                  />

                  <Route
                    path={`${match.url}/edit-person`}
                    render={() => (
                      <PersonEdit
                        data={person}
                        fetchPerson={this.fetchPerson}
                      />
                    )}
                  />

                  <Route
                    path={`${match.url}/change-password`}
                    render={() => <PersonChangePassword data={person} />}
                  />
                </Switch>
              )}
            </Area>
          )}
        </Spring>

        <Area
          NAME="person-back"
          onClick={() => {
            history.goBack();
          }}
        />
      </StyledPerson>
    );
  }
}

export default withRouter(Person);