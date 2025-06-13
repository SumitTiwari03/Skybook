"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token)
      localStorage.setItem("user", JSON.stringify(action.payload.user))
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case "LOAD_USER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      }
    case "LOGOUT":
    case "AUTH_ERROR":
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await authAPI.getProfile()
          dispatch({
            type: "LOAD_USER_SUCCESS",
            payload: response.data.user,
          })
        } catch (error) {
          dispatch({ type: "AUTH_ERROR" })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadUser()
  }, [])

  // Login user
  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await authAPI.login(credentials)
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      })
      return { success: true, message: response.data.message }
    } catch (error) {
      dispatch({ type: "AUTH_ERROR" })
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await authAPI.register(userData)
      dispatch({
        type: "REGISTER_SUCCESS",
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      })
      return { success: true, message: response.data.message }
    } catch (error) {
      dispatch({ type: "AUTH_ERROR" })
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  // Logout user
  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
