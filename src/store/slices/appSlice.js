import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  user: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
})

export const { setTheme, setUser } = appSlice.actions

export default appSlice.reducer
