import { useReducer } from "react";
import { Product, NeedRow, SuppliesState, SuppliesAction } from "../types";

const suppliesReducer = (state: SuppliesState, action: SuppliesAction): SuppliesState => {
  switch (action.type) {
    case 'SET_EVACUEE_COUNT':
      return { ...state, evacueeCount: action.payload };
    case 'SET_TARGET_DAYS':
      return { ...state, targetDays: action.payload };
    case 'SET_ROWS':
      return { ...state, rows: action.payload };
    case 'UPDATE_ROW':
      return {
        ...state,
        rows: state.rows.map(row => 
          row.id === action.payload.id 
            ? { ...row, ...action.payload.updates }
            : row
        )
      };
    case 'ADD_ROW':
      return { ...state, rows: [...state.rows, action.payload] };
    case 'REMOVE_ROW':
      return { ...state, rows: state.rows.filter(row => row.id !== action.payload) };
    case 'SET_SAVING':
      return { ...state, saving: action.payload };
    case 'SET_IMAGE_STATE':
      return {
        ...state,
        imageStates: {
          ...state.imageStates,
          [action.payload.productId]: {
            ...state.imageStates[action.payload.productId],
            ...action.payload.updates
          }
        }
      };
    default:
      return state;
  }
};

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// 重複チェックと修正を行う関数
function createInitialRows(catalog: Product[]): NeedRow[] {
  if (catalog.length === 0) {
    return [{
      id: generateId(),
      productId: "",
      quantity: 1,
      priority: "medium",
      notes: ""
    }];
  }

  return [{
    id: generateId(),
    productId: catalog[0].id,
    quantity: 1,
    priority: "medium",
    notes: ""
  }];
}

export function useSuppliesState({
  initialEvacueeCount,
  initialTargetDays,
  catalog
}: {
  initialEvacueeCount: number;
  initialTargetDays: number;
  catalog: Product[];
}) {
  const [state, dispatch] = useReducer(suppliesReducer, {
    evacueeCount: initialEvacueeCount,
    targetDays: initialTargetDays,
    rows: createInitialRows(catalog),
    saving: false,
    imageStates: {}
  });

  return { state, dispatch };
}
