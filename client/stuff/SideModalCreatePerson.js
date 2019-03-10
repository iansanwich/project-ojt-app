import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Spring } from "react-spring/renderprops";
import { Link, withRouter } from "react-router-dom";

import { Item, Box, Container, Area } from "src/components/blocks";
import { Button, Typography, Photo } from "src/components/elements";
import {
  TextInput,
  RadioInput,
  SelectInput,
  LoadingScene,
  CloudinaryUploadWidget
} from "src/components/compounds";
import axios from "axios";

import { getPeople } from "src/pages/Admin/scenes/People/peopleActionCreators";
import { setFlashMessage } from "src/services/session/actions/appActionCreators";

import enums from "src/services/enums";

import SideModal from "src/components/layouts/SideModal/SideModal";

export class SideModalCreatePerson extends Component {
  state = {
    data: {
      role: "",
      group: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      trainingDuration: "",
      firstName: "",
      middleName: "",
      lastName: "",
      nickname: "",
      gender: "",
      dateOfBirth: "",
      address: "",
      contactNumber: "",
      school: "",
      adviserName: "",
      adviserContactNumber: "",
      guardianName: "",
      guardianContactNumber: "",
      profilePictureUrl: ""
    },
    errors: {},
    groups: [],
    isLoading: false
  };

  componentDidMount() {
    this.setState({ ...this.state, isLoading: true }, () => {
      axios
        .get("/api/groups?field=name")
        .then(res => {
          this.setState({ ...this.state, groups: res.data, isLoading: false });
        })
        .catch(err => {
          this.setState({
            ...this.state,
            errors: err.response.data,
            isLoading: false
          });
        });
    });
  }

  handleInputChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
  };

  handleProfilePictureUpload = photoUrl => {
    this.setState({
      data: { ...this.state.data, profilePictureUrl: photoUrl }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { ...state } = this.state;
    const { ...props } = this.props;

    this.setState({ ...state, isLoading: true, errors: {} }, () => {
      axios
        .post("/api/users/register", state.data)
        .then(res => {
          this.setState({ ...state, data: res.data, isLoading: false }, () => {
            props.getPeople();
            props.history.goBack();
            props.setFlashMessage(
              `${res.data} was created successfully.`,
              "success"
            );
          });
        })
        .catch(err => {
          this.setState(
            {
              ...state,
              errors: err.response.data,
              isLoading: false
            },
            () => {
              props.setFlashMessage("An error occurred", "error");
            }
          );
        });
    });
  };

  render() {
    const { history } = this.props;
    const { isLoading, data, groups, errors } = this.state;

    return (
      <SideModal>
        <SideModal.Header title="Create Person" />

        <SideModal.Body isLoading={isLoading}>
          <Box margin="stack-base">
            <Item NAME="createPerson-input-name" margin="inline-base">
              <Typography variant="display-3">Role</Typography>
            </Item>

            <Item NAME="createPerson-input">
              <RadioInput
                options={[
                  {
                    id: "role-administrator",
                    value: "administrator",
                    label: "Administrator"
                  },
                  {
                    id: "role-supervisor",
                    value: "supervisor",
                    label: "Supervisor"
                  },
                  {
                    id: "role-trainee",
                    value: "trainee",
                    label: "Trainee"
                  },
                  {
                    id: "role-employee",
                    value: "employee",
                    label: "Employee"
                  }
                ]}
                onChange={this.handleInputChange}
                name="role"
                value={data.role}
              />
            </Item>
          </Box>

          {/* >>> Role must be filled */}
          {data.role && (
            <Fragment>
              {/* >>> GROUP */}
              {/* >>> Group is not for administrators */}
              {data.role !== "administrator" && (
                <Box margin="stack-base">
                  <Item
                    NAME="createPerson-input-name"
                    left
                    margin="inline-base"
                  >
                    <Typography
                      variant="display-3"
                      as="label"
                      htmlFor="group-input"
                    >
                      Group
                    </Typography>
                  </Item>

                  <Item NAME="createPerson-input">
                    <SelectInput
                      autoFocus
                      id="group-input"
                      value={data.group}
                      onChange={this.handleInputChange}
                      name="group"
                      options={groups.map(group => ({
                        label: group.name,
                        value: group._id
                      }))}
                      error={errors.group}
                      disabled={isLoading}
                    />
                  </Item>
                </Box>
              )}

              <Item NAME="createPerson-divider" margin="stack-base" />

              {/* >>> Account details */}
              <Item margin="stack-base">
                <Typography variant="display-3">Account Information</Typography>
              </Item>

              {[
                {
                  label: "Username",
                  name: "username",
                  type: "text",
                  id: "username-input",
                  role: ["administrator", "supervisor", "trainee", "employee"],
                  autoFocus: data.role === enums.roles.ADMINISTRATOR
                },
                {
                  label: "Password",
                  name: "password",
                  type: "password",
                  id: "password-input",
                  role: ["administrator", "supervisor", "trainee", "employee"]
                },
                {
                  label: "Confirm Password",
                  name: "confirmPassword",
                  type: "password",
                  id: "confirm-password-input",
                  role: ["administrator", "supervisor", "trainee", "employee"]
                },
                {
                  label: "Training Duration",
                  name: "trainingDuration",
                  type: "number",
                  id: "training-duration-input",
                  role: ["trainee"],
                  min: "1",
                  max: "999"
                }
              ]
                .filter(item => item.role.includes(data.role))
                .map(item => (
                  <Box margin="stack-base" key={item.id}>
                    <Item
                      NAME="createPerson-input-name"
                      left
                      margin="inline-base"
                    >
                      <Typography variant="base" as="label" htmlFor={item.id}>
                        {item.label}
                      </Typography>
                    </Item>

                    <Item NAME="createPerson-input">
                      <TextInput
                        autoFocus={item.autoFocus}
                        name={item.name}
                        id={item.id}
                        type={item.type}
                        value={data[item.name]}
                        onChange={this.handleInputChange}
                        error={errors[item.name]}
                        disabled={isLoading}
                        {...item}
                      />
                    </Item>
                  </Box>
                ))}

              <Item NAME="createPerson-divider" margin="stack-base" />

              {/* >>> Personal details */}
              <Item margin="stack-base">
                <Typography variant="display-3">
                  Personal Information &mdash; Optional
                </Typography>
              </Item>

              {[
                {
                  label: "First Name",
                  name: "firstName",
                  type: "text",
                  id: "first-name-input",
                  role: ["administrator", "supervisor", "trainee", "employee"]
                },
                {
                  label: "Middle Name",
                  name: "middleName",
                  type: "text",
                  id: "middle-name-input",
                  role: ["administrator", "supervisor", "trainee", "employee"]
                },
                {
                  label: "Last Name",
                  name: "lastName",
                  type: "text",
                  id: "last-name-input",
                  role: ["administrator", "supervisor", "trainee", "employee"]
                },
                {
                  label: "Nickname",
                  name: "nickname",
                  type: "text",
                  id: "nickname-input",
                  role: ["administrator", "supervisor", "trainee", "employee"]
                }
              ]
                .filter(item => item.role.includes(data.role))
                .map(item => (
                  <Box margin="stack-base" key={item.id}>
                    <Item
                      NAME="createPerson-input-name"
                      left
                      margin="inline-base"
                    >
                      <Typography variant="base" as="label" htmlFor={item.id}>
                        {item.label}
                      </Typography>
                    </Item>

                    <Item NAME="createPerson-input">
                      <TextInput
                        name={item.name}
                        id={item.id}
                        type={item.type}
                        value={data[item.name]}
                        onChange={this.handleInputChange}
                        error={errors[item.name]}
                        disabled={isLoading}
                      />
                    </Item>
                  </Box>
                ))}

              <Box margin="stack-base">
                <Item NAME="createPerson-input-name" left margin="inline-base">
                  <Typography variant="base" as="label" htmlFor="gender-input">
                    Gender
                  </Typography>
                </Item>

                <Item NAME="createPerson-input">
                  <SelectInput
                    id="gender-input"
                    onChange={this.handleInputChange}
                    name="gender"
                    options={[
                      {
                        label: "Male",
                        value: "male"
                      },
                      {
                        label: "Female",
                        value: "female"
                      }
                    ]}
                  />
                </Item>
              </Box>

              {[
                {
                  label: "Date of Birth",
                  name: "dateOfBirth",
                  type: "date",
                  id: "date-of-birth-input",
                  role: ["trainee"]
                },
                {
                  label: "Address",
                  name: "address",
                  type: "text",
                  id: "address-input",
                  role: ["trainee"]
                },
                {
                  label: "Contact Number",
                  name: "contactNumber",
                  type: "text",
                  id: "contact-number-input",
                  role: ["administrator", "supervisor", "trainee", "employee"]
                },
                {
                  label: "E-mail Address",
                  name: "email",
                  type: "email",
                  id: "email-input",
                  role: ["administrator", "supervisor", "trainee", "employee"]
                },

                {
                  label: "School",
                  name: "school",
                  type: "text",
                  id: "school-input",
                  role: ["trainee"]
                },
                {
                  label: "Adviser Name",
                  name: "adviserName",
                  type: "text",
                  id: "adviser-name-input",
                  role: ["trainee"]
                },
                {
                  label: "Adviser Contact Number",
                  name: "adviserContactNumber",
                  type: "text",
                  id: "adviser-contact-number-input",
                  role: ["trainee"]
                },
                {
                  label: "Guardian Name",
                  name: "guardianName",
                  type: "text",
                  id: "guardian-name-input",
                  role: ["trainee"]
                },
                {
                  label: "Guardian Contact Number",
                  name: "guardianContactNumber",
                  type: "text",
                  id: "guardian-contact-number-input",
                  role: ["trainee"]
                }
              ]
                .filter(item => item.role.includes(data.role))
                .map(item => (
                  <Box margin="stack-base" key={item.id}>
                    <Item
                      NAME="createPerson-input-name"
                      left
                      margin="inline-base"
                    >
                      <Typography variant="base" as="label" htmlFor={item.id}>
                        {item.label}
                      </Typography>
                    </Item>

                    <Item NAME="createPerson-input">
                      <TextInput
                        name={item.name}
                        id={item.id}
                        type={item.type}
                        value={data[item.name]}
                        onChange={this.handleInputChange}
                        error={errors[item.name]}
                        disabled={isLoading}
                      />
                    </Item>
                  </Box>
                ))}

              <Box margin="stack-base">
                <Item NAME="createPerson-input-name" left margin="inline-base">
                  <Typography variant="base">Profile Picture</Typography>
                </Item>

                <Box NAME="createPerson-input" row>
                  <Item
                    NAME="createPerson-profilePicture"
                    margin="inline-m"
                    center
                  >
                    {data.profilePictureUrl === "" ? (
                      <Typography variant="base">No profile picture</Typography>
                    ) : (
                      <Photo>
                        <img src={data.profilePictureUrl} alt="" />
                      </Photo>
                    )}
                  </Item>

                  <Item>
                    <CloudinaryUploadWidget
                      handleProfilePictureUpload={
                        this.handleProfilePictureUpload
                      }
                    />
                  </Item>
                </Box>
              </Box>

              <Item margin="stack-l">
                <Button
                  type="submit"
                  variant="primary"
                  onClick={this.handleSubmit}
                  disabled={isLoading}
                >
                  Create Person
                </Button>
              </Item>
            </Fragment>
          )}
        </SideModal.Body>
      </SideModal>
    );
  }
}

export default withRouter(
  connect(
    null,
    { getPeople: getPeople, setFlashMessage: setFlashMessage }
  )(SideModalCreatePerson)
);