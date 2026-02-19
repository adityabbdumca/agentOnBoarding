import { createSlice } from "@reduxjs/toolkit";

export const agentSlice = createSlice({
  name: "agent",
  initialState: {
    agent: 0,
    completed: 0,
    menus: [],
    agentType: {},
    agentName: "",
    completedName: "",
    agentDiscrepancy: [],
    agentApproved: [],
    ocrModal: false,
  },
  reducers: {
    setAgent: (state, action) => {
      return { ...state, agent: action.payload };
    },
    setAgentName: (state, action) => {
      return { ...state, agentName: action.payload };
    },
    setCompletedName: (state, action) => {
      return { ...state, completedName: action.payload };
    },
    resetAgent: (state) => {
      return 0;
    },
    incrementAgent: (state) => {
      return {
        ...state,
        agent: state.agent + 1,
        agentName: state.menus[state.agent + 1]?.label,
      };
    },
    decrementAgent: (state) => {
      return {
        ...state,
        agent: state.agent - 1,
        agentName: state.menus[state.agent - 1]?.label,
      };
    },
    setAgentType: (state, action) => {
      return { ...state, agentType: action.payload };
    },
    setCompletedType: (state, action) => {
      return { ...state, completed: action.payload };
    },
    setDiscrepancy: (state, actions) => {
      return {
        ...state,
        agentDiscrepancy: [...state.agentDiscrepancy, actions.payload],
      };
    },
    setDiscrepancyArray: (state, actions) => {
      return {
        ...state,
        agentDiscrepancy: actions.payload,
      };
    },
    setApproved: (state, actions) => {
      return {
        ...state,
        agentApproved: [...state.agentApproved, actions.payload],
      };
    },
    setApprovedArray: (state, actions) => {
      return {
        ...state,
        agentApproved: actions.payload,
      };
    },
    setMenus: (state, action) => {
      return { ...state, menus: action.payload };
    },
    setOcrModal: (state) => {
      return { ...state, ocrModal: !state.ocrModal };
    },
  },
});

export const {
  setAgent,
  setAgentName,
  setCompletedName,
  resetAgent,
  incrementAgent,
  decrementAgent,
  setAgentType,
  setDiscrepancy,
  setApproved,
  setCompletedType,
  setDiscrepancyArray,
  setApprovedArray,
  setMenus,
  setOcrModal,
} = agentSlice.actions;

export default agentSlice.reducer;
