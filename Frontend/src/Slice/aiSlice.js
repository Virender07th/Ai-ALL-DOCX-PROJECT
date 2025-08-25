import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  questions: null,
}

const aiSlice  = createSlice({
    name:"ai",
    initialState:initialState,
    reducers:{
        setQuestions(state , value){
            state.questions = value.payload;
        },
    }
})

export const { setQuestions  } =aiSlice.actions;

export default aiSlice.reducer;