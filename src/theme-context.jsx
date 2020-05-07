import React from 'react'

export const ThemeContext = React.createContext({
    color: {
        notTyped: "white",
        correct: "green",
        incorrect: "red",
        bg: "#323232"
    }
})