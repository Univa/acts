import React from 'react'

export const SettingsContext = React.createContext({
    theme: {
        color: {
            notTyped: "white",
            correct: "green",
            incorrect: "red",
            bg: "#323232"
        }
    }
})