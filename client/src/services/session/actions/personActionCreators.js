import axios from "axios";
import { setFlashMessage } from "./appActionCreators";

export const PEOPLE_PERSON_GET_REQUEST = "PEOPLE_PERSON_GET_REQUEST";
export const PEOPLE_PERSON_GET_SUCCESS = "PEOPLE_PERSON_GET_SUCCESS";
export const PEOPLE_PERSON_GET_FAILURE = "PEOPLE_PERSON_GET_FAILURE";

export const getPerson = id => dispatch => {
  dispatch({
    type: PEOPLE_PERSON_GET_REQUEST
  });

  axios
    .get(`/api/users/user/${id}`)
    .then(res => {
      dispatch({
        type: PEOPLE_PERSON_GET_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: PEOPLE_PERSON_GET_FAILURE,
        payload: err.response.data
      });
    });
};

export const PERSON_CLOCK_EDIT_REQUEST = "PERSON_CLOCK_EDIT_REQUEST";
export const PERSON_CLOCK_EDIT_SUCCESS = "PERSON_CLOCK_EDIT_SUCCESS";
export const PERSON_CLOCK_EDIT_FAILURE = "PERSON_CLOCK_EDIT_FAILURE";

export const editClock = data => dispatch => {
  dispatch({
    type: PERSON_CLOCK_EDIT_REQUEST
  });

  axios
    .post(`/api/clocks/${data.clockId}`, data.clock)
    .then(res => {
      dispatch({
        type: PERSON_CLOCK_EDIT_SUCCESS
      });

      dispatch(setFlashMessage("Updated clock successfully", "success"));
      dispatch(getPerson(data.userId));
    })
    .catch(err => {
      dispatch({
        type: PERSON_CLOCK_EDIT_FAILURE,
        payload: err.response.data
      });

      dispatch(setFlashMessage("An error occurred", "error"));
    });
};

export const PERSON_CLOCK_CORRECTION_REQUEST_APPROVE_REQUEST =
  "PERSON_CLOCK_CORRECTION_REQUEST_APPROVE_REQUEST";
export const PERSON_CLOCK_CORRECTION_REQUEST_APPROVE_SUCCESS =
  "PERSON_CLOCK_CORRECTION_REQUEST_APPROVE_SUCCESS";
export const PERSON_CLOCK_CORRECTION_REQUEST_APPROVE_FAILURE =
  "PERSON_CLOCK_CORRECTION_REQUEST_APPROVE_FAILURE";

// >>> data: { userId }
export const approveClockCorrectionRequest = data => dispatch => {
  dispatch({
    type: PERSON_CLOCK_CORRECTION_REQUEST_APPROVE_REQUEST
  });

  axios
    .post("/api/trainee/approve-clock-correction", data)
    .then(res => {
      dispatch({
        type: PERSON_CLOCK_CORRECTION_REQUEST_APPROVE_SUCCESS
      });

      dispatch(getPerson(data.userId));
      dispatch(
        setFlashMessage("Clock request approved successfully", "success")
      );
    })
    .catch(err => {
      dispatch({
        type: PERSON_CLOCK_CORRECTION_REQUEST_APPROVE_FAILURE,
        payload: err.reposnse.data
      });

      dispatch(setFlashMessage("An error occurred", "error"));
    });
};

export const PERSON_CLOCK_CORRECTION_REQUEST_REJECT_REQUEST =
  "PERSON_CLOCK_CORRECTION_REQUEST_REJECT_REQUEST";
export const PERSON_CLOCK_CORRECTION_REQUEST_REJECT_SUCCESS =
  "PERSON_CLOCK_CORRECTION_REQUEST_REJECT_SUCCESS";
export const PERSON_CLOCK_CORRECTION_REQUEST_REJECT_FAILURE =
  "PERSON_CLOCK_CORRECTION_REQUEST_REJECT_FAILURE";
export const rejectClockCorrectionRequest = data => dispatch => {
  dispatch({
    type: PERSON_CLOCK_CORRECTION_REQUEST_REJECT_REQUEST
  });

  axios
    .post("/api/trainee/reject-clock-correction", data)
    .then(res => {
      dispatch({
        type: PERSON_CLOCK_CORRECTION_REQUEST_APPROVE_SUCCESS
      });

      dispatch(getPerson(data.userId));
      dispatch(
        setFlashMessage("Clock request rejected successfully", "success")
      );
    })
    .catch(err => {
      dispatch({
        type: PERSON_CLOCK_CORRECTION_REQUEST_APPROVE_FAILURE,
        payload: err.reposnse.data
      });

      dispatch(setFlashMessage("An error occurred", "error"));
    });
};
