import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import _ from "lodash";

import { Item } from "src/components/blocks";
import { Typography } from "src/components/elements";
import { SideModal } from "src/components/layouts";

import PersonInformation from "./components/PersonInformation";
import PersonEdit from "./components/PersonEdit";
import PersonChangePassword from "./components/PersonChangePassword";
import PersonAccount from "./components/PersonAccount";

const buttons = [
  { title: "Edit Person", icon: "fas fa-edit", to: "/edit-person" },
  {
    title: "Change Password",
    icon: "fas fa-lock",
    to: "/change-password"
  }
];

export class SideModalPerson extends Component {
  state = {
    person: {},
    isLoading: false,
    errors: {}
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
    const { match } = this.props;
    const { person, isLoading } = this.state;

    return (
      <SideModal>
        <SideModal.Header
          title={person.username}
          buttons={[
            { title: "Account", icon: "fas fa-user-circle", to: "/account" },
            {
              title: "Activity",
              icon: "fas fa-list-ul",
              to: "/activity"
            },
            {
              title: "Schedule",
              icon: "far fa-calendar-alt",
              to: "/schedule"
            },
            {
              title: "Tasks",
              icon: "far fa-check-circle",
              to: "/tasks"
            }
          ]}
          isLoading={isLoading}
        />

        <SideModal.Body isLoading={isLoading}>
          {_.isEmpty(person) ? (
            <Item>
              <Typography variant="base">User not found</Typography>
            </Item>
          ) : (
            <Switch>
              <Route
                exact
                path={match.url}
                render={() => <Redirect to={`${match.url}/account`} replace />}
              />

              <Route
                path={`${match.url}/account`}
                render={() => <PersonAccount data={person} fetchPerson={this.fetchPerson}/>}
              />

              <Route
                path={`${match.url}/edit`}
                render={() => (
                  <PersonEdit data={person} fetchPerson={this.fetchPerson} />
                )}
              />

              <Route
                path={`${match.url}/change-password`}
                render={() => <PersonChangePassword data={person} />}
              />
            </Switch>
          )}
        </SideModal.Body>
      </SideModal>
    );
  }
}

export default withRouter(SideModalPerson);
