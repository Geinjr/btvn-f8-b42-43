import React from "react";
import {
    DialogTitle,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import {useContext} from "react";
import {DialogContext} from "../../utils";

export default function ({children, onClose, onSave, width, action, type }) {
    const {showDialog} = useContext(DialogContext);

    return (
        <>
            <Dialog
                open={showDialog}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" width={width}>
                    {`${action} ${type}`}
                </DialogTitle>
                <DialogContent>{children}</DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                    <Button onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
