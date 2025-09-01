import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activities: [],
  stats: {},
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setUserActivity: (state, action) => {
      state.activities = action.payload;
    },
    setUserStats: (state, action) => {
      state.stats = action.payload;
    },
  },
});

export const { setUserActivity, setUserStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
