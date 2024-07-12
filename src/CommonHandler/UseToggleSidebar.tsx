import React, { useState } from 'react'


const UseToggleSidebar = () => {
    const getSidebar = () => {
        const status = sessionStorage.getItem('toggle')
        if (status && status !== 'undefined') {
            return JSON.parse(status) 
        } else {
            return false
        }

    }

    const [open, setOpen] = useState(getSidebar())
    const saveOpen = (status: boolean) => {
        sessionStorage.setItem('toggle', JSON.stringify(status))
        setOpen(status)
    }
    return {
        setOpen: saveOpen,
        open
    }
}

export default UseToggleSidebar